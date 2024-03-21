class IsometricGrid {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');

    this.startPosX = 0; // Used for rendering from the middle of the canvas
    this.startPosY = 0; // Used for rendering from the middle of the canvas
    this.mouse = {};
    this.tiles = [];

    this.axis = {
      x: {
        x: 1,
        y: 0.5,
      },
      y: {
        x: -1,
        y: 0.5,
      },
    };

    // Overwrite defaults
    Object.assign(this, {
      tileWidth: 100,
      get tileHeight() {
        return this.tileWidth * 0.5;
      },
      numCols: 9,
      numRows: 9,
      drawCoords: true,
      drawCoordsLabels: true,
      screenCoordsEl: document.querySelector('#screenCoords'),
      gridCoordsEl: document.querySelector('#gridCoords'),
      drawMarkedCenter: true,
      drawOverlay: false,
      highlightOnHover: true,
    }, options);
  }

  setup() {
    // this.canvas.width = Math.floor(document.body.clientWidth);
    // this.canvas.height = Math.floor(document.body.clientHeight);
    this.createTiles();
    this.update();
  }

  update() {
    this.renderGrid();
    this.drawCoordsLabels && this.addCoordsLabelsListener();
    this.drawMarkedCenter && this.renderCenter();
    this.drawOverlay && this.renderOverlay();
    this.highlightOnHover && this.addHighLightOnHoverListener();
  }

  addCoordsLabelsListener() {
    this.screenCoordsEl.innerText = '0, 0';
    this.gridCoordsEl.innerText = '0, 0';
    this.canvas.addEventListener('mousemove', (evt) => this.updateCoordsLabels(evt));
  }

  addHighLightOnHoverListener(evt) {
    if (!this.mousePosEventListener) this.addMousePosEventListener(evt);

    this.canvas.addEventListener('mousedown', (evt) => {
      const { x, y } = this.screenToGridCoordinate(this.mouse);
      const withinRange = x >= 0
        && x < this.numCols
        && y >= 0
        && y < this.numRows;

      if (withinRange) {
        const tile = this.tiles.find((el) => el.x === x && el.y === y);
        tile.tree = 'spruce';
        tile.style.fillColor = '#505541';
        tile.tree = this.renderGrid();
        this.renderTile(tile);
      }
    });
  }

  addMousePosEventListener(evt) {
    if (this.mousePosEventListener) return;

    this.mousePosEventListener = true;
    this.canvas.addEventListener('mousemove', (evt) => {
      const rect = this.canvas.getBoundingClientRect();

      this.mouse.x = Math.floor(evt.clientX - rect.left);
      this.mouse.y = Math.floor(evt.clientY - rect.top);
    });
  }

  gridToScreenCoordinate(tile) {
    const w = this.tileWidth;
    const h = this.tileHeight;

    // Render from the middle of the screen
    const offset = {
      x: this.canvas.width / 2,
      y: (this.canvas.height / 2) - h * this.numCols / 2,
    };

    const screenCoordinates = {
      x: (tile.x * this.axis.x.x * 0.5 * w) + (tile.y * this.axis.y.x * 0.5 * w) + offset.x,
      y: (tile.x * this.axis.x.y * 1 * h) + (tile.y * this.axis.y.y * 1 * h) + offset.y,
    };

    const vectors = {
      top: {
        x: screenCoordinates.x,
        y: screenCoordinates.y,
      },
      right: {
        x: screenCoordinates.x + w / 2,
        y: screenCoordinates.y + h / 2,
      },
      bottom: {
        x: screenCoordinates.x,
        y: screenCoordinates.y + h,
      },
      left: {
        x: screenCoordinates.x - w / 2,
        y: screenCoordinates.y + h / 2,
      },
    };

    return {
      ...screenCoordinates,
      vectors,
    };
  }

  screenToGridCoordinate(screen) {
    const a = this.axis.x.x * 0.5 * this.tileWidth;
    const b = this.axis.y.x * 0.5 * this.tileWidth;
    const c = this.axis.x.y * 1 * this.tileHeight;
    const d = this.axis.y.y * 1 * this.tileHeight;
    const inv = this.invertMatrix(a, b, c, d);

    const offset = {
      x: this.numCols / 2,
      y: this.numRows / 2,
    };

    return {
      x: Math.floor(
        (screen.x - this.canvas.width / 2) * inv.a
        + (screen.y - this.canvas.height / 2) * inv.b
        + offset.x,
      ),
      y: Math.floor(
        (screen.x - this.canvas.width / 2) * inv.c
        + (screen.y - this.canvas.height / 2) * inv.d
        + offset.y,
      ),
    };
  }

  invertMatrix(a, b, c, d) {
    // Determinant
    const det = (1 / (a * d - b * c));

    return {
      a: det * d,
      b: det * -b,
      c: det * -c,
      d: det * a,
    };
  }

  createTiles() {
    for (let x = 0; x < this.numCols; x++) {
      for (let y = 0; y < this.numRows; y++) {
        const tile = new Tile(x, y);
        this.tiles.push(tile);
      }
    }
  }

  renderGrid() {
    const {
      canvas, tileHeight, numCols, numRows,
    } = this;
    this.tilesRendered = 0;
    this.startPosX = (canvas.width / 2);
    this.startPosY = (canvas.height / 2) - (tileHeight * numRows / 2);

    this.tiles.forEach((el) => this.renderTile(el));

    // console.log(
    //   'Done! Tiles rendered:',
    //   this.tilesRendered,
    //   'of',
    //   numCols * numRows,
    //   '\nTiles outside of the canvas:',
    //   (numCols * numRows) - this.tilesRendered,
    // );
  }

  renderTile(tile) {
    const { x, y, style } = tile;
    const { ctx, tileWidth } = this;
    const { vectors } = this.gridToScreenCoordinate({ x, y });
    const fillColor = style.fillColor || '#968f5b';
    const strokeColor = style.strokeColor || '#1a162d';
    const textColor = style.textColor || '#ffffff';

    // Don't draw tiles outside of the canvas.
    if (!this.isVisible(vectors)) return;

    // Draw tile
    ctx.beginPath();
    ctx.moveTo(vectors.top.x, vectors.top.y);
    ctx.lineTo(vectors.right.x, vectors.right.y);
    ctx.lineTo(vectors.bottom.x, vectors.bottom.y);
    ctx.lineTo(vectors.left.x, vectors.left.y);
    ctx.closePath();

    // Add styling to tile
    ctx.fillStyle = fillColor;
    ctx.fill();
    ctx.lineWidth = 0.15; // stroke width is 1px by default
    ctx.strokeStyle = strokeColor;
    ctx.stroke();

    if (tile.tree) {
      console.log(tile);
      const treeImage = document.createElement('img');
      treeImage.src = '/images/tree.png';
      console.log(treeImage);
      ctx.drawImage(treeImage, vectors.bottom.x, vectors.bottom.y);
    }

    // Draw coords
    if (this.drawCoords) {
      const tileCoords = `[${x},${y}]`;
      ctx.font = '12px Courier';
      ctx.textAlign = 'center';
      ctx.fillStyle = textColor;
      ctx.fillText(tileCoords, (vectors.left.x + tileWidth / 2), (vectors.left.y + 3));
    }

    // Log
    this.tilesRendered++;
  }

  renderCenter() {
    const centerX = Math.floor(this.numCols / 2);
    const centerY = Math.floor(this.numRows / 2);

    this.renderTile(centerX, centerY, {
      fillColor: 'red',
      strokeColor: 'red',
      textColor: 'white',
    });
  }

  renderOverlay() {
    const {
      canvas, ctx, tileWidth, tileHeight,
    } = this;
    const lineWidth = 1;
    const xStart = (canvas.width / 2) * -1;
    const yStart = (canvas.height / 2) * -1;

    ctx.fillStyle = 'rgba(0, 0, 0, .05)';

    // Draw column lines, starting from the middle going out
    for (let x = (canvas.width / 2); x <= canvas.width; x += tileWidth / 2) {
      ctx.fillRect(x, 0, lineWidth, canvas.height);
    }

    for (let x = (canvas.width / 2); x >= 0; x -= tileWidth / 2) {
      ctx.fillRect(x, 0, lineWidth, canvas.height);
    }

    // Draw row lines, starting from the middle going out
    for (let y = (canvas.height / 2); y <= canvas.height; y += tileHeight / 2) {
      ctx.fillRect(0, y, canvas.width, lineWidth);
    }

    for (let y = (canvas.height / 2); y >= 0; y -= tileHeight / 2) {
      ctx.fillRect(0, y, canvas.width, lineWidth);
    }

    // Exact middle of the canvas
    ctx.fillRect(canvas.width / 2, 0, 1, canvas.height);
    ctx.fillRect(0, canvas.height / 2, canvas.width, 1);
  }

  getVectorValues(obj) {
    // By creating a unique set, we remove duplicate values
    const xValues = new Set();
    const yValues = new Set();

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) { // No need to check if `x` or `y` properties exist
        xValues.add(obj[key].x);
        yValues.add(obj[key].y);
      }
    }

    return {
      x: Array.from(xValues),
      y: Array.from(yValues),
    };
  }

  updateCoordsLabels(evt) {
    if (!this.mousePosEventListener) this.addMousePosEventListener(evt);

    const grid = this.screenToGridCoordinate(this.mouse);

    this.screenCoordsEl.innerText = `${this.mouse.x}, ${this.mouse.y}`;
    this.gridCoordsEl.innerText = `${grid.x}, ${grid.y}`;
  }

  isVisible(vectors) {
    const overflowX = this.tileWidth * 3; // buffer so edges are drawn
    const overflowY = this.tileHeight * 3; // buffer so edges are drawn
    const minWidth = 0 - overflowX;
    const minHeight = 0 - overflowY;
    const maxWidth = document.body.clientWidth + overflowX;
    const maxHeight = document.body.clientHeight + overflowY;
    const xValues = this.getVectorValues(vectors).x;
    const yValues = this.getVectorValues(vectors).y;
    const outsideWidth = xValues.some((val) => (val < minWidth || val > maxWidth));
    const outsideHeight = yValues.some((val) => (val < minHeight || val > maxHeight));

    // If coord value are outside paramaters, it means it's not visible in the canvas
    return !outsideWidth && !outsideHeight;
  }
}
