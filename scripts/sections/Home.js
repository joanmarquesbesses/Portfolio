import { ColliderManager } from "../colliderManager.js";
import { Collider } from "../collider.js";
import { Coin } from "../coin.js";

export class Home {
  constructor(game) {
    this.id = "home";
    this.game = game;
    this.colliders = [];
    this.coins = [];
    this.htmlCollider = null;
    this.movingPlatform = [];
  }

  onEnter() {
    // 🔹 Añadimos un collider en la esquina
    const c = new Collider(200, 770, 100, 100);  
    this.colliders.push(c);
    this.colliders.forEach(collider => ColliderManager.addCollider(collider));

    const coin = new Coin(650, 400, "./assets/coin.png");
    this.coins.push(coin);

    const card = document.querySelector("#home .card");
    if (card) {
      if (card) {
        this.htmlCollider = new Collider(0, 0, 0, 0);
        ColliderManager.addCollider(this.htmlCollider);

        // esperar a que el canvas esté bien colocado
        requestAnimationFrame(() => this.updateHtmlCollider());
      }
    }

    const platform = new Collider(300, 400, 200, 20, "solid");
    platform.isMoving = true;
    platform.speedY = 50; // píxeles por segundo
    platform.minY = 400;
    platform.maxY = 600;
    this.movingPlatform.push(platform);
    this.movingPlatform.forEach(p => ColliderManager.addCollider(p));
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

    this.movingPlatform.forEach(p => ColliderManager.removeCollider(p));
    this.movingPlatform = [];
  }

  update(deltaTime) {
    this.coins.forEach(c => c.update(deltaTime));

    if (this.htmlCollider) {
      this.updateHtmlCollider();
    }

    this.movingPlatform.forEach(p => p.update(deltaTime));
  }

  updateHtmlCollider() {
    const card = document.querySelector("#home .card");
    if (!card || !this.htmlCollider) return;

    const rect = card.getBoundingClientRect();
    const canvasRect = this.game.canvas.getBoundingClientRect();

    const relX = rect.left - canvasRect.left;
    const relY = rect.top - canvasRect.top;

    const scaleX = this.game.LOGICAL_WIDTH / canvasRect.width;
    const scaleY = this.game.LOGICAL_HEIGHT / canvasRect.height;

    this.htmlCollider.x = relX * scaleX;
    this.htmlCollider.y = relY * scaleY;
    this.htmlCollider.width = rect.width * scaleX;
    this.htmlCollider.height = rect.height * scaleY;
  }

  draw(ctx) {
    this.coins.forEach(c => c.draw(ctx));
  }
  
}

