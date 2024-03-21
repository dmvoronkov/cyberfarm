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

  harvestPlant() {
    const { harvest } = this.plant;
    this.plant.isAlive = false;
    this.plant.skin = 8;
    this.plant.harvest = 0;
    this.changeSkin(this.plant.skin);
    return harvest;
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
