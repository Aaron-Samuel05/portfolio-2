/**
 * PING PONG INTERACTIVE PHYSICS ENGINE
 * Demonstrates cross-runtime physics simulation directly in the Exhibit 03 canvas.
 */

export class PingPongEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = canvas.width = 460;
    this.height = canvas.height = 220;

    this.ball = {
      x: this.width / 2,
      y: this.height / 2,
      vx: 3.5,
      vy: 2.2,
      radius: 4.5,
      trail: [],
    };

    this.paddleHeight = 44;
    this.paddleWidth = 6;
    this.paddleL = { y: this.height / 2 - 22, score: 0 };
    this.paddleR = { y: this.height / 2 - 22, score: 0 };

    this.userControl = false;
    this.animationId = null;

    this.initEvents();
    this.start();
  }

  initEvents() {
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const relativeY = (e.clientY - rect.top) * (this.height / rect.height);
      this.paddleR.y = Math.max(0, Math.min(this.height - this.paddleHeight, relativeY - this.paddleHeight / 2));
      this.userControl = true;
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.userControl = false;
    });
  }

  start() {
    let lastTime = performance.now();

    const loop = (time) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      this.update(dt);
      this.render();

      this.animationId = requestAnimationFrame(loop);
    };

    this.animationId = requestAnimationFrame(loop);
  }

  update(dt) {
    // Autonomous AI for left paddle
    const targetL = this.ball.y - this.paddleHeight / 2;
    this.paddleL.y += (targetL - this.paddleL.y) * 0.08;
    this.paddleL.y = Math.max(0, Math.min(this.height - this.paddleHeight, this.paddleL.y));

    // Autonomous AI for right paddle when not mouse-controlled
    if (!this.userControl) {
      const targetR = this.ball.y - this.paddleHeight / 2;
      this.paddleR.y += (targetR - this.paddleR.y) * 0.09;
      this.paddleR.y = Math.max(0, Math.min(this.height - this.paddleHeight, this.paddleR.y));
    }

    // Ball movement
    this.ball.x += this.ball.vx;
    this.ball.y += this.ball.vy;

    // Trail buffer
    this.ball.trail.push({ x: this.ball.x, y: this.ball.y });
    if (this.ball.trail.length > 8) this.ball.trail.shift();

    // Top / bottom collision
    if (this.ball.y - this.ball.radius <= 0) {
      this.ball.y = this.ball.radius;
      this.ball.vy *= -1;
    } else if (this.ball.y + this.ball.radius >= this.height) {
      this.ball.y = this.height - this.ball.radius;
      this.ball.vy *= -1;
    }

    // Left paddle collision
    if (
      this.ball.x - this.ball.radius <= 20 + this.paddleWidth &&
      this.ball.y >= this.paddleL.y &&
      this.ball.y <= this.paddleL.y + this.paddleHeight
    ) {
      this.ball.vx = Math.abs(this.ball.vx) * 1.04;
      const hitOffset = (this.ball.y - (this.paddleL.y + this.paddleHeight / 2)) / (this.paddleHeight / 2);
      this.ball.vy = hitOffset * 3.5;
    }

    // Right paddle collision
    if (
      this.ball.x + this.ball.radius >= this.width - 20 - this.paddleWidth &&
      this.ball.y >= this.paddleR.y &&
      this.ball.y <= this.paddleR.y + this.paddleHeight
    ) {
      this.ball.vx = -Math.abs(this.ball.vx) * 1.04;
      const hitOffset = (this.ball.y - (this.paddleR.y + this.paddleHeight / 2)) / (this.paddleHeight / 2);
      this.ball.vy = hitOffset * 3.5;
    }

    // Scoring reset
    if (this.ball.x < 0) {
      this.paddleR.score++;
      this.resetBall(1);
    } else if (this.ball.x > this.width) {
      this.paddleL.score++;
      this.resetBall(-1);
    }
  }

  resetBall(direction = 1) {
    this.ball.x = this.width / 2;
    this.ball.y = this.height / 2;
    this.ball.vx = direction * 3.5;
    this.ball.vy = (Math.random() - 0.5) * 3;
    this.ball.trail = [];
  }

  render() {
    const { ctx, width, height } = this;

    // Pitch backdrop
    ctx.fillStyle = '#06070a';
    ctx.fillRect(0, 0, width, height);

    // Center divider line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Scores
    ctx.font = '12px "JetBrains Mono", monospace';
    ctx.fillStyle = '#5e6676';
    ctx.fillText(`JVM: ${this.paddleL.score}`, width / 2 - 64, 20);
    ctx.fillText(`CPY: ${this.paddleR.score}`, width / 2 + 14, 20);

    // Trail
    this.ball.trail.forEach((t, i) => {
      ctx.beginPath();
      ctx.arc(t.x, t.y, this.ball.radius * (i / 8), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(77, 150, 255, ${i * 0.08})`;
      ctx.fill();
    });

    // Ball
    ctx.beginPath();
    ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#4d96ff';
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Left Paddle
    ctx.fillStyle = '#00e5a3';
    ctx.fillRect(20, this.paddleL.y, this.paddleWidth, this.paddleHeight);

    // Right Paddle
    ctx.fillStyle = '#ff8533';
    ctx.fillRect(width - 20 - this.paddleWidth, this.paddleR.y, this.paddleWidth, this.paddleHeight);
  }

  destroy() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
  }
}
