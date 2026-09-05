/** PRELOADER - cinematic game-style world initialization */
export class Preloader {
  constructor(onComplete) {
    this.onComplete = onComplete;
    this.preloaderEl = document.getElementById('preloader');
    this.counterEl = document.getElementById('preloader-counter');
    this.statusEl = document.getElementById('preloader-status');
    this.progressLine = document.getElementById('preloader-line');
    this.progress = 0;
    this.steps = [
      { at: 15, msg: 'INITIALIZING // AARON SAMUEL' },
      { at: 40, msg: 'CHENNAI // NIGHT DRIVE' },
      { at: 70, msg: 'LOADING WORLD // 3D SYSTEMS' },
      { at: 90, msg: 'SYNCING // PORTFOLIO DATA' },
      { at: 100, msg: 'READY // ENTER EXPERIENCE' },
    ];
    this.start();
  }
  start() {
    const startTime = performance.now();
    const duration = 1350;
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      this.progress = Math.min(Math.floor((elapsed / duration) * 100), 100);
      if (this.counterEl) this.counterEl.textContent = String(this.progress).padStart(3, '0') + '%';
      if (this.progressLine) this.progressLine.style.width = `${this.progress}%`;
      const currentStep = this.steps.find(s => this.progress <= s.at) || this.steps[this.steps.length - 1];
      if (this.statusEl && currentStep) this.statusEl.textContent = currentStep.msg;
      if (this.progress < 100) requestAnimationFrame(animate);
      else setTimeout(() => this.reveal(), 220);
    };
    requestAnimationFrame(animate);
  }
  reveal() {
    if (!this.preloaderEl) { if (this.onComplete) this.onComplete(); return; }
    this.preloaderEl.classList.add('is-loaded');
    setTimeout(() => { this.preloaderEl.remove(); if (this.onComplete) this.onComplete(); }, 850);
  }
}
