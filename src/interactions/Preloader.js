/**
 * PRELOADER - TECHNICAL INITIALIZATION SEQUENCE
 * Orchestrates atmospheric boot sequence, coordinate lock, and progressive unmasking.
 */

export class Preloader {
  constructor(onComplete) {
    this.onComplete = onComplete;
    this.preloaderEl = document.getElementById('preloader');
    this.counterEl = document.getElementById('preloader-counter');
    this.statusEl = document.getElementById('preloader-status');
    this.progressLine = document.getElementById('preloader-line');

    this.progress = 0;
    this.steps = [
      { at: 15, msg: "SYS_CORE // OK" },
      { at: 40, msg: "COORDINATE LOCK // 13.0827° N, 80.2707° E" },
      { at: 70, msg: "COMPUTATIONAL MATRIX // ACTIVE" },
      { at: 90, msg: "SYNCHRONIZING VIEWPORT..." },
      { at: 100, msg: "SYSTEM READY" },
    ];

    this.start();
  }

  start() {
    const startTime = performance.now();
    const duration = 1100; // Fast 1.1s boot to never waste user time

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      this.progress = Math.min(Math.floor((elapsed / duration) * 100), 100);

      if (this.counterEl) {
        this.counterEl.textContent = String(this.progress).padStart(3, '0') + '%';
      }

      if (this.progressLine) {
        this.progressLine.style.width = `${this.progress}%`;
      }

      // Update telemetry messages
      const currentStep = this.steps.find((s) => this.progress <= s.at) || this.steps[this.steps.length - 1];
      if (this.statusEl && currentStep) {
        this.statusEl.textContent = currentStep.msg;
      }

      if (this.progress < 100) {
        requestAnimationFrame(animate);
      } else {
        setTimeout(() => this.reveal(), 150);
      }
    };

    requestAnimationFrame(animate);
  }

  reveal() {
    if (!this.preloaderEl) {
      if (this.onComplete) this.onComplete();
      return;
    }

    this.preloaderEl.classList.add('is-loaded');

    setTimeout(() => {
      this.preloaderEl.remove();
      if (this.onComplete) this.onComplete();
    }, 700);
  }
}
