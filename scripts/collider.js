export class Collider {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  intersects(x, y, w, h) {
    return (
      x < this.x + this.w &&
      x + w > this.x &&
      y < this.y + this.h &&
      y + h > this.y
    );
  }
}