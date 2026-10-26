/* Original kawaii-style illustrations, drawn as inline SVG strings. */
(function () {
  const HEART = "M60 106 C18 78 6 54 6 37 C6 20 19 9 34 9 C46 9 55 15 60 25 C65 15 74 9 86 9 C101 9 114 20 114 37 C114 54 102 78 60 106Z";
  const INK = "#7d1d36";
  let uid = 0;

  /* ----- face parts ----- */
  const eye = (x, y) =>
    `<ellipse cx="${x}" cy="${y}" rx="5.5" ry="7.5" fill="#3b0f1c"/><circle cx="${x + 1.8}" cy="${y - 2.8}" r="2.2" fill="#fff"/><circle cx="${x - 1.6}" cy="${y + 2.6}" r="1" fill="#fff"/>`;
  const happyEye = (x, y) =>
    `<path d="M${x - 7} ${y + 2} Q${x} ${y - 9} ${x + 7} ${y + 2}" fill="none" stroke="#3b0f1c" stroke-width="3.2" stroke-linecap="round"/>`;
  const blush = `<ellipse cx="29" cy="62" rx="9" ry="5.5" fill="#ffb3c6" opacity=".85"/><ellipse cx="91" cy="62" rx="9" ry="5.5" fill="#ffb3c6" opacity=".85"/>`;
  const smile = `<path d="M51 60 Q60 71 69 60" fill="none" stroke="#3b0f1c" stroke-width="3" stroke-linecap="round"/>`;

  function heartChar(mood = "happy") {
    const id = "hg" + ++uid;
    let face;
    let extra = "";
    if (mood === "sorry") {
      face =
        eye(44, 50) + eye(76, 50) +
        `<path d="M35 41 L52 35 M85 41 L68 35" stroke="#3b0f1c" stroke-width="3" stroke-linecap="round"/>` +
        `<path d="M53 68 Q60 61 67 68" fill="none" stroke="#3b0f1c" stroke-width="3" stroke-linecap="round"/>` +
        blush +
        `<path d="M86 62 Q92 72 86 77 Q80 72 86 62Z" fill="#a9e0ff" stroke="#5aa9d6" stroke-width="1.5"/>`;
      extra =
        `<g transform="rotate(-28 34 24)"><rect x="12" y="16" width="44" height="16" rx="6" fill="#ffd9b0" stroke="${INK}" stroke-width="2.2"/><path d="M28 16 V32 M40 16 V32" stroke="#e8b27d" stroke-width="2"/></g>`;
    } else if (mood === "wink") {
      face = eye(44, 49) + `<path d="M69 51 Q76 43 83 51" fill="none" stroke="#3b0f1c" stroke-width="3.4" stroke-linecap="round"/>` + blush + smile;
    } else if (mood === "love") {
      face = happyEye(44, 50) + happyEye(76, 50) + blush +
        `<path d="M48 59 Q60 76 72 59 Z" fill="#8f1d3c" stroke="#3b0f1c" stroke-width="2.6" stroke-linejoin="round"/>`;
    } else {
      face = eye(44, 49) + eye(76, 49) + blush + smile;
    }
    return `<svg viewBox="-8 0 136 124" role="img" aria-label="A cute smiling heart character" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff86a2"/><stop offset="1" stop-color="#da3a63"/></linearGradient></defs>
      <ellipse cx="60" cy="118" rx="34" ry="5" fill="#7d1d36" opacity=".12"/>
      <ellipse cx="46" cy="108" rx="9" ry="6" fill="#c42c55" stroke="${INK}" stroke-width="3"/>
      <ellipse cx="74" cy="108" rx="9" ry="6" fill="#c42c55" stroke="${INK}" stroke-width="3"/>
      <ellipse cx="3" cy="62" rx="8" ry="5.5" fill="#e8476f" stroke="${INK}" stroke-width="3" transform="rotate(-25 3 62)"/>
      <ellipse cx="117" cy="62" rx="8" ry="5.5" fill="#e8476f" stroke="${INK}" stroke-width="3" transform="rotate(25 117 62)"/>
      <path d="${HEART}" fill="url(#${id})" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
      <ellipse cx="28" cy="27" rx="9" ry="5" fill="#fff" opacity=".55" transform="rotate(-35 28 27)"/>
      ${face}${extra}
    </svg>`;
  }

  function gift() {
    return `<svg viewBox="0 0 160 160" role="img" aria-label="A gift box" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="80" cy="149" rx="52" ry="6" fill="#7d1d36" opacity=".12"/>
      <rect x="30" y="76" width="100" height="68" rx="9" fill="#f7a8bc" stroke="${INK}" stroke-width="3.5"/>
      <rect x="22" y="56" width="116" height="26" rx="9" fill="#e0607e" stroke="${INK}" stroke-width="3.5"/>
      <rect x="70" y="56" width="20" height="88" fill="#ffe7b0" stroke="${INK}" stroke-width="3.5"/>
      <path d="M80 56 C54 14 24 38 56 56Z" fill="#ffe7b0" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
      <path d="M80 56 C106 14 136 38 104 56Z" fill="#ffe7b0" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
      <circle cx="80" cy="54" r="8" fill="#ffd57a" stroke="${INK}" stroke-width="3.5"/>
      <circle cx="53" cy="106" r="4" fill="#3b0f1c"/><circle cx="54.4" cy="104.4" r="1.4" fill="#fff"/>
      <circle cx="107" cy="106" r="4" fill="#3b0f1c"/><circle cx="108.4" cy="104.4" r="1.4" fill="#fff"/>
      <ellipse cx="45" cy="117" rx="7" ry="4" fill="#ff8fab"/><ellipse cx="115" cy="117" rx="7" ry="4" fill="#ff8fab"/>
      <path d="M72 114 Q80 123 88 114" fill="none" stroke="#3b0f1c" stroke-width="3" stroke-linecap="round"/>
    </svg>`;
  }

  function donut(cx, cy, ice, kind) {
    // wobbly icing outline
    let d = "";
    for (let i = 0; i <= 48; i++) {
      const a = (i / 48) * Math.PI * 2;
      const r = 21.5 + 2 * Math.sin(a * 7);
      d += (i ? "L" : "M") + (cx + r * Math.cos(a)).toFixed(1) + " " + (cy + r * Math.sin(a)).toFixed(1);
    }
    const cols = ["#fff3b0", "#7ee0c3", "#ffffff", "#ff7ea5", "#8ec5ff"];
    let sprinkles = "";
    if (kind !== "plain") {
      for (let i = 0; i < 9; i++) {
        const a = i * 2.4 + cx, r = 12 + (i % 3) * 4.2;
        const x = cx + r * Math.cos(a), y = cy + r * Math.sin(a);
        const color = kind === "orange" ? "#ff9d3b" : cols[i % cols.length];
        sprinkles += `<rect x="${(x - 3).toFixed(1)}" y="${(y - 1).toFixed(1)}" width="6" height="2.4" rx="1.2" fill="${color}" transform="rotate(${(i * 47) % 180} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
      }
    }
    const drizzle = kind === "drizzle"
      ? `<path d="M${cx - 18} ${cy - 6} Q${cx - 8} ${cy - 14} ${cx} ${cy - 6} T${cx + 18} ${cy - 6} M${cx - 16} ${cy + 8} Q${cx - 6} ${cy} ${cx + 4} ${cy + 8} T${cx + 19} ${cy + 6}" fill="none" stroke="#fff6e8" stroke-width="2.4" stroke-linecap="round"/>`
      : "";
    return `<circle cx="${cx}" cy="${cy}" r="29" fill="#eab36c" stroke="#7a4a1b" stroke-width="2.5"/>
      <path d="${d}Z" fill="${ice}" stroke="#6a3a1a" stroke-width="1.8" stroke-linejoin="round"/>
      ${drizzle}${sprinkles}
      <circle cx="${cx}" cy="${cy}" r="7.5" fill="#8f2a22" stroke="#5e1712" stroke-width="2"/>`;
  }

  function donuts() {
    return `<svg viewBox="0 0 160 160" role="img" aria-label="A box of four donuts" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="8" width="144" height="144" rx="14" fill="#b83a2f" stroke="#6e1b16" stroke-width="3.5"/>
      <rect x="16" y="16" width="128" height="128" rx="8" fill="#8f2a22"/>
      ${donut(48, 48, "#f58bb0", "sprinkle")}${donut(112, 48, "#7b3f26", "drizzle")}
      ${donut(48, 112, "#5a2a1a", "orange")}${donut(112, 112, "#fff0d6", "sprinkle")}
    </svg>`;
  }

  function balloon() {
    return `<svg viewBox="0 0 160 160" role="img" aria-label="Two heart balloons" xmlns="http://www.w3.org/2000/svg">
      <path d="M75 113 C70 132 88 142 80 157" fill="none" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>
      <path d="M114 100 C121 122 96 141 80 157" fill="none" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>
      <g transform="translate(76 34) scale(.62)">
        <path d="${HEART}" fill="#f7a8bc" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
        <ellipse cx="30" cy="28" rx="9" ry="5" fill="#fff" opacity=".6" transform="rotate(-35 30 28)"/>
      </g>
      <g transform="translate(14 8) scale(.98)">
        <path d="${HEART}" fill="#e23c5c" stroke="${INK}" stroke-width="3.6" stroke-linejoin="round"/>
        <ellipse cx="28" cy="27" rx="10" ry="5.5" fill="#fff" opacity=".55" transform="rotate(-35 28 27)"/>
        ${eye(44, 50)}${eye(76, 50)}${blush}${smile}
      </g>
      <path d="M69 109 L75 118 L81 109Z" fill="#c42c55" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>
    </svg>`;
  }

  const sparkle = (c = "#ffd36b") => `<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 0 Q11 9 20 10 Q11 11 10 20 Q9 11 0 10 Q9 9 10 0Z" fill="${c}"/></svg>`;
  const heartSmall = (c = "#f4a6b8") => `<svg viewBox="0 0 120 110" xmlns="http://www.w3.org/2000/svg"><path d="${HEART}" fill="${c}"/><ellipse cx="30" cy="28" rx="9" ry="5" fill="#fff" opacity=".5" transform="rotate(-35 30 28)"/></svg>`;
  const balloonSmall = (c = "#e0607e") => `<svg viewBox="0 0 120 170" xmlns="http://www.w3.org/2000/svg"><path d="M60 108 C50 130 72 142 60 168" fill="none" stroke="#b08a92" stroke-width="3"/><path d="${HEART}" fill="${c}"/><ellipse cx="30" cy="28" rx="9" ry="5" fill="#fff" opacity=".5" transform="rotate(-35 30 28)"/></svg>`;

  function candle() {
    return `<svg viewBox="0 0 60 120" role="img" aria-label="A lit candle" xmlns="http://www.w3.org/2000/svg">
      <g class="flame">
        <path d="M30 4 C41 22 45 34 30 48 C15 34 19 22 30 4Z" fill="#ff9d4a"/>
        <path d="M30 20 C36 30 38 36 30 44 C22 36 24 30 30 20Z" fill="#ffe08a"/>
      </g>
      <path d="M30 46 V54" stroke="#4a2a2a" stroke-width="2.4" stroke-linecap="round"/>
      <path d="M18 56 Q18 52 24 52 H36 Q42 52 42 56 V108 Q42 114 36 114 H24 Q18 114 18 108Z" fill="#fde6d4" stroke="#8c4a52" stroke-width="2.4"/>
      <path d="M18 66 Q24 78 30 66 Q36 80 42 66" fill="#f8cfd0" opacity=".9"/>
    </svg>`;
  }

  window.Art = { heartChar, gift, donuts, balloon, sparkle, heartSmall, balloonSmall, candle };
})();
