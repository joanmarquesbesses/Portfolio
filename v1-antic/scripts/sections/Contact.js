export class Contact {
  constructor(game) {
    this.id = "contact";
    this.game = game;
    this.winOnce = false;
  }

  onEnter() {
    console.log("Entrando en Contact");
    if(this.game.collectedCoins >= 3 && !this.winOnce){
      this.winOnce = true;
      this.launchConfetti();
    }
  }

  onExit() {
    console.log("Saliendo de Contact");
  }

  launchConfetti() {
  // Confeti global
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }
}