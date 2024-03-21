document.addEventListener('DOMContentLoaded', () => {
  // const canvas = document.getElementById('isometric-canvas');
  // const isoGrid = new IsometricGrid(canvas, {
  //   drawMarkedCenter: false,
  //   drawCoords: true,
  //   numCols: 9,
  //   numRows: 9,
  //   drawCoordsLabels: false,
  //   highlightOnHover: true,
  // });

  // isoGrid.setup();

  // function redraw() {
  //   isoGrid.setup();
  // }

  // let resizeTimeout;
  // window.onresize = function () {
  //   clearTimeout(resizeTimeout);
  //   resizeTimeout = setTimeout(redraw, 100);
  // };

  function init() {
    const isoWorld = new IsoWorld();
    isoWorld.init('isometric-canvas', '/images/tilesheet.png');
  }

  init();
});
