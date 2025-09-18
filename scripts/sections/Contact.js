export class Contact {
  constructor(game) {
    this.id = "contact";
    this.game = game;
  }

  onEnter() {
    console.log("Entrando en Contact");
  }

  onExit() {
    console.log("Saliendo de Contact");
  }
}