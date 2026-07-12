import { Animation } from "./Animation.js";
import { Collider } from "./collider.js";
import { ColliderManager } from "./colliderManager.js";

export class Ninja {
  constructor(canvas) {
    this.canvas = canvas;

    this.keys = {};
    this.x = 100;
    this.y = canvas.height - 150;

    this.velX = 0;
    this.velY = 0;

    this.onGround = true;
    this.flipX = false;

    this.speed = 200; // pixels por segundo
    this.jumpForce = -800; // fuerza del salto
    this.gravity = 2000; // gravedad

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
      ], 0.25, 2);

      this.walkAnim = new Animation(this.sprite, [
        {x:0, y:37, w:26, h:29},
        {x:29, y:37, w:27, h:29},
        {x:59, y:37, w:27, h:29}
      ], 0.12, 2);

      this.currentAnim = this.idleAnim;

      this.width = 25 * this.idleAnim.scale;
      this.height = 32 * this.idleAnim.scale;
      this.collider = new Collider(this.x, this.y, this.width, this.height, "player");

      ColliderManager.addCollider(this.collider);

      this.ready = true;
    };
  }

  update(deltaTime) {
     if (!this.ready) return;

    let newX = this.collider.x;
    let newY = this.collider.y;

    //movimiento horizontal
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

    //salto
    if (this.keys["Space"] && this.onGround) {
      this.velY = this.jumpForce; 
      this.onGround = false;
    }

    //gravedad
    this.velY += this.gravity * deltaTime;
    newY = this.collider.y + (this.velY * deltaTime);

    //suelo
   const floorY = this.canvas.height - this.height;
   if (newY >= floorY) {
    newY = floorY;
    this.velY = 0;
    this.onGround = true;
   }

    // comprobar colisión horizontal
    if (!ColliderManager.checkCollision(newX, this.collider.y, this.width, this.height, this.collider.type)) {
      this.collider.x = newX;
    }

    // comprobar colisión vertical
    const vHit = ColliderManager.checkCollision(this.collider.x, newY, this.width, this.height, this.collider.type);
    if (!vHit) {
      this.collider.y = newY;

      // probe de 2px para saber si estamos apoyados sobre algo
      const probe = ColliderManager.checkCollision(this.collider.x, this.collider.y + 2, this.width, this.height, this.collider.type);
      this.groundCollider = probe;

      // suelo base o plataforma
      this.onGround = !!probe || this.collider.y >= floorY - 0.5;
    } else {
      if (this.velY > 0) { // cayendo
        this.collider.y = vHit.y - this.height - 0.01;
        this.velY = 0;
        this.onGround = true;
        this.groundCollider = vHit;
      } else if (this.velY < 0) { // subiendo
        this.collider.y = vHit.y + vHit.h + 0.01;
        this.velY = 0;
      }
    }

    if (this.onGround && this.groundCollider?.isMoving) {
      const p = this.groundCollider;

      // solo mover con la plataforma si no estamos saltando (velY ≈ 0)
      if (Math.abs(this.velY) < 1) {
        const dx = (p.speedX || 0) * p.direction * deltaTime;
        const dy = (p.speedY || 0) * p.direction * deltaTime;

        this.collider.x += dx;
        this.collider.y += dy;
        this.x += dx;
        this.y += dy;
      }
    }
    
    // sincronizar para dibujar
    this.x = this.collider.x;
    this.y = this.collider.y;

    this.currentAnim.update(deltaTime);
  }

  draw(ctx) {
    if (!this.ready) return;
    this.currentAnim.draw(ctx, this.x, this.y, this.flipX);
  }
}