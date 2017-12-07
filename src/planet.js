import { canvas, ctx } from './draw';

export class Planet {
  constructor({
    x,
    y,
    mass,
    stationary,
    color,
    keys,
    bounds,
    pattern = '/images/astroid.jpg'
  }) {
    this.original = {
      x,
      y
    };

    this.x = x;
    this.y = y;
    this.bounds = bounds;
    this.dx = 0;
    this.dy = 0;
    this.originalMass = mass;
    this.color = color;
    this.colorEdge = 'purple';
    this.keys = keys;
    this.shrink = false;
    this.moons = [];
    this.lives = 4;
    this.texture = document.createElement('img');
    this.texture.src = pattern;

    this.texture.onload = () => {
      this.pattern = ctx.createPattern(this.texture, 'repeat');
    };
  }

  get width() {
    return this.mass / 9 / this.percentageOfXBounds;
  }

  get mass() {
    return this.originalMass * this.percentageOfXBounds;
  }

  get percentageOfXBounds() {
    if (
      this.bounds &&
      this.bounds.x0 !== undefined &&
      this.bounds.x1 !== undefined
    ) {
      let firstBound, secondBound;

      if (this.bounds.x0 !== 0) {
        firstBound = this.bounds.x0;
        secondBound = this.bounds.x1;
      } else {
        firstBound = this.bounds.x1;
        secondBound = this.bounds.x0;
      }

      const percentageOfXBounds =
        (this.x - firstBound) / (secondBound - firstBound);

      return Math.max(percentageOfXBounds, 0.5);
    }

    return 1;
  }

  respawn() {
    // this.x = this.original.x;
    // this.y = this.original.y;
  }

  hit() {
    this.lives = Math.max(0, this.lives - 1);

    if (this.lives) {
      this.respawn();
    }
  }

  moveX(distance) {
    const { x0, x1 } = this.bounds;

    const newX = this.x + distance;

    if (newX - this.width / 2 > x0 && newX + this.width / 2 < x1) {
      this.x = newX;
    }
  }

  moveY(distance) {
    const { y0, y1 } = this.bounds;
    const newY = this.y + distance;
    if (newY - this.width / 2 > y0 && newY + this.width / 2 < y1) {
      this.y = newY;
    }
  }

  draw() {
    ctx.globalAlpha = 1.0;

    if (this.pattern) {
      ctx.beginPath();
      ctx.save();
      ctx.arc(this.x, this.y, this.width, 0, 2 * Math.PI, false);
      ctx.moveTo(this.x, this.y);
      ctx.translate(this.x + 250, this.y - 150);
      ctx.fillStyle = this.pattern;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(this.x, this.y, this.width, 0, 2 * Math.PI, false);
      ctx.clip();
      ctx.restore();

      ctx.beginPath();
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 15;
      ctx.shadowBlur = 35;
      ctx.shadowColor = 'black';
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.arc(this.x, this.y, this.width, 0, 2 * Math.PI, false);
      ctx.stroke();
    }
  }
}
