/**
 * AUDIO ENGINE - PURE SYNTHESIS VIA WEB AUDIO API
 * Zero external audio assets. Synthesizes subtle tactile micro-frequencies.
 */

export class AudioEngine {
  constructor() {
    this.ctx = null;
    this.enabled = false;
    this.toggleBtn = document.getElementById('audio-toggle');
    this.statusLabel = document.getElementById('audio-status');

    this.bindEvents();
  }

  initContext() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  bindEvents() {
    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', () => {
        this.toggle();
      });
    }

    // Attach micro-sounds to elements with data-sound
    document.addEventListener('mouseover', (e) => {
      if (!this.enabled) return;
      const target = e.target.closest('a, button, [data-cursor], .project-exhibit, .skill-node');
      if (target) {
        this.playHoverBlip();
      }
    });

    document.addEventListener('click', (e) => {
      if (!this.enabled) return;
      const target = e.target.closest('a, button, .tab-btn');
      if (target) {
        this.playClickTick();
      }
    });
  }

  toggle() {
    this.initContext();
    this.enabled = !this.enabled;

    if (this.toggleBtn) {
      this.toggleBtn.classList.toggle('is-active', this.enabled);
      this.toggleBtn.setAttribute('aria-pressed', this.enabled);
    }
    if (this.statusLabel) {
      this.statusLabel.textContent = this.enabled ? 'AUDIO // ACTIVE' : 'AUDIO // MUTED';
    }

    if (this.enabled) {
      this.playClickTick();
    }
  }

  playHoverBlip() {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1800, this.ctx.currentTime + 0.035);

      gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.035);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch (e) {
      // Ignore audio synthesis errors gracefully
    }
  }

  playClickTick() {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.055);
    } catch (e) {
      // Ignore audio synthesis errors gracefully
    }
  }
}
