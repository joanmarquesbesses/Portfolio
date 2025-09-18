import { ColliderManager } from "../colliderManager.js";
import { Collider } from "../collider.js";
import { Coin } from "../coin.js";

export class Home {
  constructor() {
    this.id = "home";
    this.colliders = [];
    this.coins = [];
    this.htmlCollider = null;
  }

  onEnter() {
    console.log("Entrando en Home");

    // 🔹 Añadimos un collider en la esquina
    const c = new Collider(200, 770, 100, 100);
    const c2 = new Collider(300, 700, 100, 100);
    const c3 = new Collider(400, 650, 100, 100);
    const c4 = new Collider(500, 600, 100, 100);
    this.colliders.push(c, c2, c3, c4);
    this.colliders.forEach(collider => ColliderManager.addCollider(collider));

    const coin = new Coin(650, 400, "./assets/coin.png");
    this.coins.push(coin);

    const card = document.querySelector("#home .card");
    if (card) {
      const rect = card.getBoundingClientRect();
      // convertir de coordenadas pantalla a canvas (ej: 1920x1080 base)
      const scaleX = window.innerWidth / 1920;
      const scaleY = window.innerHeight / 1080;

      const collider = new Collider(
        rect.left / scaleX,
        rect.top / scaleY,
        rect.width / scaleX,
        rect.height / scaleY
      );

      this.htmlCollider = collider;
      ColliderManager.addCollider(this.htmlCollider);
    }
  }

  onExit() {
    console.log("Saliendo de Home");

    this.colliders.forEach(c => ColliderManager.removeCollider(c));
    this.colliders = [];

    if (this.htmlCollider) {
      ColliderManager.removeCollider(this.htmlCollider);
      this.htmlCollider = null;
    }

    this.coins = [];
  }

  update(deltaTime) {
    this.coins.forEach(c => c.update(deltaTime));

    if (this.htmlCollider) {
      const card = document.querySelector("#home .card");
      if (card) {
        const rect = card.getBoundingClientRect();
        const scaleX = window.innerWidth / 1920;
        const scaleY = window.innerHeight / 1080;

        this.htmlCollider.x = rect.left / scaleX;
        this.htmlCollider.y = rect.top / scaleY;
        this.htmlCollider.width = rect.width / scaleX;
        this.htmlCollider.height = rect.height / scaleY;
      }
    }
  }

  draw(ctx) {
    this.coins.forEach(c => c.draw(ctx));
  }
  
}

