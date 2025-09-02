import { Animation } from "./Animation.js";
import { ColliderManager } from "./colliderManager.js";

export class Ninja {
  constructor(canvas) {
    this.canvas = canvas;

    this.keys = {};
    this.x = 100;
    this.y = canvas.height - 150;
    this.velY = 0;
    this.onGround = true;
    this.flipX = false;
    this.speed = 400;

    this.sprite = new Image();
    this.sprite.src = "./assets/ninja-pixilart.png";

    this.currentAnim = null;
    this.idleAnim = null;
    this.walkAnim = null;

    document.addEventListener("keydown", e => this.keys[e.code] = true);
    document.addEventListener("keyup", e => this.keys[e.code] = false);

    this.ready = false;
    this.sprite.onload = () => {
      this.idleAnim = new Animation(this.sprite, [
        {x:0, y:0, w:24, h:32},
        {x:27, y:0, w:25, h:32},
        {x:55, y:0, w:25, h:32},
      ], 10, 2);

      this.walkAnim = new Animation(this.sprite, [
        {x:0, y:37, w:26, h:29},
        {x:29, y:37, w:27, h:29},
        {x:59, y:37, w:27, h:29}
      ], 8, 2);

      this.currentAnim = this.idleAnim;
      this.ready = true;
    };
  }

  update(deltaTime) {
     if (!this.ready) return;

    let newX = this.x, newY = this.y;

    if (this.keys["KeyA"]) {
      newX -= this.speed * deltaTime;
      this.currentAnim = this.walkAnim;
      this.flipX = true;
    } else if (this.keys["KeyD"]) {
      newX += this.speed * deltaTime;
      this.currentAnim = this.walkAnim;
      this.flipX = false;
    } else {
      this.currentAnim = this.idleAnim;
    }

    // comprobar colisión antes de mover
    if (!ColliderManager.checkCollision(newX, newY, 25 * 2, 32 * 2)) {
      this.x = newX;
      this.y = newY;
    }

    if (this.keys["Space"] && this.onGround) {
      this.velY = -800 * deltaTime; // fuerza del salto
      this.onGround = false;
    }

    // gravedad
    this.y += this.velY;
    this.velY += 9.8 * deltaTime;
    // comprobar colisión vertical
    const hit = ColliderManager.checkCollision(this.x, this.y, 25 * 2, 32 * 2);
    if (hit) {
      // ninja se coloca justo encima del collider
      this.y = hit.y - 32 * 2;
      this.velY = 0;
      this.onGround = true;
    }
    if (this.y >= this.canvas.height - 150) {
      this.y = this.canvas.height - 150;
      this.velY = 0;
      this.onGround = true;
    }

    this.currentAnim.update();
  }

  draw(ctx) {
    if (!this.ready) return;
    this.currentAnim.draw(ctx, this.x, this.y, this.flipX);
  }
}