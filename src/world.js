import { canvas, ctx } from './draw';

export class World {
  constructor({ width, height, globalSpeed, playerSpeed }) {
    this.dx = width;
    this.dy = height;
    this.planets = [];
    this.players = [];
    this.globalSpeed = globalSpeed;
    this.playerSpeed = playerSpeed;
    this.frictionFactor = 1425;
    this.keyboardSpeedModifier = 0.75;
    this.gameOver = false;
    this.controllerDeadZone = 0.2;
  }

  movement(keys) {
    var gamepads = navigator.getGamepads
      ? navigator.getGamepads()
      : navigator.webkitGetGamepads ? navigator.webkitGetGamepads : [];

    for (var i = 0; i < gamepads.length; i++) {
      var gp = gamepads[i];
      if (gp) {
        const [x1, y1, x2, y2] = gp.axes;

        const [
          a,
          b,
          x,
          y,
          lb,
          rb,
          lt,
          rt,
          select,
          start,
          ls,
          rs,
          du,
          dd,
          dl,
          dr
        ] = gp.buttons;

        // PLAYER ONE CONTROLS
        const playerOne = this.players[0];

        if (Math.abs(x1) > this.controllerDeadZone) {
          playerOne.moveX(x1 * this.playerSpeed * this.globalSpeed);
        }
        if (Math.abs(y1) > this.controllerDeadZone) {
          playerOne.moveY(y1 * this.playerSpeed * this.globalSpeed);
        }

        // PLAYER TWO CONTROLS
        const playerTwo = this.players[1];

        if (Math.abs(x2) > this.controllerDeadZone) {
          playerTwo.moveX(x2 * this.playerSpeed * this.globalSpeed);
        }
        if (Math.abs(y2) > this.controllerDeadZone) {
          playerTwo.moveY(y2 * this.playerSpeed * this.globalSpeed);
        }
      }
    }

    this.players.forEach(player => {
      const distance =
        this.playerSpeed * this.keyboardSpeedModifier * this.globalSpeed;

      if (player.keys.left) {
        player.moveX(-distance);
      }

      if (player.keys.right) {
        player.moveX(distance);
      }

      if (player.keys.up) {
        player.moveY(-distance);
      }

      if (player.keys.down) {
        player.moveY(distance);
      }
    });

    this.planets.forEach(object => {
      object.x += object.dx * this.globalSpeed;
      object.y += object.dy * this.globalSpeed;
    });
  }

  dist(left, right) {
    return Math.sqrt(
      (left.x - right.x) * (left.x - right.x) +
        (left.y - right.y) * (left.y - right.y)
    );
  }

  direction(left, right) {
    const v = {
      x: right.x - left.x,
      y: right.y - left.y
    };

    const magn = Math.sqrt(v.x * v.x + v.y * v.y);
    v.x = v.x / magn;
    v.y = v.y / magn;
    return v;
  }

  gravityInner(planet, player, massModifier = 1) {
    const distance = this.dist(planet, player);

    if (distance > 1) {
      const v = this.direction(planet, player);
      const attr = player.mass * massModifier / distance * distance;

      let dx = v.x * attr;
      let dy = v.y * attr;

      planet.dx += dx;
      planet.dy += dy;

      const planetRadius = planet.width / 2;
      const playerRadius = player.width / 2;

      if (
        distance < planetRadius + playerRadius &&
        planet.color !== player.color
      ) {
        this.collide(planet, player);
      }
    }
  }

  repell(left, right) {
    const distance = this.dist(left, right);
    if (distance > 1) {
      const v = this.direction(left, right);
      const attr = right.mass / 4 / distance * distance;

      let dx = -v.x * attr;
      let dy = -v.y * attr;

      left.dx += dx;
      left.dy += dy;
    }
  }

  wallBounce(planet) {
    const collisionDamper = 0.00003;
    const radius = planet.width / 2;

    // floor condition
    if (planet.y > canvas.height - radius) {
      planet.y = canvas.height - radius - 2;
      planet.dy *= -1;
      planet.dy *= 1 - collisionDamper;
    }

    // ceiling condition
    if (planet.y < radius) {
      planet.y = radius + 2;
      planet.dy *= -1;
      planet.dy *= 1 - collisionDamper;
    }

    // right wall condition
    if (planet.x > canvas.width - radius) {
      planet.x = canvas.width - radius - 2;
      planet.dx *= -1;
      planet.dx *= 1 - collisionDamper;
    }

    // planet wall condition
    if (planet.x < radius) {
      planet.x = radius + 2;
      planet.dx *= -1;
      planet.dx *= 1 - collisionDamper;
    }

    // floor friction
    const friction = this.frictionFactor * this.globalSpeed;

    planet.dx *= friction;
    planet.dy *= friction;
  }

  gravity() {
    this.players.forEach(player => {
      this.wallBounce(player);
    });
    this.planets.forEach(planet => {
      this.wallBounce(planet);

      this.planets.forEach(planet2 => {
        if (planet !== planet2) {
          this.repell(planet, planet2);
        }
      });

      this.players.forEach(player => {
        let massModifier = 1;

        // matching colors have mass modifier
        if (planet.color === player.color) {
          massModifier = 2;
        }

        this.gravityInner(planet, player, massModifier);
      });
    });
  }

  collide(planet, player) {
    this.planets = this.planets.filter(p => p !== planet);
    player.hit();

    if (!player.lives) {
      this.gameOver = true;
    }
  }

  update() {
    this.gravity();
    this.movement();
  }

  drawGameOver() {
    const winnerIndex = this.players.findIndex(player => player.lives !== 0);
    ctx.fillStyle = 'white';
    ctx.font = '120px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
    ctx.font = '100px Arial';
    ctx.fillStyle = '#eee';
    ctx.fillText(
      `PLAYER ${winnerIndex + 1} WINS`,
      canvas.width / 2,
      canvas.height / 2 + 100
    );
  }

  draw() {
    if (this.gameOver) {
      this.drawGameOver();
    }
    // todo: move to player subclass
    this.players.forEach(player => {
      if (player.lives === 0) {
        return;
      }
      player.draw();
      ctx.fillStyle = 'green';
      ctx.font = '80px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('-'.repeat(player.lives), player.x, player.y - player.width);
    });

    if (!this.gameOver) {
      ctx.beginPath();
      ctx.lineWidth = '1';
      ctx.strokeStyle = 'white';
      ctx.rect(canvas.width / 2, 0, 1, canvas.height);
      ctx.stroke();
    }

    this.planets.forEach(object => object.draw());
  }
}
