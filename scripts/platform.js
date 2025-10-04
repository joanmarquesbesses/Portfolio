import { Collider } from "../collider.js";

export class Platform {
  constructor(x, y, width, height, texturePath = null) {
    this.collider = new Collider(x, y, width, height, "solid");
    this.texture = null;
    this.isMoving = false;
    this.speedY = 0;
    this.minY = 0;
    this.maxY = 0;

    if (texturePath) {
      this.loadTexture(texturePath);
    }
  }

  loadTexture(path) {
    this.texture = new Image();
    this.texture.src = path;
  }

  update(dt) {
    if (this.isMoving) {
      this.collider.y += this.speedY * dt;
      if (this.collider.y > this.maxY || this.collider.y < this.minY) {
        this.speedY *= -1;
      }
    }
  }

  draw(ctx) {
    if (this.texture && this.texture.complete) {
      // Escala la textura al tamaño de la plataforma
      ctx.drawImage(
        this.texture,
        this.collider.x,
        this.collider.y,
        this.collider.width,
        this.collider.height
      );
    } else {
      // Fallback: color gris si no hay textura
      ctx.fillStyle = "#888";
      ctx.fillRect(
        this.collider.x,
        this.collider.y,
        this.collider.width,
        this.collider.height
      );
    }
  }
}
