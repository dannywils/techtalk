class PlanetaryObject {
  constructor({ x, y, mass, stationary, color, keys }) {
    this.x = x;
    this.y = y;
    this.dx = 0;
    this.dy = 0;
    this.originalMass = mass;
    this.color = color;
    this.colorEdge = 'purple';
    this.keys = keys;
    this.shrink = false;
  }

  get width() {
    return this.mass / 9;
  }

  get mass() {
    if (this.shrink) {
      return this.originalMass / 2;
    }

    return this.originalMass;
  }

  draw() {
    const width = this.width;
    ctx.globalAlpha = 1.0;
    ctx.beginPath();
    ctx.arc(this.x, this.y, width, 0, 2 * Math.PI, false);
    ctx.fillStyle = this.color;
    ctx.lineWidth = '5';
    ctx.strokeStyle = 'white';
    ctx.fill();
    ctx.stroke();

    if (
      this.x > ctx.canvas.width ||
      this.x < 0 ||
      this.y > ctx.canvas.height ||
      this.y < 0
    ) {
      // draw indicator

      let x = this.x;

      if (this.x > ctx.canvas.width) {
        x = ctx.canvas.width;
      }

      if (this.x < 0) {
        x = 0;
      }

      let y = this.y;

      if (this.y > ctx.canvas.height) {
        y = ctx.canvas.height;
      }

      if (this.y < 0) {
        y = 0;
      }

      ctx.beginPath();
      ctx.lineWidth = width;
      ctx.strokeStyle = this.color;
      ctx.rect(x, y, width, width);
      ctx.stroke();
    }
  }
}
