class World {
  constructor({ width, height, globalSpeed, playerSpeed }) {
    this.dx = width;
    this.dy = height;
    this.planets = [];
    this.players = [];
    this.globalSpeed = globalSpeed;
    this.playerSpeed = playerSpeed;
    this.maxSpeed = globalSpeed * 1e7;
    this.frictionFactor = 1.01;
    this.gameOver = false;
  }

  movement(keys) {
    var gamepads = navigator.getGamepads
      ? navigator.getGamepads()
      : navigator.webkitGetGamepads ? navigator.webkitGetGamepads : [];

    const deadzone = 0.2;

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

        const addPlanet = () => {
          console.log('add planet called');
          this.planets.push(
            new Planet({
              x: playerOne.x,
              y: playerOne.y,
              mass: 100,
              color: playerOne.color
            })
          );
        };

        if (a.pressed) {
          throttle(addPlanet, 1000, this)();
        }

        playerOne.shrink = lt.pressed;

        if (Math.abs(x1) > deadzone) {
          playerOne.moveX(x1 * this.playerSpeed);
        }
        if (Math.abs(y1) > deadzone) {
          playerOne.moveY(y1 * this.playerSpeed);
        }

        // PLAYER TWO CONTROLS
        const playerTwo = this.players[1];

        playerTwo.shrink = rt.pressed;

        if (Math.abs(x2) > deadzone) {
          playerTwo.moveX(x2 * this.playerSpeed);
        }
        if (Math.abs(y2) > deadzone) {
          playerTwo.moveY(y2 * this.playerSpeed);
        }
      }
    }

    this.players.forEach(player => {
      const distance = this.playerSpeed;

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

      // if (player.keys.shrink) {
      //   player.mass = player.originalMass / 2;
      // } else {
      //   player.mass = player.originalMass;
      // }
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
      const attr = right.mass / distance * distance;

      let dx = -v.x * attr;
      let dy = -v.y * attr;

      left.dx += dx;
      left.dy += dy;
    }
  }

  gravity() {
    this.planets.forEach(planet => {
      planet.dx = planet.dx / this.frictionFactor;
      planet.dy = planet.dy / this.frictionFactor;

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
    if (this.gameOver) {
      this.drawGameOver();
    }
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
    if (!this.gameOver) {
      ctx.beginPath();
      ctx.lineWidth = '2';
      ctx.strokeStyle = 'red';
      ctx.rect(canvas.width / 2 - 5, 0, 10, canvas.height);
      ctx.stroke();
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

    this.planets.forEach(object => object.draw());
  }
}
