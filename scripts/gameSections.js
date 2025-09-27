// scripts/gameSections.js
// Maneja clicks en grid -> detalle y el carrusel.
// Usa window.game (instanciado por main.js) para pedir cambios de sección.

document.addEventListener("DOMContentLoaded", () => {
  const game = window.game;
  if (!game) {
    console.warn("GameManager (window.game) no está disponible — asegúrate de que main.js se carga antes que gameSections.js");
  }

  // Grid -> detalle: delegamos la navegación al GameManager
  document.querySelectorAll(".game-card").forEach(card => {
    card.addEventListener("click", () => {
      const targetId = card.dataset.target;
      if (!targetId) return;
      // si el juego está activo usamos pixel fade (instant=false),
      // si no, evitamos pixel y usamos fade css (instant = true)
      game.changeSection(targetId, "right", !game.isRunning);
    });
  });

  // Botones "volver" de detalles
  document.querySelectorAll(".back-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();

      // Detectar si estamos en un game-detail o en un engine-detail
      const parentSection = btn.closest("section");
      let returnTo = "games";
      if (parentSection && parentSection.id.includes("engine")) {
        returnTo = "engines";
      }

      game.changeSection(returnTo, "left", !game.isRunning);
    });
  });

  // Carruseles
  document.querySelectorAll(".carousel").forEach(carousel => {
    const track = carousel.querySelector(".carousel-track");
    const items = carousel.querySelectorAll(".carousel-item");
    if (!track || items.length === 0) return;

    let index = 0;
    const update = () => {
      track.style.transform = `translateX(-${index * 100}%)`;
      // si el iframe tiene youtube, pausamos el vídeo al cambiar
      items.forEach((item, i) => {
        if (i !== index) {
          const iframe = item.querySelector("iframe");
          if (iframe && iframe.src.includes("youtube.com")) {
            pauseYoutube(iframe);
          }
        }
      });
    };

    carousel.querySelector(".next")?.addEventListener("click", () => {
      index = (index + 1) % items.length;
      update();
    });

    carousel.querySelector(".prev")?.addEventListener("click", () => {
      index = (index - 1 + items.length) % items.length;
      update();
    });
    
  });
});

function pauseYoutube(iframe) {
  iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
}
