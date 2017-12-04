function update(canvas, world) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  world.update();
  world.draw();
  requestAnimFrame(() => update(canvas, world));
}

function start(canvas) {
  const world = new World({
    width: canvas.width,
    height: canvas.height,
    globalSpeed: 0.0005,
    playerSpeed: 15
  });

  const planetMass = 100;
  const playerMass = 600;

  const numberOfPlanets = 3;

  for (let i = 0; i < numberOfPlanets; i++) {
    // planets
    world.planets.push(
      new Planet({
        x: canvas.width / 2,
        y: canvas.height / 1 + numberOfPlanets * i,
        mass: planetMass,
        color: 'white'
      })
    );
  }

  const initialPlayerState = {
    left: false,
    right: false,
    up: false,
    down: false,
    shrink: false
  };
  // players
  const playerOne = new Planet({
    x: canvas.width / 8,
    y: canvas.height / 2,
    bounds: {
      x0: 0,
      y0: 0,
      x1: canvas.width / 2,
      y1: canvas.height
    },
    mass: playerMass,
    color: 'red',
    pattern: 'images/earth.jpg',
    keys: Object.assign({}, initialPlayerState)
  });

  addKeyEvents({
    downKey: 's',
    upKey: 'w',
    leftKey: 'a',
    rightKey: 'd',
    objectToUpdate: playerOne.keys
  });

  const playerTwo = new Planet({
    x: canvas.width / 8 * 7,
    y: canvas.height / 2,
    bounds: {
      x0: canvas.width / 2,
      y0: 0,
      x1: canvas.width,
      y1: canvas.height
    },
    mass: playerMass,
    color: 'blue',
    pattern: 'images/mars.jpg',
    keys: Object.assign({}, initialPlayerState)
  });

  addKeyEvents({
    downKey: 'ArrowDown',
    upKey: 'ArrowUp',
    leftKey: 'ArrowLeft',
    rightKey: 'ArrowRight',
    shrinkKey: ' ',
    objectToUpdate: playerTwo.keys
  });

  world.players.push(playerOne);
  world.players.push(playerTwo);

  update(canvas, world);
  return world;
}

function createWorldObjects(world) {}

window.onload = () => {
  canvas = document.getElementById('canvas_main');
  ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  let world = start(canvas);

  canvas.addEventListener('click', event => {
    if (world.gameOver) {
      world = start(canvas);
    }
  });
};
