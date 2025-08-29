export class Animation {
  constructor(image, frames, frameSpeed = 8, scale = 2) {
    this.image = image;
    this.frames = frames;
    this.frameSpeed = frameSpeed;
    this.scale = scale;

    this.currentFrame = 0;
    this.tick = 0;
  }

  update() {
    this.tick++;
    if (this.tick >= this.frameSpeed) {
      this.tick = 0;
      this.currentFrame = (this.currentFrame + 1) % this.frames.length;
    }
  }

  draw(ctx, posX, posY, flipX = false) {
    const f = this.frames[this.currentFrame];
    const w = f.w * this.scale;
    const h = f.h * this.scale;

    ctx.save();

    if (flipX) {
      ctx.translate(posX + w, posY);
      ctx.scale(-1, 1);
      posX = 0;
      posY = 0;
    } else {
      ctx.translate(posX, posY);
    }

    ctx.drawImage(this.image, f.x, f.y, f.w, f.h, 0, 0, w, h);
    ctx.restore();
  }
}