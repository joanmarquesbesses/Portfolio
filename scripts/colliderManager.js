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

  // ✅ Ignora un collider concreto (por referencia)
  static checkCollision(x, y, w, h, ignoreCollider = null) {
    for (let c of this.colliders) {
      if (ignoreCollider && c === ignoreCollider) continue;   // 👈 clave
      if (c.intersects(x, y, w, h)) return c;
    }
    return null;
  }

  static draw(ctx) {
    if (!this.debug) return;
    ctx.save();
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    for (let c of this.colliders) {
      ctx.strokeRect(c.x, c.y, c.w, c.h);
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