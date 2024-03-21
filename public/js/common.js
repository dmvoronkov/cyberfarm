function startNewGame(container) {
  container.innerHTML = '';
  container.className = 'container';
  const canvas = document.createElement('canvas');
  canvas.id = 'isometric-canvas';
  container.appendChild(canvas);
  const isoWorld = new IsoWorld();
  isoWorld.init('isometric-canvas', '/images/tilesheet.png');
}
