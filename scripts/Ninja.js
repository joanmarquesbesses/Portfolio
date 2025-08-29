import { Animation } from "./Animation.js";

export class Ninja {
  constructor(canvas) {
    this.canvas = canvas;

    this.keys = {};
    this.x = 100;
    this.y = canvas.height - 150;
    this.velY = 0;
    this.onGround = true;
    this.flipX = false;

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

  update() {
    if (!this.ready) return;

    if (this.keys["KeyA"]) {
      this.x -= 4;
      this.currentAnim = this.walkAnim;
      this.flipX = true;
    } else if (this.keys["KeyD"]) {
      this.x += 4;
      this.currentAnim = this.walkAnim;
      this.flipX = false;
    } else {
      this.currentAnim = this.idleAnim;
    }

    // gravedad
    this.y += this.velY;
    this.velY += 0.6;
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