/* Small helpers shared by every script. */
(function () {
  const U = (window.U = {});

  U.reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  U.sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  U.rand = (a, b) => a + Math.random() * (b - a);
  U.pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  U.clamp = (n, a, b) => Math.min(b, Math.max(a, n));

  /* h("div.card#id", {attr: v, onclick: fn, html: "<b>"}, ...children) */
  U.h = function (spec, attrs, ...kids) {
    const parts = spec.split(/(?=[.#])/);
    const el = document.createElement(parts[0] || "div");
    parts.slice(1).forEach((p) => {
      if (p[0] === ".") el.classList.add(p.slice(1));
      else el.id = p.slice(1);
    });
    if (attrs && typeof attrs === "object" && !(attrs instanceof Node) && !Array.isArray(attrs)) {
      for (const [k, v] of Object.entries(attrs)) {
        if (v === false || v == null) continue;
        if (k === "html") el.innerHTML = v;
        else if (k.startsWith("on") && typeof v === "function") el.addEventListener(k.slice(2), v);
        else if (v === true) el.setAttribute(k, "");
        else el.setAttribute(k, v);
      }
    } else if (attrs != null) {
      kids.unshift(attrs);
    }
    const add = (c) => {
      if (c == null || c === false) return;
      if (Array.isArray(c)) return c.forEach(add);
      el.appendChild(c instanceof Node ? c : document.createTextNode(String(c)));
    };
    kids.forEach(add);
    return el;
  };

  /* "line one\nline two" → text with <br> */
  U.lines = function (text) {
    const frag = document.createDocumentFragment();
    String(text).split("\n").forEach((line, i) => {
      if (i) frag.appendChild(document.createElement("br"));
      frag.appendChild(document.createTextNode(line));
    });
    return frag;
  };

  /* Storage that never throws (private windows, blocked storage…) */
  function makeStore(area) {
    return {
      get(key, fallback) {
        try {
          const raw = window[area].getItem(key);
          return raw == null ? fallback : JSON.parse(raw);
        } catch (e) { return fallback; }
      },
      set(key, value) {
        try { window[area].setItem(key, JSON.stringify(value)); } catch (e) { /* ignore */ }
      }
    };
  }
  U.local = makeStore("localStorage");
  U.session = makeStore("sessionStorage");

  let toastTimer;
  U.toast = function (msg) {
    const t = document.getElementById("toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
  };

  /* Horizontal swipe detector: onNext (swipe left) / onPrev (swipe right) */
  U.swipe = function (el, onNext, onPrev) {
    let sx = 0, sy = 0, t0 = 0, active = false;
    el.addEventListener("pointerdown", (e) => {
      if (e.target.closest("input, textarea")) return;
      active = true; sx = e.clientX; sy = e.clientY; t0 = Date.now();
    });
    el.addEventListener("pointerup", (e) => {
      if (!active) return;
      active = false;
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (Date.now() - t0 < 700 && Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.6) {
        (dx < 0 ? onNext : onPrev)();
      }
    });
    el.addEventListener("pointercancel", () => { active = false; });
  };
})();
