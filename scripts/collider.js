export class Collider {
  constructor(x, y, w, h, type = "solid", isTrigger = false) {
    this.x = x;
    this.y = y;
    this._w = w;
    this._h = h;
    this.type = type;       // "solid" o "player" o "coin"
    this.isTrigger = isTrigger;

    this.isMoving = false;
    this.speedY = 0;       
    this.minY = y;       
    this.maxY = y;
    this.direction = 1;

    this.active = true; // para desactivar sin eliminar
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

  update(deltaTime) {
    if (!this.isMoving) return;

    this.y += this.speedY * this.direction * deltaTime;

    // Rebotar en los límites
    if (this.y <= this.minY) {
      this.y = this.minY;
      this.direction = 1; // bajar
    } else if (this.y >= this.maxY) {
      this.y = this.maxY;
      this.direction = -1; // subir
    }

  }

  // Ejemplo de método de colisión
  intersects(x, y, w, h) {
    if (!this.active) return false;
    return (
      x < this.x + this._w &&
      x + w > this.x &&
      y < this.y + this._h &&
      y + h > this.y
    );
  }
}