/* Builds every scene's DOM from content.js. Each scene fn: (step, ctx) → element. */
(function () {
  const C = window.CONTENT;
  const { h, lines } = U;
  const go = (scene, step = 0) => window.Router.go(scene, step);
  const Scenes = (window.Scenes = {});

  /* ---------- shared state ---------- */
  const visited = {
    all: () => U.local.get("ammu.visited", {}),
    has(id) { return !!this.all()[id]; },
    add(id) { const v = this.all(); if (!v[id]) { v[id] = true; U.local.set("ammu.visited", v); } }
  };
  const eyesUnlocked = () => !!U.session.get("ammu.eyes", false);
  const unveiled = new Set();
  Scenes.visited = visited;
  Scenes.eyesUnlocked = eyesUnlocked;
  // Optional blocks: delete one from content.js and its step simply disappears.
  const LOVE_EXTRAS = ["grateful", "coupons", "finale"].filter((k) => C.love[k]);
  const SORRY_STEPS = ["intro", "wrong", "learned", "promise"].filter((k) => C.sorry[k]).concat("question");
  Scenes.totals = {
    landing: 1,
    menu: 1,
    love: C.love.slides.length + LOVE_EXTRAS.length,
    sorry: SORRY_STEPS.length,
    eyes: C.eyes.slides.length + 2
  };

  /* ---------- tiny builders ---------- */
  const scene = (name) => h("section.scene.scene-" + name);
  const dots = (total, cur) =>
    h("div.dots", { role: "img", "aria-label": `Step ${cur + 1} of ${total}` },
      Array.from({ length: total }, (_, i) => h("span.dot" + (i === cur ? ".on" : ""))));

  function navRow(name, step, total, { back, next, hideNext, finalToMenu = true } = {}) {
    const prev = step > 0
      ? h("button.btn.btn-ghost", { type: "button", onclick: () => go(name, step - 1) }, "← " + (back || "Back"))
      : h("span.spacer");
    const last = step >= total - 1;
    let nextBtn = h("span.spacer");
    if (!hideNext) {
      nextBtn = last && finalToMenu
        ? h("button.btn", { type: "button", onclick: () => go("menu") }, "♡ " + C.menu.backToMenu)
        : h("button.btn", { type: "button", onclick: () => go(name, step + 1) }, (next || "Next") + " →");
    }
    const row = h("div.navrow", prev, nextBtn);
    row.nextBtn = nextBtn;
    return row;
  }

  function enableSwipe(el, name, step, total) {
    U.swipe(
      el,
      () => step < total - 1 && go(name, step + 1),
      () => step > 0 && go(name, step - 1)
    );
  }

  function sign(text) {
    return h("p.sign", text, h("span.sig", C.signOff));
  }

  /* ================================================================
     1. Landing
     ================================================================ */
  Scenes.landing = () => {
    const L = C.landing;
    const el = scene("landing");
    el.append(
      h("div.hero-art.bounce", { html: Art.heartChar("happy") }),
      h("h1.title.title-xl", { tabindex: "-1" }, L.title),
      h("p.lead", lines(L.text)),
      h("button.btn.btn-xl.wiggle", { type: "button", onclick: () => go("menu") }, L.button + " ✨")
    );
    return el;
  };

  /* ================================================================
     2. Menu
     ================================================================ */
  Scenes.menu = () => {
    const M = C.menu;
    const el = scene("menu");
    const cards = M.cards.map((card, i) => {
      const opened = visited.has(card.id);
      const locked = card.locked && !eyesUnlocked();
      return h("button.menu-card.mc-" + card.id,
        {
          type: "button",
          style: `--i:${i}`,
          "aria-label": `${card.title}${opened ? " (already opened)" : ""}${locked ? " (locked)" : ""}`,
          onclick: () => go(card.id)
        },
        h("span.menu-art", { html: Art[card.art](), "aria-hidden": "true" }),
        h("span.menu-title", card.title),
        h("span.menu-hint", card.hint),
        opened && h("span.check", { "aria-hidden": "true" }, "✓"),
        locked && !opened && h("span.lock", { "aria-hidden": "true" }, "🔒")
      );
    });
    el.append(
      h("h1.title", { tabindex: "-1" }, M.title),
      h("p.lead.small", M.text),
      h("div.menu-grid", cards)
    );
    return el;
  };

  /* ================================================================
     3. Why I Love You
     ================================================================ */
  function loveSlide(s) {
    return h("article.slide",
      h("figure.polaroid",
        h("img", { src: s.image, alt: s.alt, decoding: "async" }),
        h("figcaption.caption", s.caption)),
      h("div.slide-text",
        h("h2.title", { tabindex: "-1" }, s.title),
        h("p", s.text)));
  }

  function grateful() {
    const G = C.love.grateful;
    const total = G.reasons.length;
    let opened = 0;
    const counter = h("p.counter", { "aria-live": "polite" }, `0 / ${total}`);
    const grid = h("div.reasons-grid");

    G.reasons.forEach((text, i) => {
      const card = h("div.flip.reason");
      const front = h("button.face.front", { type: "button", "aria-label": `Reveal reason ${i + 1}` },
        h("span.heart-ico", { html: Art.heartSmall("#e0607e"), "aria-hidden": "true" }),
        h("span.num", String(i + 1)));
      const back = h("div.face.back", { inert: true }, h("p", text));
      front.addEventListener("click", () => {
        if (card.classList.contains("is-flipped")) return;
        card.classList.add("is-flipped");
        front.setAttribute("inert", "");
        back.removeAttribute("inert");
        const r = card.getBoundingClientRect();
        Confetti.burst({ x: (r.left + r.width / 2) / innerWidth, y: (r.top + r.height / 2) / innerHeight, count: 16, power: 0.55 });
        opened++;
        counter.textContent = opened === total ? G.doneText : `${opened} / ${total}`;
        counter.classList.toggle("done", opened === total);
      });
      card.append(h("div.flip-inner", front, back));
      grid.append(card);
    });

    return h("div.panel",
      h("h2.title", { tabindex: "-1" }, G.title),
      h("p.lead.small", G.intro),
      grid, counter);
  }

  function coupons() {
    const K = C.love.coupons;
    const redeemed = new Set(U.local.get("ammu.coupons", []));
    const grid = h("div.coupons-grid");

    K.items.forEach((it, i) => {
      const wrap = h("div.flip.coupon");
      const front = h("button.face.front.ticket", { type: "button", "aria-label": `${it.title}. Tap to flip.` },
        h("span.ticket-main",
          h("small", K.front),
          h("span.ticket-heart", { html: Art.heartSmall("#ffd9df"), "aria-hidden": "true" }),
          h("strong", it.title)),
        h("span.ticket-stub", { "aria-hidden": "true" }, "LOVE YOU"));
      const redeemBtn = h("button.btn.btn-sm", { type: "button" }, K.redeem);
      const flipBack = h("button.link", { type: "button" }, K.flipBack);
      const back = h("div.face.back.ticket", { inert: true },
        h("span.ticket-main",
          h("strong.coupon-title", it.title),
          h("span.coupon-text", it.text),
          h("span.coupon-actions", redeemBtn, flipBack)),
        h("span.stamp", { "aria-hidden": "true" }, K.redeemed));

      const setFlipped = (on) => {
        wrap.classList.toggle("is-flipped", on);
        if (on) { front.setAttribute("inert", ""); back.removeAttribute("inert"); }
        else { back.setAttribute("inert", ""); front.removeAttribute("inert"); }
      };
      const markRedeemed = () => {
        wrap.classList.add("redeemed");
        redeemBtn.disabled = true;
        redeemBtn.textContent = K.redeemed;
      };
      if (redeemed.has(i)) markRedeemed();

      front.addEventListener("click", () => setFlipped(true));
      flipBack.addEventListener("click", () => setFlipped(false));
      redeemBtn.addEventListener("click", () => {
        redeemed.add(i);
        U.local.set("ammu.coupons", [...redeemed]);
        markRedeemed();
        const r = wrap.getBoundingClientRect();
        Confetti.burst({ x: (r.left + r.width / 2) / innerWidth, y: (r.top + r.height / 2) / innerHeight, count: 50, power: 0.8 });
      });

      wrap.append(h("div.flip-inner", front, back));
      grid.append(wrap);
    });

    return h("div.panel.wide",
      h("h2.title", { tabindex: "-1" }, K.title),
      h("p.lead.small", K.intro),
      grid);
  }

  function loveFinale(ctx) {
    const F = C.love.finale;
    const burst = () => {
      Confetti.burst({ x: 0.5, y: 0.45, count: 150 });
      Confetti.burst({ x: 0.15, y: 0.7, count: 60, power: 0.8 });
      Confetti.burst({ x: 0.85, y: 0.7, count: 60, power: 0.8 });
    };
    ctx.later(burst, 450);
    return h("div.panel.finale",
      h("div.hero-art.small.bounce", { html: Art.heartChar("love") }),
      h("h2.title.title-xl", { tabindex: "-1" }, F.title),
      h("p.lead", lines(F.text)),
      sign(F.sign),
      h("button.btn", { type: "button", onclick: burst }, F.button));
  }

  Scenes.love = (step, ctx) => {
    const L = C.love, n = L.slides.length, total = Scenes.totals.love;
    const el = scene("love");
    let body;
    if (step < n) body = loveSlide(L.slides[step]);
    else {
      const key = LOVE_EXTRAS[step - n];
      body = key === "grateful" ? grateful() : key === "coupons" ? coupons() : loveFinale(ctx);
    }
    el.append(body, dots(total, step), navRow("love", step, total));
    enableSwipe(el, "love", step, total);
    return el;
  };

  /* ================================================================
     4. I'm Sorry
     ================================================================ */
  const paper = (...kids) => h("div.card.paper", ...kids);
  const heartList = (items) => (items && items.length ? h("ul.hearts-list", items.map((t) => h("li", t))) : null);

  function forgive(ctx) {
    const Q = C.sorry.question, R = C.sorry.result;
    const yes = h("button.btn.btn-yes", { type: "button" }, Q.yes);
    const no = h("button.btn.btn-no", { type: "button" }, Q.no);
    const arena = h("div.arena", yes, no);
    const card = paper(
      h("div.hero-art.small", { html: Art.heartChar("sorry") }),
      h("h2.title", { tabindex: "-1" }, Q.title),
      h("p.lead.small", Q.text),
      arena);

    Interactions.runaway({ arena, no, yes, labels: Q.noLabels });

    yes.addEventListener("click", () => {
      const done = paper(
        h("div.hero-art.small.bounce", { html: Art.heartChar("love") }),
        h("h2.title.title-xl", { tabindex: "-1" }, R.title),
        h("p.lead", lines(R.text)),
        sign(R.sign),
        h("button.btn", { type: "button", onclick: () => go("menu") }, "♡ " + C.menu.backToMenu));
      done.classList.add("celebrate");
      card.replaceWith(done);
      done.querySelector("[tabindex]").focus({ preventScroll: true });
      Confetti.burst({ x: 0.5, y: 0.4, count: 160 });
      ctx.later(() => Confetti.burst({ x: 0.2, y: 0.55, count: 70 }), 350);
      ctx.later(() => Confetti.burst({ x: 0.8, y: 0.55, count: 70 }), 600);
      Fx.hearts(26);
      document.querySelector(".scene-sorry .navrow")?.remove();
      document.querySelector(".scene-sorry .dots")?.remove();
    });
    return card;
  }

  Scenes.sorry = (step, ctx) => {
    const S = C.sorry, total = Scenes.totals.sorry;
    const el = scene("sorry");
    const key = SORRY_STEPS[step];
    let body;
    if (key === "intro") {
      body = paper(
        h("div.hero-art.small", { html: Art.heartChar("sorry") }),
        h("h1.title", { tabindex: "-1" }, S.intro.title),
        h("p.lead", S.intro.text));
    } else if (key === "question") {
      body = forgive(ctx);
    } else {
      const b = S[key];
      body = paper(
        h("h2.title", { tabindex: "-1" }, b.title),
        b.text && h("p.lead" + (b.items ? ".small" : ""), b.text),
        heartList(b.items));
    }
    const last = step === total - 1;
    el.append(body, dots(total, step), navRow("sorry", step, total, { back: S.back, next: S.next, hideNext: last }));
    if (!last) enableSwipe(el, "sorry", step, total);
    return el;
  };

  /* ================================================================
     5. For Your Eyes Only
     ================================================================ */
  function eyesGate() {
    const E = C.eyes;
    const input = h("input.field", {
      type: "password", autocomplete: "off", autocapitalize: "off", spellcheck: "false",
      placeholder: E.gatePlaceholder, "aria-label": "Password", "aria-describedby": "gate-msg"
    });
    const msg = h("p.gate-msg#gate-msg", { role: "alert" });
    const form = h("form.gate", { novalidate: true }, input, h("button.btn", { type: "submit" }, E.gateButton));
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (Interactions.passwordOk(input.value, E.password)) {
        U.session.set("ammu.eyes", true);
        go("eyes", 1);
      } else {
        msg.textContent = E.gateWrong;
        form.classList.remove("shake");
        void form.offsetWidth;
        form.classList.add("shake");
        input.select();
      }
    });
    return h("div.panel.gatebox",
      h("div.candle", { html: Art.candle() }),
      h("h1.title", { tabindex: "-1" }, E.gateTitle),
      h("p.lead.small", E.gateText),
      form, msg,
      h("p.hint", E.hint));
  }

  function eyesSlide(i, ctx, nextHolder) {
    const E = C.eyes, S = E.slides[i], key = "s" + i;
    const typed = h("div.typed");
    const t = Interactions.typer(typed, S.lines, { speed: 48 });
    ctx.onLeave(t.cancel);
    const card = h("div.veil-card", typed);
    const finish = () => {
      unveiled.add(key);
      nextHolder.ready();
    };
    if (unveiled.has(key)) {
      t.skip();
      ctx.later(finish, 0);
    } else {
      const veil = h("button.veil", { type: "button", "aria-label": "Tap to unveil" }, h("span.veil-text", E.unveil));
      let started = false;
      veil.addEventListener("click", () => {
        started = true;
        veil.classList.add("lift");
        setTimeout(() => veil.remove(), 900);
        t.start(finish);
      });
      card.append(veil);
      card.addEventListener("click", () => { if (started && !t.done) t.skip(); });
    }
    return h("div.panel.eyes-slide", h("h2.title", { tabindex: "-1" }, S.title), card);
  }

  function eyesTeaser(ctx, nextHolder) {
    const T = C.eyes.teaser;
    const typed = h("div.typed");
    const t = Interactions.typer(typed, T.lines, { speed: 52 });
    ctx.onLeave(t.cancel);
    const signEl = h("div.reveal-after", sign(T.sign));
    ctx.later(() => t.start(() => { signEl.classList.add("show"); nextHolder.ready(); }), 900);
    return h("div.panel.finale",
      h("div.candle", { html: Art.candle() }),
      h("h2.title.title-xl", { tabindex: "-1" }, T.title),
      h("div.veil-card.open", { onclick: () => t.skip() }, typed),
      signEl);
  }

  Scenes.eyes = (step, ctx) => {
    const E = C.eyes, n = E.slides.length, total = Scenes.totals.eyes;
    const el = scene("eyes");
    if (step === 0) {
      el.append(eyesGate());
      return el;
    }
    const nextHolder = { row: null, ready() { if (this.row && this.row.nextBtn.tagName === "BUTTON") { this.row.nextBtn.disabled = false; this.row.nextBtn.classList.add("pulse"); } } };
    const body = step <= n ? eyesSlide(step - 1, ctx, nextHolder) : eyesTeaser(ctx, nextHolder);
    const row = navRow("eyes", step, total, { back: E.back, next: E.next, hideNext: false });
    if (step === 1) row.firstChild.replaceWith(h("span.spacer"));
    const isDone = step <= n ? unveiled.has("s" + (step - 1)) : false;
    if (row.nextBtn.tagName === "BUTTON" && !isDone) row.nextBtn.disabled = true;
    nextHolder.row = row;
    el.append(body, dots(total - 1, step - 1), row);
    return el;
  };
})();
