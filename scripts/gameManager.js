// scripts/gameManager.js
import { Home } from "./sections/Home.js";
import { Games } from "./sections/Games.js";
import { Engines } from "./sections/Engines.js";
import { Contact } from "./sections/Contact.js";
import { Ninja } from "./ninja.js";
import { ColliderManager } from "./colliderManager.js";

export class GameManager {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;

    this.isRunning = false;
    this.isTransitioning = false;

    this.lastTime = 0;

    this.LOGICAL_WIDTH = 1920;
    this.LOGICAL_HEIGHT = 1080;

    // tamaño lógico
    this.canvas.width = this.LOGICAL_WIDTH;
    this.canvas.height = this.LOGICAL_HEIGHT;
    this.ctx.imageSmoothingEnabled = false;

    // secciones "core" (las detail se gestionan por ID en el DOM)
    this.sections = {
      home: new Home(this),
      games: new Games(this),
      engines: new Engines(this),
      contact: new Contact(this),
      // no registres aquí las secciones detalle si no quieres; el manager trabaja por ID
    };

    // sección activa (guardamos sólo el id)
    this.currentSectionId = "home";

    this.pixelSize = 20;
    this.pixelDuration = 620; // ms

    this.ninja = new Ninja(canvas);

    // inicial
    this.resizeCanvas();
    this.canvas.style.display = "none"; // por defecto oculto
    window.addEventListener("resize", () => this.resizeCanvas());

