export class Home {
  constructor() {
    this.id = "home"; // debe coincidir con el id del div en el HTML
  }

  onEnter() {
    console.log("Entrando en Home");
    // Aquí podrías añadir animaciones, textos dinámicos, etc.
  }

  onExit() {
    console.log("Saliendo de Home");
  }
}