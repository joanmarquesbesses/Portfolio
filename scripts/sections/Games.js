import { ColliderManager } from "../colliderManager.js";
import { Collider } from "../collider.js";
import { Coin } from "../coin.js";

export class Games {
  constructor(game) {
    this.id = "games";
    this.game = game;
    this.movingPlatform = [];
  }

  onEnter() {
    const platform = new Collider(75, 950, 200, 20, "solid");
    platform.isMoving = true;
    platform.speedY = 150; // píxeles por segundo
    platform.minY = 200;
    platform.maxY = 950;
    this.movingPlatform.push(platform);

    const platform1 = new Collider(1650, 950, 200, 20, "solid");
    platform1.isMoving = true;
    platform1.speedY = 150; // píxeles por segundo
    platform1.minY = 200;
    platform1.maxY = 950;
    this.movingPlatform.push(platform1);
    this.movingPlatform.forEach(p => ColliderManager.addCollider(p));

    const platform2 = new Collider(750, 175, 200, 20, "solid");
    platform2.isMoving = true;
    platform2.speedX = 90; // píxeles por segundo
    platform2.minX = 300;
    platform2.maxX = 750;
    this.movingPlatform.push(platform2);
    this.movingPlatform.forEach(p => ColliderManager.addCollider(p));

    const platform3 = new Collider(650, 175, 200, 20, "solid");
    platform3.isMoving = true;
    platform3.speedX = 90; // píxeles por segundo
    platform3.minX = 950;
    platform3.maxX = 1400;
    this.movingPlatform.push(platform3);
    this.movingPlatform.forEach(p => ColliderManager.addCollider(p));
  }

  onExit() {
    this.movingPlatform.forEach(p => ColliderManager.removeCollider(p));
    this.movingPlatform = [];
  }

  update(deltaTime) {
    this.movingPlatform.forEach(p => p.update(deltaTime));
  }

  draw(ctx) {
    ctx.save();
    ctx.fillStyle = "rgba(100, 200, 255, 0.8)"; // color visible para debug
    this.movingPlatform.forEach(p => {
      ctx.fillRect(p.x, p.y, p.width, p.height);
    });
    ctx.restore();
  }

}