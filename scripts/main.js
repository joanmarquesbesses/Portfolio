import { GameManager } from "./gameManager.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const game = new GameManager(canvas, ctx);

// 🔹 Botón toggle
const toggleBtn = document.getElementById("toggleGame");

function checkWindowSize() {
  if (window.innerWidth >= 1280 && window.innerHeight >= 720) {
    toggleBtn.classList.remove("hidden");
  } else {
    toggleBtn.classList.add("hidden");
    if (game.isRunning) {
      game.stopGame();
      toggleBtn.textContent = "🎮 Activar Juego";
    }
  }
}
window.addEventListener("resize", checkWindowSize);
checkWindowSize();

toggleBtn.addEventListener("click", () => {
  toggleBtn.blur();
  game.toggleGame((isRunning) => {
    toggleBtn.textContent = isRunning ? "❌ Desactivar Juego" : "🎮 Activar Juego";

    // 🔹 Aquí sí tenemos el valor correcto
    if (isRunning) {
      document.body.classList.add("game-active");
      document.body.classList.remove("html-mode");
    } else {
      document.body.classList.remove("game-active");
      document.body.classList.add("html-mode");
    }
  });
});

// 🔹 Botones de navegación
document.querySelectorAll("#navbar button").forEach(btn => {
  btn.addEventListener("click", (e) => {
    const target = btn.getAttribute("data-section");

    game.changeSection(target, null, !game.isRunning);

    e.target.blur();
    if (game.isRunning) canvas.focus();
  });
});