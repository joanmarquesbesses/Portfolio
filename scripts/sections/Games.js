export class Games {
  constructor(game) {
    this.id = "games";
    this.game = game;
  }

  onEnter() {
    console.log("Entrando en Games");
  }

  onExit() {
    console.log("Saliendo de Games");
  }
}