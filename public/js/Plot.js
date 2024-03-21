class Plot {
  constructor(skin, x, y) {
    this.skin = skin;
    this.x = x;
    this.y = y;
    this.hasPlant = false;
    this.plant = null;
  }

  setPlant(plant) {
    this.plant = plant;
    this.hasPlant = true;
    this.skin = this.plant.skin;
  }

  changeSkin(skin) {
    this.skin = skin;
  }

  clear() {
    this.hasPlant = false;
    this.changeSkin(3);
    this.tree = null;
  }
}
