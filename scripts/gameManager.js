import { Home } from "./sections/Home.js";
import { Games } from "./sections/Games.js";
import { Contact } from "./sections/Contact.js";
import { Ninja } from "./ninja.js";
import { ColliderManager } from "./colliderManager.js";

export class GameManager {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    
    this.lastTime = 0;
    this.isTransitioning = false;
    
    this.LOGICAL_WIDTH = 1920;
    this.LOGICAL_HEIGHT = 1080;

    this.canvas.width = this.LOGICAL_WIDTH;
    this.canvas.height = this.LOGICAL_HEIGHT;

    this.scaleX = this.canvas.clientWidth / this.LOGICAL_WIDTH;
    this.scaleY = this.canvas.clientHeight / this.LOGICAL_HEIGHT;

    this.ctx.imageSmoothingEnabled = false;

    this.resizeCanvas();
    window.addEventListener("resize", () => this.resizeCanvas());
    
    this.pixelSize = 20;
    this.pixelDuration = 620; // ms
    
    this.ninja = new Ninja(canvas);

    this.sections = {
      home: new Home(),
      games: new Games(),
      contact: new Contact()
    };

    this.currentSection = this.sections.home;
    this.showSection(this.currentSection.id);
    this.currentSection.onEnter();
  }

  resizeCanvas() {
    const canvas = document.getElementById("gameCanvas");

    const aspect = 16 / 9;
    let width = window.innerWidth;
    let height = window.innerHeight;

    if (width / height > aspect) {
      height = window.innerHeight;
      width = height * aspect;
    } else {
      width = window.innerWidth;
      height = width / aspect;
    }

    // 🔹 OJO: mantenemos el tamaño lógico fijo
    canvas.width = this.LOGICAL_WIDTH;
    canvas.height = this.LOGICAL_HEIGHT;

    // 🔹 Escalado solo por CSS
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    canvas.style.left = "50%";
    canvas.style.top = "50%";
    canvas.style.transform = "translate(-50%, -50%)";

    // Ajustar side-walls
    const leftWall = document.querySelector(".side-wall.left");
    const rightWall = document.querySelector(".side-wall.right");
    const sideWidth = (window.innerWidth - width) / 2;
    leftWall.style.width = sideWidth + "px";
    rightWall.style.width = sideWidth + "px";
  }

  start() {
    requestAnimationFrame(this.loop.bind(this));
  }

  update(deltaTime) {
    this.ninja.update(deltaTime);

    if (!this.isTransitioning) {
      if (this.ninja.x + this.ninja.width >= this.LOGICAL_WIDTH) {
        this.changeSection("games", "right");
      } else if (this.ninja.x <= 0) {
        this.changeSection("home", "left");
      }
    } 

  if (this.currentSection.update) {
    this.currentSection.update(deltaTime);
  }
}

  draw() {
    this.ctx.clearRect(0, 0, this.LOGICAL_WIDTH, this.LOGICAL_HEIGHT);
    this.currentSection?.draw?.(this.ctx);
    this.ninja.draw(this.ctx);
  }

  loop(timestamp = 0) {
    const deltaTime = Math.min((timestamp - this.lastTime) / 1000, 0.05);
    this.lastTime = timestamp;

    this.update(deltaTime);
    this.draw();
    ColliderManager.draw(this.ctx);

    requestAnimationFrame(this.loop.bind(this));
  }

  pixelFadeIn(callback) {
    const canvas = document.getElementById("pixel-overlay");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.display = "block";

    const pixels = [];
    for (let y = 0; y < canvas.height; y += this.pixelSize) {
      for (let x = 0; x < canvas.width; x += this.pixelSize) {
        pixels.push({ x, y });
      }
    }
    pixels.sort(() => Math.random() - 0.5);

    let i = 0;
    const total = pixels.length;
    const duration = this.pixelDuration; // ms → duración total
    const start = performance.now();

    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const targetCount = Math.floor(progress * total);

      while (i < targetCount) {
        const p = pixels[i++];
        ctx.fillStyle = "black";
        ctx.fillRect(p.x, p.y, this.pixelSize, this.pixelSize);
      }

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        if (callback) callback();
      }
    };
    requestAnimationFrame(step);
  }

  pixelFadeOut(callback) {
    const canvas = document.getElementById("pixel-overlay");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.display = "block";

    const pixels = [];
    for (let y = 0; y < canvas.height; y += this.pixelSize) {
      for (let x = 0; x < canvas.width; x += this.pixelSize) {
        pixels.push({ x, y });
      }
    }
    pixels.sort(() => Math.random() - 0.5);

    // primero cubrir todo
    ctx.fillStyle = "black";
    for (let p of pixels) {
      ctx.fillRect(p.x, p.y, this.pixelSize, this.pixelSize);
    }

    let i = 0;
    const total = pixels.length;
    const duration = this.pixelDuration; // ms → duración total
    const start = performance.now();

    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const targetCount = Math.floor(progress * total);

      while (i < targetCount) {
        const p = pixels[i++];
        ctx.clearRect(p.x, p.y, this.pixelSize, this.pixelSize);
      }

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        canvas.style.display = "none";
        if (callback) callback();
      }
    };
    requestAnimationFrame(step);
  }

  changeSection(targetId, direction = null) {
    if (this.currentSection.id === targetId) return;
    this.isTransitioning = true;

    this.pixelFadeIn(() => {
      // 🔹 cambiar sección en negro
      this.currentSection.onExit();
      this.hideSection(this.currentSection.id);

      this.currentSection = this.sections[targetId];
      this.showSection(this.currentSection.id);
      this.currentSection.onEnter();

      // 🔹 recolocar ninja
      if (direction === "right") {
        this.ninja.x = 10;
      } else if (direction === "left") {
        this.ninja.x = this.LOGICAL_WIDTH - this.ninja.width - 10;
      } else {
        this.ninja.x = this.LOGICAL_WIDTH / 2 - this.ninja.width / 2;
      }

      this.ninja.collider.x = this.ninja.x;

      this.pixelFadeOut(() => {
        this.isTransitioning = false;
      });
    });
  }

  showSection(id) {
    const section = document.getElementById(id);
    section.classList.remove("hidden");
    requestAnimationFrame(() => {
      section.style.opacity = "1";
    });
  }

  hideSection(id) {
    const section = document.getElementById(id);
    section.style.opacity = "0";
    setTimeout(() => {
      section.classList.add("hidden");
    }, 1);
  }
}