# Changelog

All notable changes to this project are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added
- Static, mobile-first interactive gift site (plain HTML, CSS and vanilla JS) with hash-based scene routing, ready for GitHub Pages.
- Landing and menu scenes with illustrated cards and "opened" checkmarks.
- "Why I Love You" section: swipeable photo slides, tap-to-reveal grateful hearts, flip-and-redeem love coupons, and a confetti finale.
- "I'm Sorry" section: step-by-step apology and a "Can you forgive me?" scene with a runaway "No" button and a celebratory "Yes".
- "For Your Eyes Only" section: client-side password gate, candlelit theme, tap-to-unveil slides with a typewriter effect, and a closing teaser.
- Single `content.js` for all text, photo paths, password and music; placeholder photos, a generated soft music loop, and a marble background.
- Floating hearts, balloons, sparkles and embers, confetti, music toggle (off by default), `prefers-reduced-motion` support, `noindex` meta and a neutral page title.
- README with editing guide, GitHub Pages deployment steps, privacy notes and a placeholder checklist.
- `.claude/launch.json` for local preview, and `.gitignore`.

### Fixed
- "I'm Sorry" and "Why I Love You" no longer crash when an optional block is deleted from `content.js` (e.g. `sorry.learned`, or a block missing its `text` or `items`). Missing steps are skipped, which fixes the Next button getting stuck on "What I did wrong".
