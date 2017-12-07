import { addKeyEvents } from './events';
import { Planet } from './planet';
import { World } from './world';
import { ctx, canvas } from './draw';

import requestAnimFrame from './polyfill';

let lastTime = 0;

function update(world) {
  const date = new Date();
  const time = date.getTime();
  const timeDiff = time - lastTime;
  lastTime = time;

  world.globalSpeed = 0.0001 * timeDiff;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  world.draw();
  world.update();
  requestAnimFrame(() => update(world));
}

function start() {
  const width = canvas.width;
  const height = canvas.height;

  const world = new World({
    width,
    height,
    playerSpeed: 20000
  });

  const planetMass = 300;
  const playerMass = 600;

  const numberOfPlanets = 5;

  for (let i = 0; i < numberOfPlanets; i++) {
    // planets
    world.planets.push(
      new Planet({
        x: width / 2,
        y: height / numberOfPlanets * (i + 1),
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
    x: width / 8,
    y: height / 2,
    bounds: {
      x0: 0,
      y0: 0,
      x1: width / 2,
      y1: height,
      ctx
    },
    mass: playerMass,
    color: 'red',
    pattern: '/images/earth.jpg',
    keys: { ...initialPlayerState }
  });

  addKeyEvents({
    downKey: 's',
    upKey: 'w',
    leftKey: 'a',
    rightKey: 'd',
    objectToUpdate: playerOne.keys
  });

  const playerTwo = new Planet({
    x: width / 8 * 7,
    y: height / 2,
    bounds: {
      x0: width / 2,
      y0: 0,
      x1: width,
      y1: height
    },
    mass: playerMass,
    color: 'blue',
    pattern: '/images/mars.jpg',
    keys: { ...initialPlayerState }
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

  update(world);
  return world;
}

export const run = () => {
  let world = start();
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.addEventListener('click', event => {
    if (world.gameOver) {
      world = start();
    }
  });
};
