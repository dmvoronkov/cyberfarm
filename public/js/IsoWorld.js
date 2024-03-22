class IsoWorld {
  constructor() {
    this.isPlaying = false;
    this.saveId = null;

    this.viewportWidth = 960;
    this.viewportHeight = 480;

    this.numRows = 9;
    this.numCols = 9;

    this.requiredHarvest = 500;
    this.harvest = 0;
    this.energy = 1000;
    this.year = 1;
    this.plots = [];

    this.canvas = null;
	  this.context = null;
    this.tileSheetImg = null;
    this.tileMap = null;

    this.mapOffsetX = 150;
    this.mapOffsetY = 150;

    this.mouseDown = false;
    this.mouseScreenX = 0;
    this.mouseScreenY = 0;
    this.mouseTileX = 0;
    this.mouseTileY = 0;

    // this.tileSheetWidth = 390;
	  // this.tileSheetHeight = 500;

    // The range of tiles to render based on visibility.
    // Will be updated as map is dragged around.
    this.renderStartX = 0;
    this.renderStartY = 0;
    this.renderFinishX = 0;
    this.renderFinishY = 0;

    // How many tile sprites are on each row of the sprite sheet?
    this.spriteColumns = 5;

    // How much spacing/padding is around each tile sprite.
    this.spritePadding = 2;

    // The full dimensions of the tile sprite.
	  this.blockWidth = 74;
	  this.blockHeight = 70;

    // The "top only" dimensions of the tile sprite.
	  this.tileWidth = 74;
	  this.tileHeight = 44;

    // How much the tiles should overlap when drawn.
	  this.overlapWidth = 2;
	  this.overlapHeight = 2;

	  this.projectedTileWidth = this.tileWidth - this.overlapWidth - this.overlapHeight;
	  this.projectedTileHeight = this.tileHeight - this.overlapWidth - this.overlapHeight;
  }

  async init(canvasId, tileSheetURI, saveObject) {
    const requiredHarvestSpan = document.querySelector('#required-harvest');
    requiredHarvestSpan.innerText = this.requiredHarvest;

    this.canvas = document.getElementById(canvasId);

    if (this.canvas == null) {
		  console.error(`Could not find canvas with id: ${canvasId}`);
		  return;
	  }

    this.canvas.width = this.viewportWidth;
    this.canvas.height = this.viewportHeight;

    this.context = this.canvas.getContext('2d');

    this.clearViewport('#1A1B1F');
    this.showLoadingPlaceholder();

    this.tileSheetImg = await this.loadImage(tileSheetURI);

    this.buildMap();

    this.canvas.onmouseclick = (e) => { e.stopPropagation(); e.preventDefault(); return false; };
	  this.canvas.oncontextmenu = (e) => { e.stopPropagation(); e.preventDefault(); return false; };
	  this.canvas.onmouseup = (e) => { this.mouseDown = false; return false; };
	  this.canvas.onmousedown = (e) => { this.onMouseDown(e); this.mouseDown = true; return false; };
    this.canvas.onmousemove = (e) => { this.onMouseMove(e); };

    if (saveObject) {
      this.loadSaved(saveObject);
    } else {
      try {
        const response = await fetch('/api/save/init', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const result = await response.json();
        this.saveId = result.saveId;
      } catch (error) {
        console.log(error);
      }
    }

    this.updateMapOffset(300, -100);
    this.isPlaying = true;
    this.mainLoop();
    this.startSeasons();
  }

  startSeasons() {
    setTimeout(() => {
      this.passGrowingSeason();
    }, 5000);
  }

  passGrowingSeason() {
    setInterval(() => {
      this.plots.filter((plot) => plot.hasPlant).forEach((plot) => {
        plot.plant.passGrowingSeason();
        plot.changeSkin(plot.plant.skin);
      });
      this.year += 0.25;
    }, 5000);
  }

  clearViewport(color) {
    this.context.fillStyle = color;
	  this.context.fillRect(0, 0, this.viewportWidth, this.viewportHeight);
  }

  printStats() {
    const harvestedSpan = document.querySelector('#harvested');
    harvestedSpan.innerText = this.harvest;
    const energySpan = document.querySelector('#energy');
    energySpan.innerText = this.energy;
  }

  async save() {
    const data = {
      saveId: this.saveId,
      harvested: this.harvest,
      required_harvest: this.requiredHarvest,
      energy: this.energy,
      tilemap: JSON.stringify(this.tileMap),
    };
    try {
      const response = await fetch('/api/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
    } catch (error) {
      console.log(error);
    }
  }

  loadSaved(saveObject) {
    const {
      id, harvested, required_harvest, energy, tilemap,
    } = saveObject;
    this.saveId = Number(id);
    this.harvest = Number(harvested);
    this.requiredHarvest = Number(required_harvest);
    this.energy = Number(energy);
    const newTileMap = JSON.parse(tilemap);

    for (let x = 0; x < this.numRows; x++) {
      for (let y = 0; y < this.numCols; y++) {
        this.tileMap[x][y].skin = newTileMap[x][y].skin;
        this.tileMap[x][y].hasPlant = newTileMap[x][y].hasPlant;
        if (newTileMap[x][y].hasPlant) {
          this.tileMap[x][y].setPlant(new Plant());
          this.tileMap[x][y].plant.age = newTileMap[x][y].plant.age;
          this.tileMap[x][y].plant.harvest = newTileMap[x][y].plant.harvest;
          this.tileMap[x][y].plant.isAlive = newTileMap[x][y].plant.isAlive;
          this.tileMap[x][y].plant.harvestRange = newTileMap[x][y].plant.harvestRange;
          this.tileMap[x][y].plant.skin = newTileMap[x][y].plant.skin;
        }
      }
    }
    this.plots = this.tileMap.flat();
  }

  stop() {
    this.isPlaying = false;
  }

  win() {
    this.isPlaying = false;

    this.context.font = '30px Courier New';
    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';
    this.context.fillStyle = '#37d7ff';

    const textX = this.viewportWidth / 2;
    const textY = this.viewportHeight / 2;

    this.context.fillText('Вы спасли человечество!', textX, textY);
  }

  lose() {
    this.isPlaying = false;

    this.context.font = 'bold 36px Courier New';
    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';
    this.context.fillStyle = '#37d7ff';

    const textX = this.viewportWidth / 2;
    const textY = this.viewportHeight / 2;

    this.context.fillText('Закончилась энергия. Вы проиграли.', textX, textY);
  }

  showLoadingPlaceholder() {
    this.context.font = '14px Tahoma';
    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';
    this.context.fillStyle = '#EEEEEE';

    const textX = this.viewportWidth / 2;
    const textY = this.viewportHeight / 2;

    this.context.fillText('ЗАГРУЗКА...', textX, textY);
  }

  async loadImage(uri) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = uri;
    });
  }

  buildMap() {
    const map = new Array(this.numRows).fill(new Array(this.numCols).fill(''));
    for (let x = 0; x < map.length; x++) {
      map[x] = map[x].map((el, y) => new Plot(Math.ceil(Math.random() * 2), x, y));
    }
    this.tileMap = map;
    this.plots = map.flat();
  }

  mainLoop() {
    if (this.isPlaying) {
      if (this.energy < 0) this.energy = 0;
      this.printStats();
      this.clearViewport('#1A1B1F');
      if (this.harvest >= this.requiredHarvest) {
        this.win();
      } else if (this.energy <= 0) {
        this.lose();
      } else {
        this.draw();
        window.requestAnimationFrame(() => { this.mainLoop(); });
      }
    }
  }

  limit(value, min, max) { return Math.max(min, Math.min(value, max)); }

  convertScreenToTile(screenX, screenY) {
    const mappedX = (screenX / this.projectedTileWidth);
    const mappedY = (screenY / this.projectedTileHeight);

    const maxTileX = this.tileMap.length - 1;
    const maxTileY = (Array.isArray(this.tileMap) && this.tileMap.length > 0) ? this.tileMap[0].length - 1 : 0;

    const tileX = this.limit((Math.round(mappedX + mappedY) - 1), 0, maxTileX);
    const tileY = this.limit(Math.round(-mappedX + mappedY), 0, maxTileY);

    return { x: tileX, y: tileY };
  }

  convertTileToScreen(tileX, tileY) {
    const self = this;

    const isoX = tileX - tileY;
    const isoY = tileX + tileY;

    const screenX = this.mapOffsetX + (isoX * ((this.tileWidth / 2) - this.overlapWidth));
    const screenY = this.mapOffsetY + (isoY * ((this.tileHeight / 2) - this.overlapHeight));

    return { x: screenX, y: screenY };
  }

  updateMapOffset(deltaX, deltaY) {
    this.mapOffsetX += deltaX;
    this.mapOffsetY += deltaY;

    const firstVisbleTile = this.convertScreenToTile(-this.mapOffsetX, -this.mapOffsetY);

    const firstVisibleTileX = firstVisbleTile.x;
    const firstVisibleTileY = firstVisbleTile.y;

    const viewportRows = Math.ceil(this.viewportWidth / this.projectedTileWidth);
    const viewportCols = Math.ceil(this.viewportHeight / this.projectedTileHeight);

    const maxVisibleTiles = viewportRows + viewportCols;
    const halfVisibleTiles = Math.ceil(maxVisibleTiles / 2);

    this.renderStartX = Math.max((firstVisibleTileX), 0);
    this.renderStartY = Math.max((firstVisibleTileY - halfVisibleTiles + 1), 0);

    this.renderFinishX = Math.min((firstVisibleTileX + maxVisibleTiles), (this.tileMap.length - 1));
    this.renderFinishY = Math.min((firstVisibleTileY + halfVisibleTiles + 1), (this.tileMap[0].length - 1));
  }

  draw() {
    for (let x = this.renderStartX; x <= this.renderFinishX; x++) {
      for (let y = this.renderStartY; y <= this.renderFinishY; y++) {
        const drawTile = this.tileMap[x][y].skin;

        const spriteWidth = this.blockWidth + (2 * this.spritePadding);
        const spriteHeight = this.blockHeight + (2 * this.spritePadding);

        const srcX = ((drawTile % this.spriteColumns) * spriteWidth) + this.spritePadding;
        const srcY = (Math.floor(drawTile / this.spriteColumns) * spriteHeight) + this.spritePadding;

        const destPos = this.convertTileToScreen(x, y);
        const destX = destPos.x;
        const destY = destPos.y;
        const destWidth = this.blockWidth;
        const destHeight = this.blockHeight;

        this.context.drawImage(this.tileSheetImg, srcX, srcY, this.blockWidth, this.blockHeight, destX, destY, destWidth, destHeight);
      }
    }

    this.drawCursor();
  }

  drawCursor() {
    const screenPos = this.convertTileToScreen(this.mouseTileX, this.mouseTileY);
    const screenX = screenPos.x;
    const screenY = screenPos.y;

    // to save images, the mouse cursor is just a tile sprite
    const drawTile = 0;

    const spriteWidth = this.blockWidth + (2 * this.spritePadding);
    const spriteHeight = this.blockHeight + (2 * this.spritePadding);

    const srcX = ((drawTile % this.spriteColumns) * spriteWidth) + this.spritePadding;
    const srcY = (Math.floor(drawTile / this.spriteColumns) * spriteHeight) + this.spritePadding;

    this.context.drawImage(this.tileSheetImg, srcX, srcY, this.blockWidth, this.blockHeight, screenX, screenY, this.blockWidth, this.blockHeight);

    // output the tile location of the mouse
    this.context.font = 'bold 11px Tahoma';
    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';
    this.context.fillStyle = '#fd905d';

    const textX = screenX + (this.projectedTileWidth / 2);
    const textY = screenY + (this.projectedTileHeight / 2);

    const text = `(${this.mouseTileX}, ${this.mouseTileY})`;

    // this.context.fillText(text, textX, textY);
  }

  onMouseMove(e) {
    if (!Array.isArray(this.tileMap) || this.tileMap.length < 1 || this.tileMap[0].length < 1) return;

    const rect = this.canvas.getBoundingClientRect();

    const newX = (e.clientX - rect.left);
    const newY = (e.clientY - rect.top);

    const mouseDeltaX = newX - this.mouseScreenX;
    const mouseDeltaY = newY - this.mouseScreenY;

    this.mouseScreenX = newX;
    this.mouseScreenY = newY;

    const mouseTilePos = this.convertScreenToTile((this.mouseScreenX - this.mapOffsetX), (this.mouseScreenY - this.mapOffsetY));

    this.mouseTileX = mouseTilePos.x;
    this.mouseTileY = mouseTilePos.y;

    // if (this.mouseDown) this.updateMapOffset(mouseDeltaX, mouseDeltaY);
  }

  onMouseDown(e) {
    const plot = this.plots.find((plot) => plot.x === this.mouseTileX && plot.y === this.mouseTileY);
    if (plot.skin === 2) {
      plot.skin = 3;
      this.energy -= Math.floor(Math.random() * 70);
    } else if (plot.skin === 3) {
      plot.setPlant(new Plant());
      this.energy -= Math.floor(Math.random() * 20);
    } else if (plot.skin === 7) {
      const plotHarvest = plot.harvestPlant();
      this.harvest += plotHarvest;
      this.energy -= Math.floor(Math.random() * 20);
    } else if (plot.skin === 8) {
      plot.clear();
      this.energy -= Math.floor(Math.random() * 70);
    }
  }
}
