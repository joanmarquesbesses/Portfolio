import { ColliderManager } from "../colliderManager.js";
import { Collider } from "../collider.js";
import { Coin } from "../coin.js";

export class Engines {
  constructor(game) {
    this.id = "engines";
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