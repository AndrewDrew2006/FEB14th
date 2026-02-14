// main.js — Init on DOMContentLoaded. Bind taps.

// === DEV LOGGING ===
console.log('[FEB14th] Starting...');
console.log('[FEB14th] Protocol:', location.protocol, location.protocol === 'file:' ? '(opened directly — no server)' : '(served via HTTP)');
if (location.protocol === 'file:') {
  console.log('[FEB14th] Tip: Some features (CDN fonts, QR lib) may fail with file://. Run: npx serve .');
}
console.log('[FEB14th] CONFIG:', typeof CONFIG !== 'undefined' ? 'loaded' : 'MISSING');
console.log('[FEB14th] QRCode lib:', typeof QRCode !== 'undefined' ? 'loaded' : 'MISSING (check script)');

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

document.addEventListener('DOMContentLoaded', () => {
  console.log('[FEB14th] DOMContentLoaded — init started');

  // 1. Build Scene 0 (title) HTML
  const scene0 = document.getElementById('scene-0');
  scene0.innerHTML = `
    <div class="title-card">
      <h1 class="title-main"></h1>
      <p class="title-sub">A Clarkson University Mystery</p>
      <button id="begin-btn" class="tap-prompt" style="opacity:0;transition:opacity 0.3s">[ TAP TO BEGIN ]</button>
      <div class="title-graffiti">That's ——— CRAZYY WORK</div>
    </div>
  `;

  const titleEl = scene0.querySelector('.title-main');
  const beginBtn = scene0.querySelector('#begin-btn');
  const graffitiEl = scene0.querySelector('.title-graffiti');

  typewriter(titleEl, 'THE CASE OF THE SECRET ADMIRER', 80, () => {
    beginBtn.style.opacity = '1';
    scene0.classList.add('breathing');
  });

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
  console.log('[FEB14th] Init complete — ready. Tap to begin.');

  // 4. First tap — begin (enables audio via user gesture)
  const startGame = () => {
    console.log('[FEB14th] startGame() | currentScene:', GameState.currentScene);
    if (GameState.currentScene !== 0) {
      console.log('[FEB14th] startGame IGNORED: not on scene 0');
      return;
    }
    Audio.startAmbient();
    Audio.playTap();
    scene0.classList.remove('active');
    console.log('[FEB14th] startGame → showScene(1), showBlock(1,0)');
    showScene(1);
    showBlock(1, 0);
    GameState.currentBlock = 0;
    toggleTextOverlay(true);
    // Log which scenes have .active
    const activeScenes = document.querySelectorAll('.scene.active');
    console.log('[FEB14th] Active scenes:', Array.from(activeScenes).map(s => s.id));
  };
  scene0.addEventListener('click', startGame); // Whole title area clickable

  // 5. Tap to advance (delegate to game container for scenes 1–6)
  document.getElementById('game-container').addEventListener('click', (e) => {
    console.log('[Click] game-container | target:', e.target.id || e.target.className, '| currentScene:', GameState.currentScene);
    if (e.target.id === 'restart-btn') {
      location.reload();
      return;
    }
    if (GameState.currentScene >= 1 && GameState.currentScene <= 6) {
      console.log('[Click] game-container → calling advance()');
      advance();
    }
  });

  // 6. Also allow tap on tap-prompt specifically
  document.getElementById('tap-prompt').addEventListener('click', (e) => {
    e.stopPropagation();
    console.log('[Click] tap-prompt | currentScene:', GameState.currentScene);
    if (GameState.currentScene >= 1 && GameState.currentScene <= 6) {
      console.log('[Click] tap-prompt → calling advance()');
      advance();
    }
  });

  // 7. Restart button
  document.getElementById('restart-btn').addEventListener('click', () => location.reload());
});
