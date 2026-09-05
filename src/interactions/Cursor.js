/**
 * CUSTOM MAGNETIC CURSOR
 * Context-aware, physics-smoothed cursor with morphing states and magnetic snapping.
 */

export class Cursor {
  constructor() {
    this.isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (this.isTouch) return;

    this.mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    this.pos = { x: this.mouse.x, y: this.mouse.y };
    this.target = { x: this.mouse.x, y: this.mouse.y };
    this.speed = 0.18;
    this.activeEl = null;

    this.createDOM();
    this.bindEvents();
    this.loop();
  }

  createDOM() {
    this.dot = document.createElement('div');
    this.dot.className = 'custom-cursor custom-cursor--dot';

    this.ring = document.createElement('div');
    this.ring.className = 'custom-cursor custom-cursor--ring';

    this.label = document.createElement('span');
    this.label.className = 'custom-cursor__label';
    this.ring.appendChild(this.label);

    document.body.appendChild(this.dot);
    document.body.appendChild(this.ring);
  }

  bindEvents() {
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;

      this.dot.style.transform = `translate3d(${this.mouse.x}px, ${this.mouse.y}px, 0)`;

      if (!this.activeEl) {
        this.target.x = this.mouse.x;
        this.target.y = this.mouse.y;
      }
    });

    document.addEventListener('mouseover', (e) => {
      const target = e.target.closest('[data-cursor]');
      if (target) {
        const type = target.getAttribute('data-cursor');
        this.setCursorState(type, target);
      }
    });

    document.addEventListener('mouseout', (e) => {
      const target = e.target.closest('[data-cursor]');
      if (target) {
        this.resetCursorState();
      }
    });

    document.addEventListener('mouseleave', () => {
      this.ring.classList.add('is-hidden');
      this.dot.classList.add('is-hidden');
    });

    document.addEventListener('mouseenter', () => {
      this.ring.classList.remove('is-hidden');
      this.dot.classList.remove('is-hidden');
    });
  }

  setCursorState(type, element) {
    this.activeEl = element;
    this.ring.className = 'custom-cursor custom-cursor--ring';
    this.ring.classList.add(`custom-cursor--${type}`);

    if (type === 'project') {
      this.label.textContent = 'EXHIBIT';
    } else if (type === 'view') {
      this.label.textContent = 'EXPLORE';
    } else if (type === 'copy') {
      this.label.textContent = 'COPY';
    } else {
      this.label.textContent = '';
    }

    // Optional magnetic pull for small buttons
    if (element.hasAttribute('data-magnetic')) {
      const rect = element.getBoundingClientRect();
      this.target.x = rect.left + rect.width / 2;
      this.target.y = rect.top + rect.height / 2;
    }
  }

  resetCursorState() {
    this.activeEl = null;
    this.ring.className = 'custom-cursor custom-cursor--ring';
    this.label.textContent = '';
    this.target.x = this.mouse.x;
    this.target.y = this.mouse.y;
  }

  loop() {
    this.pos.x += (this.target.x - this.pos.x) * this.speed;
    this.pos.y += (this.target.y - this.pos.y) * this.speed;

    this.ring.style.transform = `translate3d(${this.pos.x}px, ${this.pos.y}px, 0)`;

    requestAnimationFrame(this.loop.bind(this));
  }
}
