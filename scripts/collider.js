export class Collider {
  constructor(x, y, w, h, type = "solid", isTrigger = false) {
    this.x = x;
    this.y = y;
    this._w = w;
    this._h = h;
    this.type = type;       // "solid" o "player" o "coin"
    this.isTrigger = isTrigger;
  }

  // 🔹 Aliases: width <-> w, height <-> h
  get width() { return this._w; }
  set width(value) { this._w = value; }

  get height() { return this._h; }
  set height(value) { this._h = value; }

  get w() { return this._w; }
  set w(value) { this._w = value; }

  get h() { return this._h; }
  set h(value) { this._h = value; }

  // Ejemplo de método de colisión
  intersects(x, y, w, h) {
    return (
      x < this.x + this._w &&
      x + w > this.x &&
      y < this.y + this._h &&
      y + h > this.y
    );
  }
}