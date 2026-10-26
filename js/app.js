/* Hash router, scene transitions, top bar and music. */
(function () {
  const C = window.CONTENT;
  const $ = (s) => document.querySelector(s);
  const stage = $("#stage"), backBtn = $("#backBtn"), musicBtn = $("#musicBtn"), audio = $("#bgm");
  const THEME = { landing: "home", menu: "home", love: "home", sorry: "sorry", eyes: "eyes" };

  document.title = C.siteTitle || "Hello";

  let current = null;
  let fxTheme = null;

  function parse() {
    const [scene = "landing", step = "0"] = location.hash.replace(/^#\/?/, "").split("/");
    return { scene, step: parseInt(step, 10) || 0 };
  }

  const Router = (window.Router = {
    go(scene, step = 0) {
      const hash = scene === "landing" ? "#/landing" : `#/${scene}/${step}`;
      if (location.hash === hash) render();
      else location.hash = hash;
    }
  });

  function updateTopbar(name) {
    if (name === "landing") { backBtn.hidden = true; return; }
    backBtn.hidden = false;
    const toHome = name === "menu";
    backBtn.textContent = "← " + (toHome ? C.menu.backHome : C.menu.backToMenu);
    backBtn.onclick = () => Router.go(toHome ? "landing" : "menu");
  }

  function render() {
    const parsed = parse();
    const name = Scenes[parsed.scene] && Scenes.totals[parsed.scene] ? parsed.scene : "landing";
    const step = U.clamp(parsed.step, 0, Scenes.totals[name] - 1);

    // Section 3 is gated: steps > 0 need the password; the gate itself is skipped once unlocked.
    if (name === "eyes") {
      const ok = Scenes.eyesUnlocked();
      if (!ok && step > 0) return location.replace("#/eyes/0");
      if (ok && step === 0) return location.replace("#/eyes/1");
    }

    const key = name + "/" + step;
    if (current && current.key === key) return;
    const prev = current;

    let dir = "fade";
    if (prev) {
      if (prev.name !== name) dir = name === "menu" || prev.name === "menu" ? "zoom" : "fade";
      else dir = step > prev.step ? "fwd" : "back";
    }

    const cleanups = [];
    const ctx = {
      later(fn, ms) { const t = setTimeout(fn, ms); cleanups.push(() => clearTimeout(t)); return t; },
      onLeave(fn) { cleanups.push(fn); }
    };

    const el = Scenes[name](step, ctx);
    el.dataset.dir = dir;
    stage.appendChild(el);

    if (prev) {
      prev.cleanups.forEach((f) => f());
      prev.el.dataset.dir = dir;
      prev.el.classList.add("leaving");
      setTimeout(() => prev.el.remove(), U.reduced() ? 0 : 480);
    }
    current = { key, name, step, el, cleanups };

    const theme = THEME[name];
    document.body.className = "theme-" + theme;
    document.querySelector('meta[name="theme-color"]').setAttribute("content", theme === "eyes" ? "#2a0a16" : "#FAF3E8");
    if (fxTheme !== theme) { fxTheme = theme; Fx.setTheme(theme); }

    if ((name === "love" || name === "sorry") || (name === "eyes" && step > 0)) Scenes.visited.add(name);

    updateTopbar(name);
    window.scrollTo(0, 0);
    const focusTarget = el.querySelector('[tabindex="-1"]');
    if (focusTarget) focusTarget.focus({ preventScroll: true });
  }

  window.addEventListener("hashchange", render);

  /* ---------- music ---------- */
  if (C.music && C.music.file) {
    audio.src = C.music.file;
    audio.volume = 0.55;
    musicBtn.hidden = false;
    const paint = () => {
      const on = !audio.paused;
      musicBtn.setAttribute("aria-pressed", String(on));
      musicBtn.setAttribute("aria-label", on ? "Turn music off" : "Turn music on");
      musicBtn.classList.toggle("off", !on);
      musicBtn.textContent = "♪";
    };
    paint();
    musicBtn.addEventListener("click", async () => {
      if (audio.paused) {
        try { await audio.play(); } catch (e) { U.toast("Couldn't play the music file 🎵"); }
      } else {
        audio.pause();
      }
      paint();
    });
    audio.addEventListener("pause", paint);
    audio.addEventListener("play", paint);
  }

  if (C.previewBanner) $("#preview-tag").hidden = false;

  render();
})();
