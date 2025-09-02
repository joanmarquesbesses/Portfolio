import { ColliderManager } from "../colliderManager.js";
import { Collider } from "../collider.js";

export class Home {
  constructor() {
    this.id = "home";
    this.colliders = [];
  }

  onEnter() {
    console.log("Entrando en Home");

    // 🔹 Añadimos un collider en la esquina
    const c = new Collider(200, 750, 100, 100);
    const c2 = new Collider(300, 700, 100, 100);
    const c3 = new Collider(400, 650, 100, 100);
    const c4 = new Collider(500, 600, 100, 100);
    this.colliders.push(c);
    this.colliders.push(c2);
    this.colliders.push(c3);
    this.colliders.push(c4);
    ColliderManager.addCollider(c);
    ColliderManager.addCollider(c2);
    ColliderManager.addCollider(c3);
    ColliderManager.addCollider(c4);
  }

  onExit() {
    console.log("Saliendo de Home");

    this.colliders.forEach(c => ColliderManager.removeCollider(c));
    this.colliders = [];
  }
}

