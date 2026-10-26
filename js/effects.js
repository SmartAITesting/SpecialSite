/* Floating decorations (hearts, balloons, sparkles, embers) and confetti. */
(function () {
  const { rand, pick, reduced } = U;

  /* ---------------------------------------------------------------- Fx */
  const layer = document.getElementById("fx");
  let theme = "home";
  let timer = null;

  const PALETTES = {
    home: ["#f4a6b8", "#e0607e", "#f9c6d0", "#d9455f"],
    sorry: ["#f2b8c6", "#e8a0b4", "#f7d3dc"],
    eyes: ["#ff9a6b", "#ff6f8e", "#ffd0a0"]
  };

  function makeItem(fast) {
    const el = document.createElement("span");
    el.className = "float";
    const pal = PALETTES[theme] || PALETTES.home;
    if (theme === "eyes") {
      el.classList.add("ember");
      const s = rand(4, 10);
      el.style.setProperty("--s", s + "px");
      el.style.background = pick(pal);
    } else {
      const roll = Math.random();
      let svg, size;
      if (theme === "home" && roll > 0.9) { svg = Art.balloonSmall(pick(pal)); size = rand(22, 32); el.classList.add("tall"); }
      else if (roll > 0.74 && theme === "home") { svg = Art.sparkle(); size = rand(12, 20); el.classList.add("twinkle"); }
      else { svg = Art.heartSmall(pick(pal)); size = rand(14, 30); }
      el.innerHTML = svg;
      el.style.setProperty("--s", size + "px");
    }
    el.style.setProperty("--x", rand(2, 96).toFixed(1) + "%");
    el.style.setProperty("--sway", rand(-40, 40).toFixed(0) + "px");
    const base = theme === "eyes" ? rand(14, 22) : theme === "sorry" ? rand(12, 18) : rand(9, 15);
    el.style.setProperty("--d", (fast ? rand(2.6, 4.2) : base).toFixed(1) + "s");
    el.addEventListener("animationend", () => el.remove());
    layer.appendChild(el);
  }

  function tick() {
    if (document.hidden) return;
    const cap = window.innerWidth < 700 ? 8 : 15;
    if (layer.childElementCount < cap) makeItem(false);
  }

  function setTheme(t) {
    theme = t;
    clearInterval(timer);
    layer.innerHTML = "";
    if (reduced()) return;
    for (let i = 0; i < 4; i++) setTimeout(() => makeItem(false), i * 300);
    timer = setInterval(tick, t === "eyes" ? 1500 : 1100);
  }

  function hearts(n = 24) {
    if (reduced()) return;
    for (let i = 0; i < n; i++) setTimeout(() => makeItem(true), i * 70);
  }

  window.Fx = { setTheme, hearts };

  /* ---------------------------------------------------------- Confetti */
  const canvas = document.getElementById("confetti");
  const ctx = canvas.getContext("2d");
  let parts = [];
  let raf = null;
  let dpr = 1;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
  }
  window.addEventListener("resize", resize);
  resize();

  const COLORS = ["#e0607e", "#f4a6b8", "#ffd36b", "#fff", "#d9455f", "#ffb3c6", "#8ec5ff"];

  function heartPath(x, y, s) {
    ctx.beginPath();
    ctx.moveTo(x, y + s * 0.3);
    ctx.bezierCurveTo(x, y - s * 0.2, x - s * 0.6, y - s * 0.2, x - s * 0.6, y + s * 0.15);
    ctx.bezierCurveTo(x - s * 0.6, y + s * 0.5, x, y + s * 0.8, x, y + s);
    ctx.bezierCurveTo(x, y + s * 0.8, x + s * 0.6, y + s * 0.5, x + s * 0.6, y + s * 0.15);
    ctx.bezierCurveTo(x + s * 0.6, y - s * 0.2, x, y - s * 0.2, x, y + s * 0.3);
    ctx.closePath();
  }

  function frame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    parts = parts.filter((p) => p.life > 0 && p.y < canvas.height + 40);
    for (const p of parts) {
      p.vx *= 0.99; p.vy = p.vy * 0.99 + 0.16 * dpr;
      p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life -= 1;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = Math.min(1, p.life / 40);
      ctx.fillStyle = p.color;
      if (p.shape === "heart") { heartPath(0, -p.size / 2, p.size); ctx.fill(); }
      else if (p.shape === "dot") { ctx.beginPath(); ctx.arc(0, 0, p.size / 2.4, 0, 6.283); ctx.fill(); }
      else ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      ctx.restore();
    }
    if (parts.length) raf = requestAnimationFrame(frame);
    else { raf = null; ctx.clearRect(0, 0, canvas.width, canvas.height); }
  }

  /* x, y are 0..1 fractions of the viewport */
  function burst({ x = 0.5, y = 0.5, count = 110, power = 1 } = {}) {
    if (reduced()) return;
    for (let i = 0; i < count; i++) {
      const a = rand(0, Math.PI * 2);
      const v = rand(4, 13) * dpr * power;
      const r = Math.random();
      parts.push({
        x: x * canvas.width, y: y * canvas.height,
        vx: Math.cos(a) * v, vy: Math.sin(a) * v - 5 * dpr,
        rot: rand(0, 6.28), vr: rand(-0.25, 0.25),
        size: rand(9, 17) * dpr,
        color: pick(COLORS),
        shape: r < 0.42 ? "heart" : r < 0.7 ? "dot" : "rect",
        life: rand(90, 170)
      });
    }
    if (!raf) raf = requestAnimationFrame(frame);
  }

  window.Confetti = { burst };
})();
