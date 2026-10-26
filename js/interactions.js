/* Reusable interactive bits: typewriter, runaway "No" button, password check. */
(function () {
  const { rand, reduced } = U;

  /* ---------------------------------------------------------------
     Typewriter. Every character is pre-rendered (invisible) so the
     card keeps its final size and nothing jumps while typing.
     --------------------------------------------------------------- */
  function typer(container, lines, { speed = 46 } = {}) {
    container.textContent = "";
    const chars = [];
    lines.forEach((line) => {
      const p = document.createElement("p");
      p.className = "type-line";
      const start = chars.length;
      for (const ch of line) {
        const s = document.createElement("span");
        s.className = "ch";
        s.textContent = ch;
        p.appendChild(s);
        chars.push({ s, ch, last: false });
      }
      if (chars.length > start) chars[chars.length - 1].last = true;
      container.appendChild(p);
    });

    let i = 0, timer = null, caret = null, finished = false, onDone = null;

    function finish() {
      if (finished) return;
      finished = true;
      if (caret) caret.classList.remove("caret");
      if (onDone) onDone();
    }
    function step() {
      if (i >= chars.length) return finish();
      const c = chars[i++];
      if (caret) caret.classList.remove("caret");
      c.s.classList.add("on", "caret");
      caret = c.s;
      let d = speed * rand(0.7, 1.3);
      if (/[.,!?…:;]/.test(c.ch)) d += 240;
      if (c.last) d += 700;
      timer = setTimeout(step, d);
    }
    function showAll() {
      clearTimeout(timer);
      chars.forEach((c) => c.s.classList.add("on"));
      finish();
    }
    return {
      start(cb) {
        onDone = cb || null;
        if (reduced()) return showAll();
        step();
      },
      skip: showAll,
      cancel() { clearTimeout(timer); },
      get done() { return finished; }
    };
  }

  /* ---------------------------------------------------------------
     The playful "No" button. It hops away (and shrinks) each time
     she tries to press it — by mouse, finger or keyboard.
     --------------------------------------------------------------- */
  function runaway({ arena, no, yes, labels }) {
    let n = 0, last = 0;

    function dodge() {
      const now = Date.now();
      if (now - last < 140) return;
      last = now;
      n++;

      const ar = arena.getBoundingClientRect();
      if (!no.classList.contains("fled")) {
        const r = no.getBoundingClientRect();
        const ph = document.createElement("span");       // keeps "Yes" from sliding sideways
        ph.style.cssText = `display:inline-block;width:${r.width}px;height:${r.height}px`;
        no.before(ph);
        no.style.left = r.left - ar.left + "px";
        no.style.top = r.top - ar.top + "px";
        no.classList.add("fled");
      }

      const scale = Math.max(0.5, 1 - n * 0.06);
      no.style.setProperty("--sc", scale);
      no.textContent = labels[Math.min(n, labels.length - 1)];
      yes.style.setProperty("--sc", Math.min(1.3, 1 + n * 0.045));

      const ow = no.offsetWidth, oh = no.offsetHeight;
      const w = ow * scale, h = oh * scale;
      const yr = yes.getBoundingClientRect();
      const cur = no.getBoundingClientRect();
      let best = null, bestScore = -1;
      for (let t = 0; t < 30; t++) {
        const x = rand(0, Math.max(0, ar.width - w));
        const y = rand(0, Math.max(0, ar.height - h));
        const gx = ar.left + x, gy = ar.top + y;
        const overlapsYes = gx < yr.right + 14 && gx + w > yr.left - 14 && gy < yr.bottom + 14 && gy + h > yr.top - 14;
        const dist = Math.hypot(gx - cur.left, gy - cur.top);
        const score = (overlapsYes ? 0 : 1000) + dist;
        if (score > bestScore) { bestScore = score; best = { x, y }; }
      }
      no.style.left = best.x - (ow - w) / 2 + "px";
      no.style.top = best.y - (oh - h) / 2 + "px";
    }

    no.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") dodge(); });
    no.addEventListener("pointerdown", (e) => { e.preventDefault(); dodge(); });
    no.addEventListener("click", (e) => { e.preventDefault(); dodge(); });
  }

  const normalize = (s) => String(s).toLowerCase().replace(/[^a-z0-9]/g, "");
  const passwordOk = (typed, secret) => normalize(typed) !== "" && normalize(typed) === normalize(secret);

  window.Interactions = { typer, runaway, passwordOk };
})();
