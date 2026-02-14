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
    if (!this.canvas || !this.ctx) return;
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
