import { ColliderManager } from "../colliderManager.js";
import { Collider } from "../collider.js";
import { Coin } from "../coin.js";

export class Engines {
  constructor(game) {
    this.id = "engines";
    this.game = game;
    this.movingPlatform = [];
    this.coin = null;
    this.createCoin = true;
  }

  onEnter() {
    const platform = new Collider(75, 950, 200, 20, "solid");
    platform.isMoving = true;
    platform.speedY = 150; // píxeles por segundo
    platform.minY = 350;
    platform.maxY = 950;
    this.movingPlatform.push(platform);

    const platform1 = new Collider(1400, 350, 200, 20, "solid");
    platform1.isMoving = true;
    platform1.speedX = 281.25; // píxeles por segundo
    platform1.minX = 275;
    platform1.maxX = 1400;
    this.movingPlatform.push(platform1);

    this.movingPlatform.forEach(p => ColliderManager.addCollider(p));

    if(this.coin === null && this.createCoin){
      const coin = new Coin(925, 775, "./assets/coin.png");
      this.coin = coin;
      this.createCoin = false;
    }else if(this.coin != null){
      if(!this.coin.collected) this.coin.collider.active = true;
    }
  }

  onExit() {
    this.movingPlatform.forEach(p => ColliderManager.removeCollider(p));
    this.movingPlatform = [];

    if (this.coin != null) {
      this.coin.collider.active = false;
    }
  }

  update(deltaTime) {
    this.movingPlatform.forEach(p => p.update(deltaTime));

    if(this.coin != null){
      this.coin.update(deltaTime);
      if(this.coin.collected) {
        this.coin = null;
        this.game.collectedCoins += 1;
      }
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.fillStyle = "rgba(100, 200, 255, 0.8)"; // color visible para debug
    this.movingPlatform.forEach(p => {
      ctx.fillRect(p.x, p.y, p.width, p.height);
    });
    ctx.restore();

    if(this.coin === null) return;
    this.coin.draw(ctx);
  }
}