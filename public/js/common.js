function startNewGame(container) {
  container.innerHTML = '';
  container.className = 'container';
  const flexColumn = document.createElement('div');
  flexColumn.style.display = 'flex';
  flexColumn.style.height = '100%';
  flexColumn.style.flexDirection = 'column';
  flexColumn.style.justifyContent = 'space-between';
  flexColumn.innerHTML = `
    <header>
      <div id="game-logo">Cyber Farm</div>
      <div class="stats">
        <div>Собрано урожая <span class="digits" id="harvested"></span>/<span class="digits" id="required-harvest"></span></div>
        <div>Энергия: <span class="digits" id="energy"></span></div>      
      </div>
      <div class="buttons"><a href="#" class="button" id="saveBtn">Сохранить и завершить</a></div>
    </header>
    <main id="main" class="game-container"></main>
    <footer></footer>`;
  container.appendChild(flexColumn);
  const main = flexColumn.querySelector('#main');
  const canvas = document.createElement('canvas');
  canvas.id = 'isometric-canvas';
  main.appendChild(canvas);
  const isoWorld = new IsoWorld();
  isoWorld.init('isometric-canvas', '/images/tilesheet.png');
}
