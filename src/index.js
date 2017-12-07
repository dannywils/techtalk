window.onload = () => {
  const { canvas, ctx } = require('./draw');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const { run } = require('./game');
  run();
};
