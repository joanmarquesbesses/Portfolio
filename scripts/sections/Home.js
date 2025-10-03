import { ColliderManager } from "../colliderManager.js";
import { Collider } from "../collider.js";
import { Coin } from "../coin.js";

export class Home {
  constructor(game) {
    this.id = "home";
    this.game = game;
    this.colliders = [];
    this.coins = [];
    this.htmlColliderMain = null;
    this.htmlColliderLeft = null;
    this.htmlColliderRight = null;
    this.movingPlatform = [];
  }

  onEnter() {
    // 🔹 Añadimos un collider en la esquina
    //const c = new Collider(200, 770, 100, 100);  
    //this.colliders.push(c);
    //this.colliders.forEach(collider => ColliderManager.addCollider(collider));

    const main = document.querySelector("#home .card");
    if (main) {
      this.htmlColliderMain = new Collider(0, 0, 0, 0);
      ColliderManager.addCollider(this.htmlColliderMain);
      requestAnimationFrame(() =>
        this.updateHtmlCollider(".card", this.htmlColliderMain)
      );
    }

    const left = document.querySelector("#home .left-card");
    if (left && !left.classList.contains("hidden")) {
      this.htmlColliderLeft = new Collider(0, 0, 0, 0);
      ColliderManager.addCollider(this.htmlColliderLeft);
      requestAnimationFrame(() =>
        this.updateHtmlCollider(".left-card", this.htmlColliderLeft)
      );
    }

    // --- Right card
    const right = document.querySelector("#home .right-card");
    if (right && !right.classList.contains("hidden")) {
      this.htmlColliderRight = new Collider(0, 0, 0, 0);
      ColliderManager.addCollider(this.htmlColliderRight);
      requestAnimationFrame(() =>
        this.updateHtmlCollider(".right-card", this.htmlColliderRight)
      );
    }

    const platform = new Collider(100, 800, 200, 20, "solid");
    platform.isMoving = true;
    platform.speedY = 150; // píxeles por segundo
    platform.minY = 250;
    platform.maxY = 950;
    this.movingPlatform.push(platform);

    const platform1 = new Collider(1650, 800, 200, 20, "solid");
    platform1.isMoving = true;
    platform1.speedY = 150; // píxeles por segundo
    platform1.minY = 250;
    platform1.maxY = 950;
    this.movingPlatform.push(platform1);
    this.movingPlatform.forEach(p => ColliderManager.addCollider(p));

    const coin = new Coin(this.htmlColliderMain.x + this.htmlColliderMain.w/2, this.htmlColliderMain.y - 100, "./assets/coin.png");
    this.coins.push(coin);
  }

  onExit() {
    console.log("Saliendo de Home");

    this.colliders.forEach(c => ColliderManager.removeCollider(c));
    this.colliders = [];

    if (this.htmlColliderMain) {
      ColliderManager.removeCollider(this.htmlColliderMain);
      this.htmlColliderMain = null;
    }
    if (this.htmlColliderLeft) {
      ColliderManager.removeCollider(this.htmlColliderLeft);
      this.htmlColliderLeft = null;
    }
    if (this.htmlColliderRight) {
      ColliderManager.removeCollider(this.htmlColliderRight);
      this.htmlColliderRight = null;
    }


    this.movingPlatform.forEach(p => ColliderManager.removeCollider(p));
    this.movingPlatform = [];
  }

  update(deltaTime) {
    if (this.htmlColliderMain) {
      this.updateHtmlCollider(".card", this.htmlColliderMain);
    }
    const left = document.querySelector("#home .left-card");
    if (this.isElementVisible(left)) {
      if (!this.htmlColliderLeft) {
        this.htmlColliderLeft = new Collider(0, 0, 0, 0);
        ColliderManager.addCollider(this.htmlColliderLeft);
      }
      this.updateHtmlCollider(".left-card", this.htmlColliderLeft);
    } else if (this.htmlColliderLeft) {
      ColliderManager.removeCollider(this.htmlColliderLeft);
      this.htmlColliderLeft = null;
    }

    // --- Right card ---
    const right = document.querySelector("#home .right-card");
    if (this.isElementVisible(right)) {
      if (!this.htmlColliderRight) {
        this.htmlColliderRight = new Collider(0, 0, 0, 0);
        ColliderManager.addCollider(this.htmlColliderRight);
      }
      this.updateHtmlCollider(".right-card", this.htmlColliderRight);
    } else if (this.htmlColliderRight) {
      ColliderManager.removeCollider(this.htmlColliderRight);
      this.htmlColliderRight = null;
    }

    this.movingPlatform.forEach(p => p.update(deltaTime));
    this.updateCoinPosition();
    this.coins.forEach(c => c.update(deltaTime));
  }

  updateHtmlCollider(selector, collider) {
    const card = document.querySelector(`#home ${selector}`);
    if (!card || !collider) return;

    const rect = card.getBoundingClientRect();
    const canvasRect = this.game.canvas.getBoundingClientRect();

    const relX = rect.left - canvasRect.left;
    const relY = rect.top - canvasRect.top;

    const scaleX = this.game.LOGICAL_WIDTH / canvasRect.width;
    const scaleY = this.game.LOGICAL_HEIGHT / canvasRect.height;

    collider.x = relX * scaleX;
    collider.y = relY * scaleY;
    collider.width = rect.width * scaleX;
    collider.height = rect.height * scaleY;
  }

  isElementVisible(el) {
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    return (
      rect.width > 0 &&
      rect.height > 0 &&
      rect.bottom > 0 &&
      rect.right > 0 &&
      rect.top < window.innerHeight &&
      rect.left < window.innerWidth &&
      window.getComputedStyle(el).opacity !== "0" &&
      window.getComputedStyle(el).visibility !== "hidden"
    );
  }

  updateCoinPosition(){
    if(!this.coins.at(0).collected){
      const coin = this.coins.at(0);
      this.coins.at(0).setPosition((this.htmlColliderMain.x + this.htmlColliderMain.w/2) - coin.width/2, 
      (this.htmlColliderMain.y - coin.height - 50));
    }
  }

  draw(ctx) {
    this.coins.forEach(c => c.draw(ctx));
  }
  
}

