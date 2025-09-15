import { GameManager } from "./gameManager.js";

const canvas = document.getElementById("gameCanvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");

const game = new GameManager(canvas, ctx);
game.start();

// 🔹 Botones de navegación
document.querySelectorAll("#navbar button").forEach(btn => {
  btn.addEventListener("click", (e) => {
    const target = btn.getAttribute("data-section");
    game.changeSection(target);

    // 🔹 quitar focus del botón
    e.target.blur();

    // 🔹 devolver el foco al canvas para que SPACE funcione en el juego
    document.getElementById("gameCanvas").focus();
  });
});