    // mostramos la sección inicial (sin fade porque aún no interactuamos)
    this.showSection(this.currentSectionId, true);
    this.sections[this.currentSectionId]?.onEnter?.();
  }

  resizeCanvas() {
    const canvas = this.canvas;
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

    // mantenemos el tamaño lógico interno (canvas.width/height) y escalamos via CSS
    canvas.width = this.LOGICAL_WIDTH;
    canvas.height = this.LOGICAL_HEIGHT;

    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    canvas.style.left = "50%";
    canvas.style.top = "50%";
    canvas.style.transform = "translate(-50%, -50%)";

    // side-walls
    const leftWall = document.querySelector(".side-wall.left");
    const rightWall = document.querySelector(".side-wall.right");
    const sideWidth = Math.max(0, (window.innerWidth - width) / 2);
    if (leftWall) leftWall.style.width = sideWidth + "px";
    if (rightWall) rightWall.style.width = sideWidth + "px";
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = 0;
    requestAnimationFrame(this.loop.bind(this));
  }

  stop() {
    this.isRunning = false;
  }

  update(deltaTime) {
    // update game objects
    this.ninja.update(deltaTime);

    // navegación automática (ejemplo)
    if (!this.isTransitioning) {
      if (this.ninja.x + this.ninja.width >= this.LOGICAL_WIDTH) {
        this.changeSection("games", "right");
      } else if (this.ninja.x <= 0) {
        this.changeSection("home", "left");
      }
    }

    // Llamar update de la sección si existe
    const sectionObj = this.sections[this.currentSectionId];
    if (sectionObj?.update) sectionObj.update(deltaTime);
  }

  draw() {
    this.ctx.clearRect(0, 0, this.LOGICAL_WIDTH, this.LOGICAL_HEIGHT);
    const sectionObj = this.sections[this.currentSectionId];
    if (sectionObj?.draw) sectionObj.draw(this.ctx);
    this.ninja.draw(this.ctx);
    ColliderManager.draw?.(this.ctx);
  }

  loop(timestamp = 0) {
    if (!this.isRunning) return;
    const deltaTime = Math.min((timestamp - this.lastTime) / 1000, 0.05);
    this.lastTime = timestamp;

    this.update(deltaTime);
    this.draw();

    requestAnimationFrame(this.loop.bind(this));
  }

  /* ----------------------
     Pixel overlay transitions
     ---------------------- */
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
    const duration = this.pixelDuration;
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

    // cubrir todo primero
    ctx.fillStyle = "black";
    for (let p of pixels) ctx.fillRect(p.x, p.y, this.pixelSize, this.pixelSize);

    let i = 0;
    const total = pixels.length;
    const duration = this.pixelDuration;
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

  /* ----------------------
     Mostrar / ocultar secciones
     ---------------------- */
  showSection(id, immediate = false) {
    const section = document.getElementById(id);
    if (!section) return;

    // quitar hidden antes de tratar la opacidad
    section.classList.remove("hidden");

    // Si immediate o estamos en modo juego (ya hay pixel overlay), mostrar sin transición CSS
    if (immediate || this.isRunning) {
      section.style.transition = "none";
      section.style.opacity = "1";
    } else {
      section.style.transition = "opacity 0.5s ease";
      // arrancamos desde 0 para animar a 1
      section.style.opacity = "0";
      requestAnimationFrame(() => {
        section.style.opacity = "1";
      });
    }
  }

  hideSection(id, immediate = false) {
    const section = document.getElementById(id);
    if (!section) return;

    if (immediate || this.isRunning) {
      // ocultado inmediato (sin animación CSS)
      section.style.transition = "none";
      section.style.opacity = "0";
      section.classList.add("hidden");
    } else {
      // fade CSS
      section.style.transition = "opacity 0.5s ease";
      section.style.opacity = "0";
      setTimeout(() => {
        section.classList.add("hidden");
      }, 500);
    }
  }

  /* ----------------------
     Cambio de sección centralizado
     targetId: id del <section>
     direction: opcional, para reposicionar ninja (solo si el juego está corriendo)
     instant: si true fuerza cambio inmediato (sin fades)
     ---------------------- */
  changeSection(targetId, direction = null, instant = false) {
    if (this.currentSectionId === targetId) return;

    const prevId = this.currentSectionId;

    const repositionNinjaIfNeeded = () => {
      if (!direction || !this.isRunning) return;
      if (direction === "right") {
        this.ninja.x = 10;
      } else if (direction === "left") {
        this.ninja.x = this.LOGICAL_WIDTH - this.ninja.width - 10;
      } else {
        this.ninja.x = this.LOGICAL_WIDTH / 2 - this.ninja.width / 2;
      }
      this.ninja.collider.x = this.ninja.x;
    };

    const doSwap = () => {
      const prevSection = document.getElementById(prevId);
      this.pauseAllYoutube(prevSection);

      this.sections[prevId]?.onExit?.();
      this.hideSection(prevId, true);

      // 🔹 Solo reseteamos detalles si vamos a games
      if (targetId === "games") {
        this.resetGamesDetail();
      }

      this.currentSectionId = targetId;
      this.showSection(targetId, true);
      this.sections[targetId]?.onEnter?.();

      repositionNinjaIfNeeded();
    };

    if (instant) {
      doSwap();
      return;
    }

    if (this.isRunning) {
      this.isTransitioning = true;
      this.pixelFadeIn(() => {
        doSwap();
        this.pixelFadeOut(() => {
          this.isTransitioning = false;
        });
      });
    } else {
      this.sections[prevId]?.onExit?.();
      this.hideSection(prevId, false);

      setTimeout(() => {
        if (targetId === "games") this.resetGamesDetail();
        this.currentSectionId = targetId;
        this.showSection(targetId, false);
        this.sections[targetId]?.onEnter?.();
      }, 500);
    }
  }

  /* ----------------------
     Start / stop juego y toggle
     ---------------------- */
  startGame() {
    this.resizeCanvas();
    document.body.style.overflow = "hidden";
    document.querySelectorAll(".side-wall").forEach(w => w.style.display = "block");
    this.canvas.style.display = "block";
    this.pixelFadeOut(); // dejamos la pantalla limpia
    this.start();
  }

  stopGame() {
    this.pixelFadeIn(() => {
      this.stop();
      this.canvas.style.display = "none";
      document.querySelectorAll(".side-wall").forEach(w => w.style.display = "none");
      this.pixelFadeOut();
      document.body.style.overflow = "auto";
    });
  }

  toggleGame(onToggled) {
    if (this.isRunning) {
      // DESACTIVAR juego
      this.pixelFadeIn(() => {
        this.stop();
        this.canvas.style.display = "none";
        document.querySelectorAll(".side-wall").forEach(w => w.style.display = "none");
        this.pixelFadeOut(() => {
          if (onToggled) onToggled(false);
        });
      });
    } else {
      // ACTIVAR juego
      this.pixelFadeIn(() => {
        this.canvas.style.display = "block";
        document.querySelectorAll(".side-wall").forEach(w => w.style.display = "block");
        this.start();
        this.pixelFadeOut(() => {
          if (onToggled) onToggled(true);
        });
      });
    }
  }

  /* ----------------------
     Helpers
     ---------------------- */
  resetGamesDetail() {
    // 🔹 Solo cerrar detalles, NO tocar el grid
    document.querySelectorAll(".game-detail").forEach(sec => {
      sec.classList.add("hidden");
      sec.style.opacity = "0";
    });
  }

  pauseYoutube(iframe) {
    try {
      iframe.contentWindow.postMessage(
        '{"event":"command","func":"pauseVideo","args":""}', '*'
      );
    } catch (e) {
      console.warn("No se pudo pausar YouTube", e);
    }
  }

  pauseAllYoutube(section) {
    if (!section) return;
    section.querySelectorAll("iframe").forEach(iframe => {
      if (iframe.src.includes("youtube.com/embed")) {
        this.pauseYoutube(iframe);
      }
    });
  }
}
