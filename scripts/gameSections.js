document.addEventListener("DOMContentLoaded", () => {
  const gamesSection = document.getElementById("games");
  if (!gamesSection) {
    console.warn("⚠️ No se encontró la sección #games");
    return;
  }

  // Navegación grid → detalle
  document.querySelectorAll(".game-card").forEach(card => {
    card.addEventListener("click", () => {
      const targetId = card.dataset.target;
      const targetSection = document.getElementById(targetId);

      if (!targetSection) {
        console.warn(`⚠️ No se encontró la sección detalle #${targetId}`);
        return;
      }

      // 🔹 Ocultar grid con fade
      gamesSection.style.transition = "opacity 0.5s ease";
      gamesSection.style.opacity = "0";
      setTimeout(() => {
        gamesSection.classList.add("hidden");
        // 🔹 Mostrar detalle con fade
        targetSection.classList.remove("hidden");
        targetSection.style.transition = "opacity 0.5s ease";
        requestAnimationFrame(() => {
          targetSection.style.opacity = "1";
       });
      }, 500);
    });
  });

  // Volver al grid
  document.querySelectorAll(".back-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const parent = btn.closest(".game-detail");
      if (!parent) return;

      // 🔹 Ocultar detalle con fade
      parent.style.transition = "opacity 0.5s ease";
      parent.style.opacity = "0";

      setTimeout(() => {
        parent.classList.add("hidden");

        // 🔹 Mostrar grid con fade
        gamesSection.classList.remove("hidden");
        gamesSection.style.transition = "opacity 0.5s ease";
        requestAnimationFrame(() => {
          gamesSection.style.opacity = "1";
        });
      }, 500);
    });
  });

  // Carrusel
  document.querySelectorAll(".carousel").forEach(carousel => {
    const track = carousel.querySelector(".carousel-track");
    const items = carousel.querySelectorAll(".carousel-item");
    if (!track || items.length === 0) return;

    let index = 0;
    const update = () => {
      track.style.transform = `translateX(-${index * 100}%)`;
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
