class Plant {
  constructor() {
    this.age = 0;
    this.harvest = 0;
    this.isAlive = true;
    this.harvestRange = [20, 70];
    this.skin = 5;
  }

  passGrowingSeason() {
    if (this.isAlive) this.age += 0.25;
    if (this.age >= 0.5 && this.age < 1 && this.isAlive) {
      this.skin = 6;
    }
    if (this.age >= 1 && this.isAlive && this.harvest === 0) {
      this.skin = 7;
      this.setHarvest();
      this.isAlive = false;
    }
  }

  setHarvest() {
    this.harvest = Math.floor(
      Math.random() * (this.harvestRange[1] - this.harvestRange[0] + 1),
    ) + this.harvestRange[0];
  }
}
