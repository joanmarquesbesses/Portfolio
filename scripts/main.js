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
