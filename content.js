/* ==========================================================================
   content.js — EVERYTHING you might want to edit lives in this one file.

   • Text      → change the strings between the quotes.
   • Photos    → change the "image" paths (put your files in assets/images/).
   • Music     → set music.file (put your file in assets/audio/).
   • Password  → set eyes.password.
   • Anything marked  ✏️ REPLACE  is placeholder copy written to show the tone.
     Rewrite it in your own words before you share the link.

   Tips: keep the quotes and commas. Use \n for a line break. Emojis are fine.
   ========================================================================== */

window.CONTENT = {

  /* ---------- General ---------- */
  siteTitle: "Hello",              // browser tab title — keep it neutral (privacy)
  herName: "Ammu",                 // what you call her on screen
  signOff: "Samson",               // how your messages are signed
  previewBanner: true,             // ✏️ shows a "placeholder content" tag. Set to false when you're done!

  music: {
    file: "assets/audio/soft-loop.wav",   // ✏️ replace with your own song, e.g. "assets/audio/our-song.mp3". "" = no music button
    label: "Music"
  },

  /* ---------- Scene 1: Landing ---------- */
  landing: {
    title: "Hi Ammu Kuttyy 💕",
    text: "I made something for you…\nwant to see?",
    button: "See My Surprise"
  },

  /* ---------- Scene 2: Menu ---------- */
  menu: {
    title: "Pick what you'd like to see first",
    text: "There's no wrong choice, my love.",
    cards: [
      { id: "love",  title: "Why I Love You",     hint: "open the gift",       art: "gift" },
      { id: "sorry", title: "I'm Really Sorry Mu",          hint: "open the donut box",  art: "donuts" },
      { id: "eyes",  title: "For Your Eyes Only", hint: "pop the balloon",     art: "balloon", locked: true }
    ],
    backToMenu: "Menu",
    backHome: "Home"
  },

  /* ==========================================================================
     SECTION 1 — Why I Love You
     ========================================================================== */
  love: {
    // ✏️ REPLACE every slide: swap the photo, title, paragraph and caption.
    slides: [
      {
        image: "assets/images/a2b.jpeg", alt: "Placeholder photo 1: how it began",
        title: "It started with your smile",
        text: "I still remember the first time I really noticed you. Something in me went quiet and loud at the same time, and I knew I wanted to know everything about you.",
        caption: "The day it all began 📍"
      },
      {
        image: "assets/images/auto.jpeg", alt: "Placeholder photo 2: her laugh",
        title: "Your laugh",
        text: "Your laugh is my favourite sound in the whole world. It makes bad days small and good days enormous. I'd tell the worst jokes for the rest of my life just to hear it.",
        caption: "Louder, please 😂"
      },
      {
        image: "assets/images/icecream.jpeg", alt: "Placeholder photo 3: how she cares",
        title: "The way you care",
        text: "You notice the small things, you remember what matters, and you make me around you feel seen. I learn how to love better just by watching you Mu.",
        caption: "My softest, strongest girl 🌷"
      },
      {
        image: "assets/images/cod.jpeg", alt: "Placeholder photo 4: little things together",
        title: "Our little things",
        text: "It's never the big plans I remember. It's the silly voices, the shared snacks, the quiet but busy car rides 😉, the way we can say nothing and it still feels like everything.",
        caption: "Ordinary days, extraordinary you ✨"
      },
      {
        image: "assets/images/tovo.jpeg", alt: "Placeholder photo 5: how she makes him better",
        title: "You make me better",
        text: "Around you I'm braver, calmer and kinder than I knew I could be. You don't try to change me. You just make me want to grow. Thank you for that.",
        caption: "Growing with you 🌱"
      },
    ],

    grateful: {
      title: "Things I'm grateful for",
      intro: "Tap each heart to open a reason.",
      doneText: "…and that's only the start 💞",
      // ✏️ REPLACE (add or remove as many as you like)
      reasons: [
        "You make me the happiest man alive.",
        "You make me wake up everyday with a smile.",
        "You believe in me, even on the days I don't.",
        "Your laugh. Obviously. Including the snorts.",
        "You're patient with me when I'm hard to be patient with.",
        "The way you light up over tiny things.",
        "You feel like home.",
        "You make me want to be a better man.",
      ]
    },

    coupons: {
      title: "Love Coupons",
      intro: "Tap a coupon to flip it, then redeem it whenever you like. 🎟️",
      front: "love coupon",
      redeem: "Redeem",
      redeemed: "Redeemed ♥",
      flipBack: "flip back",
      // ✏️ REPLACE with promises you'll genuinely keep
      items: [
        { title: "A Long Hug",         text: "One hug that lasts exactly as long as you need. No letting go until you say so." },
        { title: "Scenic Sessions",    text: "Just say the word baby , im be there 😉" },
        { title: "Movie Night",        text: "You pick the movie. I bring blankets and don't touch my phone." },
        { title: "Romantic Dinner",    text: "A dinner for two, planned by me, dressed up or in pyjamas, your call." },
        { title: "Morning Kissy Overload",   text: "Will give u an overlod of kissy Served with love." },
        { title: "One Wish Granted",   text: "Any one reasonable wish. (Reasonable is decided by you.)" }
      ]
    },

    finale: {
      title: "I love you, Ammu",
      text: "Every version of you, every single day.\nThank you for being mine.",
      button: "Another burst of love 💥",
      sign: "Forever yours,"
    }
  },

  /* ==========================================================================
     SECTION 2 — I'm Sorry
     ========================================================================== */
  sorry: {
    intro: {
      title: "Ammu… I'm sorry.",
      text: "Im sorry for hurting you my love, i know im stupid at times, but i promise to be better for you. I love you Ammu.",
    },
    wrong: {
      title: "What I did wrong",
      // ✏️ REPLACE with the real thing. Be specific, own it, and avoid the word "but".
      text: "What i said was wrong ammu, i regret it, you are my most precious person in the world, and i should have never said that. I love you Ammu.",
    },
    promise: {
      title: "What I promise",
      text: "I promise to be better ammu, i will take care you and our family, i wont do or say anything to hurt you, i will be the best husband for you and our family. I love you Ammu.",
    },
    question: {
      title: "Can you forgive me?",
      text: "Take all the time you need. Even if the answer is \"not yet\", I'm still here.",
      yes: "Yes 💗",
      no: "No",
      // The "No" button runs away and changes its label each time:
      noLabels: ["No", "Are you sure? 🥺", "Pretty please?", "Think again 💔", "You can't catch me!", "Okay… really?", "Nope, still yes 😌"]
    },
    result: {
      title: "You are my whole heart 💗",
      text: "Thank you for being so gentle with me. I'll spend every day earning it.\nI love you, Ammu.",
      sign: "Always yours,"
    },
    next: "Next",
    back: "Back"
  },

  /* ==========================================================================
     SECTION 3 — For Your Eyes Only
     ========================================================================== */
  eyes: {
    password: "06032026",                // ✏️ REPLACE. Case, spaces, dashes and slashes are ignored when she types it.
    hint: "Hint: our anniversary (DDMMYYYY)",
    gateTitle: "Just for you, Ammu",
    gateText: "Whisper the secret to come in.",
    gatePlaceholder: "our special date…",
    gateButton: "Unlock 🔥",
    gateWrong: "Not quite, beautiful. Try again.",

    unveil: "tap to unveil ✦",
    next: "Next",
    back: "Back",

    // ✏️ REPLACE. Each slide is typed out line by line. Keep it steamy but tasteful.
    slides: [
      {
        title: "Come closer",
        lines: [
          "Mu you are literally everything i desire, i crave for you every second of the day.",
          "I want to feel you, Ammu. Every inch of you.",
          "I want to taste you, hear you, and make you mine in every way."
        ]
      },
      {
        title: "The way you look",
        lines: [
          "Mu you walk into a room or into the camera , i instantly get so hard for you, i cant control myself.",
          "That slow, slightly dangerous smile of yours? I'd lose every argument to it.",
          "I just keep looking at you, making up scenarios in my head where you and i are alone, and i can do whatever i want to you."
        ]
      },
      {
        title: "What you do to me",
        lines: [
          "Mu you look at me with those eyes, i get so turned on, that i would expload in my pants.",
          "You have no idea how loud my heart gets when you lean in close.",
          "Your voice, low, right by my ear… that's the kind of trouble I never want to get out of."
        ]
      },
      {
        title: "How I adore you",
        lines: [
          "I'd worship every little thing about you: your eyes, your laugh, your fatass , your soft gentle boobies and your tasty kitty, also the soft way you say my name.",
          "You're my favourite temptation and my safest place, both at once.",
          "I will take my time with you. Slowly, the way you deserve."
        ]
      },
      {
        title: "Irresistible",
        lines: [
          "Everything about you is irresistible, and you know it. You wear it like perfume.",
          "Tonight, I'm completely yours: hands, heart, and full attention.",
          "Just tell me what you want, and I'll make it happen."
        ]
      }
    ],

    teaser: {
      title: "To be continued…",
      lines: [
        "That was only the beginning, my love.",
        "Come find me. I'll show you the rest in person. 🌹"
      ],
      sign: "Yours, completely,"
    }
  }
};
