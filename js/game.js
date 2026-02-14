// game.js — State: currentScene, currentBlock. Handles tap-to-advance, transitions.

const SCENE_NAMES = ['Title', 'CaseFile', 'Quad', 'Library', 'Arena', 'Cafe', 'River', 'Reveal'];

const GameState = {
  currentScene: 0,
  currentBlock: 0,
  isTransitioning: false
};

function showScene(sceneId) {
  console.log('[Game] showScene(', sceneId, ') — isTransitioning:', GameState.isTransitioning);
  if (GameState.isTransitioning) {
    console.log('[Game] BLOCKED: isTransitioning=true');
    return;
  }
  document.querySelectorAll('.scene').forEach(el => el.classList.remove('active'));
  const scene = document.getElementById(`scene-${sceneId}`);
  if (scene) {
    scene.classList.add('active');
    const bg = window.getComputedStyle(scene).backgroundImage;
    console.log('[Game] Active scene:', sceneId, SCENE_NAMES[sceneId], '| backgroundImage:', bg ? bg.slice(0, 80) + '...' : 'none');
  } else {
    console.error('[Game] Scene element NOT FOUND: scene-' + sceneId);
  }
  GameState.currentScene = sceneId;
  GameState.currentBlock = 0;
  const activeNow = document.querySelectorAll('.scene.active');
  console.log('[Game] State after showScene:', { ...GameState }, '| .active elements:', Array.from(activeNow).map(s => s.id));
}

function showBlock(sceneId, blockIndex) {
  const block = getBlock(sceneId, blockIndex);
  console.log('[Game] showBlock(', sceneId, blockIndex, ') — block:', block ? block.type : 'null', '| content preview:', block ? block.content.slice(0, 50) + '...' : 'N/A');
  if (!block) {
    console.error('[Game] showBlock FAILED: getBlock returned null');
    return false;
  }
  const container = document.getElementById('text-content');
  if (!container) {
    console.error('[Game] text-content container NOT FOUND');
    return false;
  }
  container.className = 'text-content ' + block.type;
  container.innerHTML = block.content.replace(/\n/g, '<br>');
  container.style.transition = 'none';
  container.style.opacity = '1';
  // Switch river scene to bench when opening the letter (block 2+)
  const riverScene = document.getElementById('scene-6');
  if (riverScene) {
    if (sceneId === 6 && blockIndex >= 2) {
      riverScene.classList.add('scene-river-at-bench');
      console.log('[Game] River → BENCH background (block 2+)');
    } else if (sceneId === 6 && blockIndex < 2) {
      riverScene.classList.remove('scene-river-at-bench');
      console.log('[Game] River → RIVER background');
    }
  }
  // Switch library scene to books when "Rows of books..." (block 1+)
  const libraryScene = document.getElementById('scene-3');
  if (libraryScene) {
    if (sceneId === 3 && blockIndex >= 1) {
      libraryScene.classList.add('scene-library-books');
    } else if (sceneId === 3 && blockIndex < 1) {
      libraryScene.classList.remove('scene-library-books');
    }
  }
  // Switch arena scene to seat when "On a seat, row 7..." (block 1+)
  const arenaScene = document.getElementById('scene-4');
  if (arenaScene) {
    if (sceneId === 4 && blockIndex >= 1) {
      arenaScene.classList.add('scene-arena-seat');
    } else if (sceneId === 4 && blockIndex < 1) {
      arenaScene.classList.remove('scene-arena-seat');
    }
  }
  return true;
}

let _lastAdvanceTime = 0;

function advance() {
  const now = Date.now();
  const sinceLast = now - _lastAdvanceTime;
  _lastAdvanceTime = now;
  console.log('[Game] advance() called | ms since last:', sinceLast, '| stack:', new Error().stack?.split('\n')[2]?.trim() || 'n/a');

  if (GameState.isTransitioning) {
    console.log('[Game] advance BLOCKED: isTransitioning=true');
    return;
  }
  const sceneId = GameState.currentScene;
  const blockIndex = GameState.currentBlock;
  const blockCount = getBlockCount(sceneId);

  console.log('[Game] advance state:', { sceneId, sceneName: SCENE_NAMES[sceneId], blockIndex, blockCount, hasMoreBlocks: blockIndex < blockCount - 1 });

  if (blockIndex < blockCount - 1) {
    // More blocks in this scene
    GameState.currentBlock++;
    console.log('[Game] Same scene, next block:', GameState.currentBlock);
    showBlock(sceneId, GameState.currentBlock);
    Audio.playTap();
  } else {
    // End of scene — go to next scene
    console.log('[Game] End of scene', sceneId, '— transitioning to next');
    if (sceneId === 0) {
      console.log('[Game] Branch: scene 0 → scene 1');
      showScene(1);
      showBlock(1, 0);
      GameState.currentBlock = 0;
      Audio.playTap();
      return;
    }
    if (sceneId === 7) {
      console.log('[Game] Branch: scene 7 (Reveal) — no advance');
      return;
    }
    if (sceneId === 6) {
      console.log('[Game] Branch: scene 6 → Reveal (QR)');
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
    const nextScene = sceneId + 1;
    console.log('[Game] Branch: scene', sceneId, '→ scene', nextScene, SCENE_NAMES[nextScene], '| setTimeout 800ms');
    GameState.isTransitioning = true;
    Audio.playTransition();
    document.getElementById('text-overlay').style.opacity = '0';
    setTimeout(() => {
      console.log('[Game] setTimeout fired — showing scene', nextScene);
      GameState.isTransitioning = false; // Reset first so showScene can run
      showScene(nextScene);
      showBlock(nextScene, 0);
      GameState.currentBlock = 0;
      document.getElementById('text-overlay').style.opacity = '1';
      Audio.playClue();
    }, 800);
  }
}

function generateQRCode() {
  const container = document.getElementById('qr-code');
  container.innerHTML = '';
  const img = document.createElement('img');
  img.src = '/assets/images/QR.png';
  img.alt = 'Gift QR Code';
  img.style.width = '100%';
  img.style.height = '100%';
  img.style.objectFit = 'contain';
  container.appendChild(img);
}
