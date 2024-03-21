class Plant {
  constructor() {
    this.age = 0;
    this.harvest = 0;
    this.isAlive = true;
    this.harvestRange = [200, 350];
    this.skin = 4;
  }

  passGrowingSeason() {
    this.age += 1;
    this.setHarvest();
    // if (this.age >= 6 && this.age <= 25) {
    //   this.setHarvest();
    // }
    if (this.age >= 26) {
      this.isAlive = false;
      this.harvest = 0;
    }
    return this.harvest;
  }

  setHarvest() {
    this.harvest = Math.floor(
      Math.random() * (this.harvestRange[1] - this.harvestRange[0] + 1),
    ) + this.harvestRange[0];
  }
}
