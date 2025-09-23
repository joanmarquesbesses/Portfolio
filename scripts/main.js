// scripts/main.js
import { GameManager } from "./gameManager.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const game = new GameManager(canvas, ctx);

// expongo la instancia globalmente para gameSections (tu HTML carga main antes de gameSections)
window.game = game;

// Botón toggle
const toggleBtn = document.getElementById("toggleGame");

// -> mostrar/ocultar el botón según tamaño de ventana
function checkWindowSize() {
  if (window.innerWidth >= 1280 && window.innerHeight >= 720) {
    toggleBtn.classList.remove("hidden");
  } else {
    toggleBtn.classList.add("hidden");
    // si el juego está activo y ahora la ventana es pequeña, cerramos
    if (game.isRunning) {
      game.stopGame();
      toggleBtn.textContent = "🎮 Activar Juego";
    }
  }
}
window.addEventListener("resize", checkWindowSize);
checkWindowSize();

// toggle
toggleBtn.addEventListener("click", () => {
  toggleBtn.blur();
  game.toggleGame((isRunning) => {
    toggleBtn.textContent = isRunning ? "❌ Desactivar Juego" : "🎮 Activar Juego";
    if (isRunning) {
      document.body.classList.add("game-active");
      document.body.classList.remove("html-mode");
    } else {
      document.body.classList.remove("game-active");
      document.body.classList.add("html-mode");
    }
  });
});

// navigation bar buttons (home / games / contact)
document.querySelectorAll("#navbar button").forEach(btn => {
  btn.addEventListener("click", (e) => {
    const target = btn.getAttribute("data-section");
    // si no existe la sección en DOM ignora
    if (!document.getElementById(target)) return;

    // si el juego está corriendo, dejamos que GameManager haga pixelFade
    // en html-mode usamos fade normal -> pasamos instant = !game.isRunning
    game.changeSection(target, null, !game.isRunning);

    e.target.blur();
    if (game.isRunning) canvas.focus();
  });
});

// por defecto, dejamos el body en modo html (permitir scroll si hace falta)
document.body.classList.add("html-mode");

const mainCard = document.querySelector('.main-card');
const sideCards = document.querySelectorAll('.side-card');

mainCard.addEventListener('mouseenter', () => {
  sideCards.forEach(c => c.classList.add('visible'));
});
mainCard.addEventListener('mouseleave', () => {
  sideCards.forEach(c => c.classList.remove('visible'));
});

// Carrusel
document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector('.games-carousel .carousel-track');
  const items = document.querySelectorAll('.games-carousel .carousel-item');
  const prevBtn = document.querySelector('.games-carousel .prev');
  const nextBtn = document.querySelector('.games-carousel .next');

  let currentIndex = 0;

  function updateCarousel() {
    const offset = -(currentIndex * 100);
    track.style.transform = `translateX(${offset}%)`;
  }

  nextBtn.addEventListener('click', () => {
    currentIndex++;
    if (currentIndex >= items.length) {
      currentIndex = 0; // vuelve al inicio
    }
    updateCarousel();
  });

  prevBtn.addEventListener('click', () => {
    currentIndex--;
    if (currentIndex < 0) {
      currentIndex = items.length - 1; // vuelve al final
    }
    updateCarousel();
  });
});
