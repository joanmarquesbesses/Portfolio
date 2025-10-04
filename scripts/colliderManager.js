export class ColliderManager {
  static colliders = [];
  static debug = false;

  static addCollider(collider) {
    this.colliders.push(collider);
  }

  static addColliders(list) {
    this.colliders.push(...list);
  }

  static removeCollider(collider) {
    this.colliders = this.colliders.filter(c => c !== collider);
  }

  static checkCollision(x, y, w, h, ignoreType = null) {
    for (let c of this.colliders) {
      if (ignoreType && c.type === ignoreType) continue;

      if (c.intersects(x, y, w, h)) {
        if (c.isTrigger) {
          // dispara evento pero NO bloquea
          if (c.onTrigger) c.onTrigger();
          return null; // los triggers no bloquean movimiento
        }
        return c; // colisión normal (sólido)
      }
    }
    return null;
  }

  static draw(ctx) {
    if (!this.debug) return;
    ctx.save();
    ctx.lineWidth = 2;
    for (let c of this.colliders) {
      if (!c.active) continue;
      if (c.type === "solid") {
        ctx.strokeStyle = "red";
        ctx.strokeRect(c.x, c.y, c.w, c.h);
      }else if (c.type === "player") {
        ctx.strokeStyle = "blue";
        ctx.strokeRect(c.x, c.y, c.w, c.h);
      }else if (c.type === "coin") {
        ctx.strokeStyle = "yellow";
        ctx.strokeRect(c.x, c.y, c.w, c.h);
      }
    }
    ctx.restore();
  }
}

// toggle con la tecla C
document.addEventListener("keydown", e => {
  if (e.code === "KeyC") {
    ColliderManager.debug = !ColliderManager.debug;
  }
});