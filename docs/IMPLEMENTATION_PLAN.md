# Implementation Plan — Zero to End
## The Case of the Secret Admirer — Complete Technical Build Guide

**Scope:** Single-page web app. Mobile-first. Vanilla HTML/CSS/JS (no framework). Deployable as static files.

---

## PHASE 0: PREREQUISITES & SETUP

### Tech Stack
| Layer | Choice | Rationale |
|-------|--------|-----------|
| HTML | HTML5 | Semantic structure, viewport meta |
| CSS | Vanilla CSS + CSS custom properties | No build step, easy theming |
| JS | Vanilla ES6+ | No bundler, runs everywhere |
| Fonts | Google Fonts (Press Start 2P, Nunito) | Free, CDN, pixel + readable |
| QR Code | qrcode.js or QRCode.js (CDN) | Generate QR from URL at runtime |
| Audio | HTML5 Audio API | Native, no dependencies |
| Hosting | GitHub Pages / Netlify / Vercel | Free static host |

### File Structure (Create These)
```
FEB14th/
├── index.html              # Single entry point
├── css/
│   └── styles.css          # All styles
├── js/
│   ├── main.js             # Entry, init
│   ├── game.js             # Scene/state machine
│   ├── text.js             # All dialogue data
│   ├── particles.js        # Snow system
│   └── audio.js            # Sound manager
├── assets/
│   ├── audio/
│   │   ├── wind.mp3        # Ambient loop
│   │   ├── tap.mp3         # Tap sfx
│   │   ├── clue.mp3        # Clue found
│   │   ├── transition.mp3  # Scene change
│   │   └── reveal.mp3      # QR reveal
│   └── images/             # Optional: scene backgrounds
│       ├── quad.png
│       ├── library.png
│       └── ...
└── config.js               # Personalization (her name, QR URL, etc.)
```

### config.js — Personalization (Create First)
```javascript
// config.js — REPLACE BEFORE DEPLOY
const CONFIG = {
  recipientName: "Valentina",           // [Her Name]
  senderName: "■■■■■■■■■■■■■■",         // Redacted or your name
  timeOfDay: "afternoon",               // morning | afternoon | evening
  qrCodeUrl: "https://...",             // Gift link — e.g. Amazon, Venmo, etc.
};
```

---

## PHASE 1: HTML SHELL

### index.html — Full Structure
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <meta name="theme-color" content="#4A5568">
  <title>The Case of the Secret Admirer</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&family=Press+Start+2P&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <!-- Prevent zoom on double-tap (iOS) -->
  <div id="game-container" class="game-container">
    <!-- Scene wrapper — all scenes live here, one visible at a time -->
    <div id="scene-wrapper" class="scene-wrapper">
      <section id="scene-0" class="scene scene-title" data-scene="0"></section>
      <section id="scene-1" class="scene scene-casefile" data-scene="1"></section>
      <section id="scene-2" class="scene scene-quad" data-scene="2"></section>
      <section id="scene-3" class="scene scene-library" data-scene="3"></section>
      <section id="scene-4" class="scene scene-arena" data-scene="4"></section>
      <section id="scene-5" class="scene scene-cafe" data-scene="5"></section>
      <section id="scene-6" class="scene scene-river" data-scene="6"></section>
      <section id="scene-7" class="scene scene-reveal" data-scene="7"></section>
    </div>
    <!-- Text overlay — shared across scenes 1–6 -->
    <div id="text-overlay" class="text-overlay" aria-live="polite">
      <div id="text-content" class="text-content"></div>
      <button id="tap-prompt" class="tap-prompt" aria-label="Continue">[ TAP TO CONTINUE ]</button>
    </div>
    <!-- Snow particles canvas (optional — can use divs) -->
    <canvas id="snow-canvas" class="snow-canvas" aria-hidden="true"></canvas>
    <!-- QR code container (scene 7) -->
    <div id="qr-container" class="qr-container" hidden>
      <div id="qr-code" class="qr-code"></div>
      <p class="qr-label">SCAN TO CLAIM YOUR GIFT</p>
      <p class="qr-subtext">— From someone who's glad you're their friend</p>
      <button id="restart-btn" class="restart-btn">[ TAP TO PLAY AGAIN ]</button>
    </div>
  </div>
  <script src="config.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js"></script>
  <script src="js/text.js"></script>
  <script src="js/audio.js"></script>
  <script src="js/particles.js"></script>
  <script src="js/game.js"></script>
  <script src="js/main.js"></script>
