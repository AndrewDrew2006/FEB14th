// audio.js — Preload all sounds. Play on user gesture (required by browsers).
// Set AUDIO_ENABLED = true to enable sound.
const AUDIO_ENABLED = false;

const Audio = {
  sounds: {},
  loaded: false,
  muted: false,

  init() {
    if (!AUDIO_ENABLED) return;
    const NativeAudio = window.Audio;
    const files = ['background', 'wind', 'tap', 'clue', 'transition', 'reveal'];
    files.forEach(name => {
      const a = new NativeAudio(`assets/audio/${name}.mp3`);
      a.preload = 'auto';
      this.sounds[name] = a;
    });
    this.loaded = true;
  },

  play(name) {
    if (!AUDIO_ENABLED || this.muted || !this.loaded) return;
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
    if (!AUDIO_ENABLED) return;
    const bg = this.sounds.background;
    if (bg) {
      bg.loop = true;
      bg.volume = 0.4;
      bg.play().catch(() => {});
    }
  }
};
