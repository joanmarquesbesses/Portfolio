import { Home } from "./sections/Home.js";
import { Games } from "./sections/Games.js";
import { Contact } from "./sections/Contact.js";
import { Ninja } from "./ninja.js";
import { ColliderManager } from "./colliderManager.js";

export class GameManager {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.ninja = new Ninja(canvas);

    this.lastTime = 0;
    this.isTransitioning = false;


    this.pixelSize = 20;
    this.pixelSpeed = 50; 

    this.sections = {
      home: new Home(),
      games: new Games(),
      contact: new Contact()
    };

    this.currentSection = this.sections.home;
    this.showSection(this.currentSection.id);
    this.currentSection.onEnter();
  }

  start() {
    requestAnimationFrame(this.loop.bind(this));
  }

  update(deltaTime) {
    this.ninja.update(deltaTime);

    if (!this.isTransitioning) { 
      if (this.ninja.x + 40 > this.canvas.width) {
        this.changeSection("games", "right");
      } else if (this.ninja.x < 0) {
        this.changeSection("home", "left");
      }
    }

    if (this.currentSection.update) {
      this.currentSection.update(deltaTime);
    }
}

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ninja.draw(this.ctx);
    if (this.currentSection.draw) {
      this.currentSection.draw(this.ctx);
    }
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

    // orden aleatorio
    pixels.sort(() => Math.random() - 0.5);

    let i = 0;
     const step = () => {
      for (let j = 0; j < this.pixelSpeed; j++) {
        if (i >= pixels.length) {
          if (callback) callback();
          return;
        }
        const p = pixels[i++];
        ctx.fillStyle = "black";
        ctx.fillRect(p.x, p.y, this.pixelSize, this.pixelSize);
      }
      requestAnimationFrame(step);
    };
    step();
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

    pixels.sort(() => Math.random() - 0.5); // orden aleatorio

    // Primero cubrir todo de negro
    ctx.fillStyle = "black";
    for (let p of pixels) {
      ctx.fillRect(p.x, p.y, this.pixelSize, this.pixelSize);
    }

    let i = 0;
    const step = () => {
      for (let j = 0; j < this.pixelSpeed; j++) {
        if (i >= pixels.length) {
          canvas.style.display = "none";
          if (callback) callback();
          return;
        }
        const p = pixels[i++];
        ctx.clearRect(p.x, p.y, this.pixelSize, this.pixelSize);
      }
      requestAnimationFrame(step);
    };
    step();
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
        this.ninja.x = this.canvas.width - 50;
      } else {
        this.ninja.x = this.canvas.width / 2 - 25;
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