</body>
</html>
```

**Key details:**
- `user-scalable=no` — prevents accidental zoom on mobile (optional; some prefer accessibility).
- `aria-live="polite"` — screen reader announces new text.
- `hidden` on QR container — shown only when scene 7 loads.
- Script order matters: config → QR lib → text data → audio → particles → game logic → main init.

---

## PHASE 2: CSS FOUNDATION

### css/styles.css — Structure (Sections)

#### 2.1 CSS Custom Properties (Top of File)
```css
:root {
  /* Colors — from VISUAL_AMBIENCE.md */
  --snow: #F5F5F0;
  --sky: #8B9AAA;
  --night: #4A5568;
  --window-glow: #FFE4B5;
  --paper: #F0E6D3;
  --valentine: #C45C6A;
  --gold: #C9A227;
  --seal: #8B4513;
  --text-dark: #2D3748;
  --text-muted: #6B7280;

  /* Typography */
  --font-pixel: 'Press Start 2P', cursive;
  --font-body: 'Nunito', sans-serif;
  --font-size-body: 16px;
  --font-size-header: 14px;
  --line-height: 1.5;

  /* Layout */
  --safe-top: env(safe-area-inset-top, 0);
  --safe-bottom: env(safe-area-inset-bottom, 0);
  --max-text-width: 280px;

  /* Timing */
  --transition-scene: 0.8s;
  --transition-text: 0.2s;
  --transition-tap: 0.1s;
}
```

#### 2.2 Reset & Base
```css
*, *::before, *::after { box-sizing: border-box; }
html { font-size: 16px; -webkit-text-size-adjust: 100%; }
body {
  margin: 0;
  padding: 0;
  font-family: var(--font-body);
  font-size: var(--font-size-body);
  line-height: var(--line-height);
  color: var(--text-dark);
  background: var(--night);
  overflow: hidden;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  -webkit-user-select: none;
}
```

#### 2.3 Game Container (Full Viewport, Mobile-Safe)
```css
.game-container {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  height: 100dvh; /* Dynamic viewport for mobile browser chrome */
  overflow: hidden;
  padding-top: var(--safe-top);
  padding-bottom: var(--safe-bottom);
  touch-action: manipulation; /* Prevents double-tap zoom on buttons */
}
```

#### 2.4 Scene Wrapper & Scene Visibility
```css
.scene-wrapper {
  position: absolute;
  inset: 0;
}
.scene {
  position: absolute;
  inset: 0;
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--transition-scene) ease;
}
.scene.active {
  opacity: 1;
  pointer-events: auto;
  z-index: 1;
}
```

#### 2.5 Text Overlay (Shared)
```css
.text-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  padding-bottom: calc(20px + var(--safe-bottom));
  background: linear-gradient(to top, rgba(45,55,72,0.95) 0%, transparent 100%);
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
}
.text-content {
  max-width: var(--max-text-width);
  margin: 0 auto 12px;
  font-size: var(--font-size-body);
  color: white;
  text-shadow: 0 1px 2px rgba(0,0,0,0.5);
  min-height: 80px;
}
.text-content .header { font-family: var(--font-pixel); font-size: 10px; margin-bottom: 8px; }
.text-content .clue { font-style: italic; margin: 12px 0; padding-left: 12px; }
.text-content .case-note { color: var(--gold); font-size: 14px; }
.tap-prompt {
  font-family: var(--font-pixel);
  font-size: 8px;
  color: rgba(255,255,255,0.8);
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  animation: bounce 0.8s ease-in-out infinite;
}
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(2px); }
}
```

#### 2.6 Snow Canvas
```css
.snow-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 5;
}
```

#### 2.7 QR Container (Scene 7)
```css
.qr-container {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: var(--paper);
  z-index: 20;
}
.qr-container[hidden] { display: none; }
.qr-code {
  width: 200px;
  height: 200px;
  margin-bottom: 16px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
.qr-code img { width: 100%; height: 100%; display: block; }
.qr-label { font-family: var(--font-pixel); font-size: 10px; margin: 0 0 8px; color: var(--text-dark); }
.qr-subtext { font-size: 14px; color: var(--text-muted); margin: 0 0 24px; }
.restart-btn { font-family: var(--font-pixel); font-size: 8px; background: none; border: none; cursor: pointer; color: var(--valentine); }
```

#### 2.8 Scene-Specific Backgrounds (Placeholder Gradients)
```css
.scene-title { background: linear-gradient(180deg, #4A5568 0%, #2D3748 100%); }
.scene-casefile { background: var(--paper); }
.scene-quad { background: linear-gradient(180deg, #8B9AAA 0%, #6B7B8C 50%, #F5F5F0 100%); }
.scene-library { background: linear-gradient(180deg, #E8DCC8 0%, #C4B59A 100%); }
.scene-arena { background: linear-gradient(180deg, #6B7B8C 0%, #4A5568 100%); }
.scene-cafe { background: linear-gradient(180deg, #D4A574 0%, #8B7355 100%); }
.scene-river { background: linear-gradient(180deg, #7A8A9A 0%, #5A6A7A 100%); }
.scene-reveal { background: var(--paper); }
```

#### 2.9 Breathing Effect (Title Screen)
```css
.scene-title.breathing {
  animation: breathe 4s ease-in-out infinite;
}
@keyframes breathe {
  0%, 100% { filter: brightness(1); }
  50% { filter: brightness(1.02); }
}
```

#### 2.10 Tap Feedback
```css
.game-container:active .tap-prompt { transform: scale(0.95); }
```

---

## PHASE 3: TEXT DATA LAYER

### js/text.js — All Dialogue as Structured Data
```javascript
// text.js — All scene text. Use CONFIG for personalization.
const SCENE_TEXT = {
  0: {
    // Title — no dialogue, just elements
  },
  1: {
    blocks: [
      { type: 'header', content: 'CASE FILE #0214\n━━━━━━━━━━━━━━━━━━━━━━━━━\nCONFIDENTIAL — VALENTINE\'S DIVISION\n━━━━━━━━━━━━━━━━━━━━━━━━━\n\nSUBJECT: {{recipientName}}\nSTATUS: Active Investigation\nDATE: February 14th\nCLASSIFICATION: URGENT — GIFT AT LARGE' },
      { type: 'body', content: 'INCIDENT REPORT\n━━━━━━━━━━━━━━━━━━━━━━━━━\n\nAt approximately {{timeOfDay}}, an anonymous party left a message. A gift has been secreted somewhere on the Clarkson University campus. The recipient has not been identified — until now.\n\nYOU have been selected to lead this investigation.' },
      { type: 'body', content: 'YOUR MISSION\n━━━━━━━━━━━━━━━━━━━━━━━━━\n\nFollow the clues.\nVisit each location.\nUncover the truth.\n\nThe gift awaits. But only for the detective clever enough to find it.' },
      { type: 'body', content: 'SIGNED,\n{{senderName}}\nChief of Valentine Operations (probably)\n\n[Redacted for reasons of ~mystery~]' }
    ]
  },
  2: {
    blocks: [
      { type: 'location', content: '[ LOCATION LOG — ENTRY 1 ]\nThe Quad. February 14th. Overcast.' },
      { type: 'body', content: 'You arrive at the heart of campus. The snow is fresh. The air is cold. Your breath fogs in the pixel-art air.\n\nSomething catches your eye: a note, left on a bench.' },
      { type: 'clue', content: 'You pick it up. It reads:\n\n"Where pages turn and silence wins,\nwhere students chase their might-have-beens —\ngo there next. The clue begins."' },
      { type: 'case-note', content: 'CASE NOTE: Obviously the library. You\'re a brilliant detective. Obviously.' }
    ]
  },
  3: {
    blocks: [
      { type: 'location', content: '[ LOCATION LOG — ENTRY 2 ]\nThe Library. Snell Hall. Quiet.' },
      { type: 'body', content: 'Rows of books. The smell of old paper (you imagine it). You scan the shelves.\n\nThere — on a study carrel. A bookmark. No, a note.' },
      { type: 'clue', content: '"Where Knights fight and crowds cheer loud,\nwhere winter games break through the cloud —\nthat\'s your next stop. Make us proud."' },
      { type: 'case-note', content: 'CASE NOTE: Cheel Arena. The Golden Knight knows all. Obviously.' }
    ]
  },
  4: {
    blocks: [
      { type: 'location', content: '[ LOCATION LOG — ENTRY 3 ]\nCheel Arena. Home of the Golden Knights.' },
      { type: 'body', content: 'The ice gleams. The stands are empty. It\'s just you and the echoes of a thousand games.\n\nOn a seat, row 7: a single note.' },
      { type: 'clue', content: '"Where coffee steams and ideas brew,\nwhere friends meet up and skies look blue —\nhead there next. The trail leads you."' },
      { type: 'case-note', content: 'CASE NOTE: The Student Center café. Or anywhere with coffee. You\'ve earned one.' }
    ]
  },
  5: {
    blocks: [
      { type: 'location', content: '[ LOCATION LOG — ENTRY 4 ]\nThe Student Center. The café. Warm.' },
      { type: 'body', content: 'Coffee. Cocoa. The buzz of conversation. You find a table by the window.\n\nThere\'s a note. And maybe a heart doodled in the corner.' },
      { type: 'clue', content: '"Where the river runs and cold winds blow,\nwhere the last clue waits — you\'ll know.\nThe gift is close. Just one more go."' },
      { type: 'case-note', content: 'CASE NOTE: The river. The bridge. The end of the trail. Your pulse quickens. (Detective instinct. Obviously.)' }
    ]
  },
  6: {
    blocks: [
      { type: 'location', content: '[ LOCATION LOG — FINAL ENTRY ]\nThe River. The bridge. Evening.' },
      { type: 'body', content: 'You walk to the water\'s edge. The snow crunches underfoot. The river flows, dark and quiet.\n\nOn the bench: one last envelope. Your name on it.' },
      { type: 'body', content: 'You open it.' },
      { type: 'clue', content: '"The gift was never lost.\nIt was always yours.\n\nSomeone who cares about you — a lot — left it right here. Not because you had to solve puzzles. But because you\'re worth a little adventure. And a little mystery. And a little extra thought."' },
      { type: 'clue', content: '"Happy Valentine\'s, detective.\nYou solved it. You always do."' },
      { type: 'case-note', content: 'CASE NOTE: Case closed. With a smile.' }
    ]
  },
  7: {
    // No blocks — QR reveal handled separately
  }
};

function interpolate(str) {
  return str
    .replace(/\{\{recipientName\}\}/g, CONFIG.recipientName)
    .replace(/\{\{senderName\}\}/g, CONFIG.senderName)
    .replace(/\{\{timeOfDay\}\}/g, CONFIG.timeOfDay);
}

function getBlock(sceneId, blockIndex) {
  const scene = SCENE_TEXT[sceneId];
  if (!scene || !scene.blocks || blockIndex >= scene.blocks.length) return null;
  const block = scene.blocks[blockIndex];
  return { ...block, content: interpolate(block.content) };
}

function getBlockCount(sceneId) {
  const scene = SCENE_TEXT[sceneId];
  return scene && scene.blocks ? scene.blocks.length : 0;
}
```

---

## PHASE 4: GAME STATE MACHINE

### js/game.js — Scene & Block Logic
```javascript
// game.js — State: currentScene, currentBlock. Handles tap-to-advance, transitions.

const GameState = {
  currentScene: 0,
  currentBlock: 0,
  isTransitioning: false
};

function showScene(sceneId) {
  if (GameState.isTransitioning) return;
  document.querySelectorAll('.scene').forEach(el => el.classList.remove('active'));
  const scene = document.getElementById(`scene-${sceneId}`);
  if (scene) scene.classList.add('active');
  GameState.currentScene = sceneId;
  GameState.currentBlock = 0;
}

function showBlock(sceneId, blockIndex) {
  const block = getBlock(sceneId, blockIndex);
  if (!block) return false;
  const container = document.getElementById('text-content');
  container.className = 'text-content ' + block.type;
  container.innerHTML = block.content.replace(/\n/g, '<br>');
  container.style.opacity = '0';
  container.offsetHeight; // Trigger reflow
  container.style.transition = 'opacity 0.2s ease';
  container.style.opacity = '1';
  return true;
}

function advance() {
  if (GameState.isTransitioning) return;
  const sceneId = GameState.currentScene;
  const blockIndex = GameState.currentBlock;
  const blockCount = getBlockCount(sceneId);

  if (blockIndex < blockCount - 1) {
    // More blocks in this scene
    GameState.currentBlock++;
    showBlock(sceneId, GameState.currentBlock);
    Audio.playTap();
  } else {
    // End of scene — go to next scene
    if (sceneId === 0) {
      showScene(1);
      showBlock(1, 0);
      GameState.currentBlock = 0;
      Audio.playTap();
      return;
    }
    if (sceneId === 7) return; // Reveal has no advance
    if (sceneId === 6) {
      // River → Reveal
      GameState.isTransitioning = true;
      Audio.playReveal();
      document.getElementById('text-overlay').style.opacity = '0';
      document.querySelector('.scene-river').classList.remove('active');
      document.getElementById('qr-container').hidden = false;
      generateQRCode();
      GameState.isTransitioning = false;
      return;
    }
    // Scenes 1–5: next scene
    GameState.isTransitioning = true;
    Audio.playTransition();
    const nextScene = sceneId + 1;
    document.getElementById('text-overlay').style.opacity = '0';
    setTimeout(() => {
      showScene(nextScene);
      showBlock(nextScene, 0);
      GameState.currentBlock = 0;
      document.getElementById('text-overlay').style.opacity = '1';
      GameState.isTransitioning = false;
      Audio.playClue();
    }, 800);
  }
}

function generateQRCode() {
  const container = document.getElementById('qr-code');
  container.innerHTML = '';
  QRCode.toCanvas(container, CONFIG.qrCodeUrl, { width: 168, margin: 1 }, (err) => {
    if (err) console.error(err);
  });
  // Note: qrcode lib may use toCanvas differently — check API. Alternative: QRCode.toDataURL then set as img src.
}

// Alternative QR generation if library API differs:
// QRCode.toDataURL(CONFIG.qrCodeUrl, { width: 200 }, (err, url) => {
//   if (!err) {
//     const img = document.createElement('img');
//     img.src = url;
//     document.getElementById('qr-code').appendChild(img);
//   }
// });
```

---

## PHASE 5: AUDIO MANAGER

### js/audio.js — Preload, Play, Mute
```javascript
// audio.js — Preload all sounds. Play on user gesture (required by browsers).

const Audio = {
  sounds: {},
  loaded: false,
  muted: false,

  init() {
    const files = ['wind', 'tap', 'clue', 'transition', 'reveal'];
    files.forEach(name => {
      const a = new Audio(`assets/audio/${name}.mp3`);
      a.preload = 'auto';
      this.sounds[name] = a;
    });
    this.loaded = true;
  },

  play(name) {
    if (this.muted || !this.loaded) return;
    const s = this.sounds[name];
    if (s) {
      s.currentTime = 0;
      s.play().catch(() => {}); // Autoplay may be blocked
    }
  },

  playTap() { this.play('tap'); },
  playClue() { this.play('clue'); },
  playTransition() { this.play('transition'); },
  playReveal() { this.play('reveal'); },

  startAmbient() {
    const w = this.sounds.wind;
    if (w) {
      w.loop = true;
      w.volume = 0.3;
      w.play().catch(() => {});
    }
  }
};
```

**Important:** Browsers require a user gesture before playing audio. Start ambient/tap only after first tap.

---

## PHASE 6: SNOW PARTICLES

### js/particles.js — Canvas-Based Snow
```javascript
// particles.js — 15–25 particles, slow fall, slight wobble.

const Snow = {
  canvas: null,
  ctx: null,
  particles: [],
  raf: null,

  init() {
    this.canvas = document.getElementById('snow-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.spawn();
    this.loop();
  },

  resize() {
    if (!this.canvas) return;
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = window.innerWidth * dpr;
    this.canvas.height = window.innerHeight * dpr;
    this.canvas.style.width = window.innerWidth + 'px';
    this.canvas.style.height = window.innerHeight + 'px';
    this.ctx.scale(dpr, dpr);
  },

  spawn() {
    this.particles = [];
    const count = Math.min(25, Math.floor(window.innerWidth / 20));
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: 2 + Math.random() * 2,
        speed: 0.3 + Math.random() * 0.5,
        wobble: 0.5 + Math.random() * 1,
        phase: Math.random() * Math.PI * 2,
        opacity: 0.6 + Math.random() * 0.3
      });
    }
  },

  loop() {
    const W = window.innerWidth;
    const H = window.innerHeight;
    this.ctx.clearRect(0, 0, W, H);
    const t = Date.now() / 1000;
    this.particles.forEach(p => {
      p.y += p.speed;
      if (p.y > H) p.y = -2;
      p.x += Math.sin(t + p.phase) * p.wobble * 0.5;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      this.ctx.globalAlpha = p.opacity;
      this.ctx.fillStyle = '#F5F5F0';
      this.ctx.fillRect(p.x, p.y, p.size, p.size);
    });
    this.ctx.globalAlpha = 1;
    this.raf = requestAnimationFrame(() => this.loop());
  }
};
```

---

## PHASE 7: MAIN INIT & EVENT BINDING

### js/main.js — Entry Point
```javascript
// main.js — Init on DOMContentLoaded. Bind taps.

document.addEventListener('DOMContentLoaded', () => {
  // 1. Build Scene 0 (title) HTML
  const scene0 = document.getElementById('scene-0');
  scene0.innerHTML = `
    <div class="title-card">
      <h1 class="title-main">THE CASE OF THE SECRET ADMIRER</h1>
      <p class="title-sub">A Clarkson University Mystery</p>
      <button id="begin-btn" class="tap-prompt">[ TAP TO BEGIN ]</button>
    </div>
  `;

  // 2. Hide text overlay for scene 0 and 7
  const textOverlay = document.getElementById('text-overlay');
  const toggleTextOverlay = (show) => {
    textOverlay.style.display = show ? 'flex' : 'none';
  };

  showScene(0);
  toggleTextOverlay(false);

  // 3. Init systems
  Audio.init();
  Snow.init();

  // 4. First tap — begin (enables audio via user gesture)
  document.getElementById('begin-btn').addEventListener('click', () => {
    Audio.startAmbient();
    Audio.playTap();
    scene0.classList.remove('active');
    showScene(1);
    showBlock(1, 0);
    GameState.currentBlock = 0;
    toggleTextOverlay(true);
  });

  // 5. Tap to advance (delegate to game container for scenes 1–6)
  document.getElementById('game-container').addEventListener('click', (e) => {
    if (e.target.id === 'restart-btn') {
      location.reload();
      return;
    }
    if (GameState.currentScene >= 1 && GameState.currentScene <= 6) {
      advance();
    }
  });

  // 6. Also allow tap on tap-prompt specifically
  document.getElementById('tap-prompt').addEventListener('click', (e) => {
    e.stopPropagation();
    if (GameState.currentScene >= 1 && GameState.currentScene <= 6) advance();
  });
});
```

---

## PHASE 8: TITLE SCENE (SCENE 0) ENHANCEMENTS

### Add to main.js or game.js — Typewriter Effect (Optional)
```javascript
function typewriter(el, text, speed = 50, callback) {
  let i = 0;
  el.textContent = '';
  function step() {
    if (i < text.length) {
      el.textContent += text[i];
      i++;
      setTimeout(step, speed);
    } else if (callback) callback();
  }
  step();
}
// Use: typewriter(titleEl, 'THE CASE OF THE SECRET ADMIRER', 80, () => { /* show tap prompt */ });
```

### Title CSS Additions
```css
.title-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  padding: 24px;
  text-align: center;
}
.title-main {
  font-family: var(--font-pixel);
  font-size: 10px;
  color: var(--snow);
  line-height: 1.6;
  margin-bottom: 16px;
}
.title-sub {
  font-family: var(--font-body);
  font-size: 14px;
  color: rgba(245,245,240,0.8);
  margin-bottom: 32px;
}
```

---

## PHASE 9: QR CODE LIBRARY — EXACT API

### Using qrcode.js (cdn.jsdelivr.net/npm/qrcode)
```javascript
// QRCode.toCanvas(canvas, url, options, callback)
// OR
// QRCode.toDataURL(url, options, callback) -> use with <img src="...">

function generateQRCode() {
  const container = document.getElementById('qr-code');
  container.innerHTML = '';
  const opts = { width: 200, margin: 2, color: { dark: '#2D3748', light: '#FFFFFF' } };
  QRCode.toDataURL(CONFIG.qrCodeUrl, opts, (err, dataUrl) => {
    if (err) { console.error(err); return; }
    const img = document.createElement('img');
    img.src = dataUrl;
    img.alt = 'Gift QR Code';
    img.style.width = '100%';
    img.style.height = '100%';
    container.appendChild(img);
  });
}
```

---

## PHASE 10: MOBILE FIXES & POLISH

### Prevent Overscroll / Bounce (iOS)
```css
body { overscroll-behavior: none; }
html, body { position: fixed; width: 100%; }
```

### Prevent Zoom on Input Focus (if any inputs added)
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
```

### Add to main.js — Restart Button
```javascript
document.getElementById('restart-btn').addEventListener('click', () => location.reload());
```

---

## PHASE 11: DEPLOYMENT

### GitHub Pages
1. Create repo, push files.
2. Settings → Pages → Source: main branch, / (root) or /docs.
3. URL: `https://username.github.io/repo-name/`
4. **Important:** If using `/` root, put `index.html` at repo root. If repo name is `FEB14th`, URL is `https://username.github.io/FEB14th/`.

### Netlify
1. Drag `FEB14th` folder to netlify.com/drop.
2. Get random URL. Optionally add custom domain.

### Ensure config.js Has Correct QR URL
- `CONFIG.qrCodeUrl` must be the full gift link (Amazon, Venmo, Google Pay, etc.).
- Test QR scan on a real phone before sharing.

---

## IMPLEMENTATION CHECKLIST (Order)

| # | Task | File(s) | Notes |
|---|------|---------|-------|
| 1 | Create folder structure | — | |
| 2 | Create config.js | config.js | Add real values |
| 3 | Create index.html | index.html | Full structure |
| 4 | Create styles.css | css/styles.css | All sections |
| 5 | Create text.js | js/text.js | Fix getBlockCount typo |
| 6 | Create audio.js | js/audio.js | |
| 7 | Add audio files | assets/audio/ | Placeholder or real MP3s |
| 8 | Create particles.js | js/particles.js | |
| 9 | Create game.js | js/game.js | Wire getBlock, advance, generateQRCode |
| 10 | Create main.js | js/main.js | Init, event binding |
| 11 | Test locally | — | python -m http.server or live-server |
| 12 | Test on phone | — | Same network, use local IP |
| 13 | Deploy | — | GitHub Pages / Netlify |
| 14 | Final QR scan test | — | On real device |

---

## EDGE CASES & FIXES

1. **QR library load fails:** Use try/catch, fallback: show URL as text link.
2. **Audio autoplay blocked:** Only play after first tap. Catch play() promise.
3. **Snow performance:** Reduce particle count on `navigator.hardwareConcurrency < 4`.
4. **Long names:** CONFIG.recipientName — ensure it fits in case file layout (test with long names).
5. **Missing audio files:** Wrap Audio.play in try/catch; game still works without sound.

---

## FILE-BY-FILE SUMMARY

| File | Responsibility | Key Exports/Globals |
|------|----------------|---------------------|
| config.js | Personalization | CONFIG |
| index.html | Structure, sections, scripts | — |
| css/styles.css | All styling, variables, animations | — |
| js/text.js | Dialogue data, interpolate, getBlock, getBlockCount | SCENE_TEXT, getBlock, getBlockCount, interpolate |
| js/audio.js | Preload, play SFX/ambient | Audio |
| js/particles.js | Snow canvas loop | Snow |
| js/game.js | showScene, showBlock, advance, generateQRCode | GameState, showScene, showBlock, advance |
| js/main.js | DOMContentLoaded init, event binding | — |

---

This plan is sufficient to implement the game from zero to deploy with real code snippets at each step.
