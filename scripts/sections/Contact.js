export class Contact {
  constructor(game) {
    this.id = "contact";
    this.game = game;
  }

  onEnter() {
    console.log("Entrando en Contact");
    if(this.game.collectedCoins >= 3){
      console.log("¡Has desbloqueado el contacto!");
    }
  }

  onExit() {
    console.log("Saliendo de Contact");
  }
}