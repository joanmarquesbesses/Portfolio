import { Animation } from "./Animation.js";
import { Collider } from "./collider.js";
import { ColliderManager } from "./colliderManager.js";

export class Coin {
  constructor(x, y, spriteSheet) {
    this.x = x;
    this.y = y;
    this.width = 16;  // ajusta al tamaño de tu sprite
    this.height = 16;

    this.sprite = new Image();
    this.sprite.src = spriteSheet;

    this.ready = false;
    this.anim = null;

    this.sprite.onload = () => {
      // ejemplo: 6 frames de 115x97 cada uno en fila
      this.anim = new Animation(this.sprite, [
        { x: 0,  y: 0,  w: 115, h: 97 },
        { x: 115, y: 0,  w: 115, h: 97 },
        { x: 230, y: 0,  w: 115, h: 97 },
        { x: 345, y: 0,  w: 115, h: 97 },
        { x: 460, y: 0,  w: 115, h: 97 },
        { x: 575, y: 0,  w: 115, h: 97 },
      ], 0.1, 0.5);

      this.width = 115 * this.anim.scale;
      this.height = 97 * this.anim.scale;

      this.collider = new Collider(this.x, this.y, this.width, this.height, "coin", true);
      this.collider.onTrigger = () => this.collect();

      ColliderManager.addCollider(this.collider);
      this.ready = true;
    };

    this.collected = false;
  }

  collect() {
    if (this.collected) return;
    this.collected = true;
    ColliderManager.removeCollider(this.collider);
    console.log("Moneda recogida!");
    // aquí puedes sumar puntuación, sonido, etc.
  }

  update(deltaTime) {
    if (!this.ready || this.collected) return;
    this.anim.update(deltaTime);
  }

  draw(ctx) {
    if (!this.ready || this.collected) return;
    this.anim.draw(ctx, this.x, this.y, false);
  }
}