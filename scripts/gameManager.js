import { Home } from "./sections/Home.js";
import { Games } from "./sections/Games.js";
import { Contact } from "./sections/Contact.js";
import { Ninja } from "./Ninja.js";
import { ColliderManager } from "./colliderManager.js";

export class GameManager {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
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

  start() {
    requestAnimationFrame(this.loop(0));
  }

  update(deltaTime) {
  this.ninja.update(deltaTime);

  // Detectar bordes y cambiar de sección
  if (this.ninja.x + 40 > this.canvas.width) {
    this.changeSection("games", "right");
  } else if (this.ninja.x < 0) {
    this.changeSection("home", "left");
  }
}

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ninja.draw(this.ctx);
  }

  loop(lastTime = 0) {
    return (timestamp) => {
    const deltaTime = (timestamp - lastTime) / 1000; // en segundos
    lastTime = timestamp;

    this.update(deltaTime);
    this.draw();
    ColliderManager.draw(this.ctx);

    requestAnimationFrame(this.loop(lastTime));
    };
  }

  changeSection(targetId, direction = null) {
  if (this.currentSection.id === targetId) return;

  const overlay = document.getElementById("overlay");
  const transitionTime = 1000; // ms

  // 🔹 1. Fade out (pantalla negra)
  overlay.style.opacity = "1";

  setTimeout(() => {
    // 🔹 2. Cambiar sección
    this.currentSection.onExit();
    this.hideSection(this.currentSection.id);

    this.currentSection = this.sections[targetId];
    this.showSection(this.currentSection.id);
    this.currentSection.onEnter();

    // 🔹 3. Recolocar ninja DURANTE la pantalla negra
    if (direction === "right") {
      this.ninja.x = 10; // reaparece pegado a la izquierda
    } else if (direction === "left") {
      this.ninja.x = this.canvas.width - 50; // reaparece pegado a la derecha
    }

    // 🔹 4. Fade in (volver a ver contenido)
    setTimeout(() => {
      overlay.style.opacity = "0";
    }, 50);
  }, transitionTime);
}

  showSection(id) {
  const section = document.getElementById(id);
  section.classList.remove("hidden");
  requestAnimationFrame(() => { // esperar al siguiente frame
    section.style.opacity = "1";
  });
}

  hideSection(id) {
  const section = document.getElementById(id);
  section.style.opacity = "0";
  setTimeout(() => {
    section.classList.add("hidden");
  }, 1); // mismo tiempo que el transition en CSS
}
}