let canvas, ctx, ship;
let canvasWidth = 1400;
let canvasHeight = 900;
let gameColor = "green";
let backgroundColor = "black";
let keys = []; //For determining what key is pressed and lets the user press multiple at once.
let bullets = [];
let asteroids = [];

document.addEventListener("DOMContentLoaded", SetupCanvas);

function SetupCanvas() {
  canvas = document.getElementById("my-canvas");
  ctx = canvas.getContext("2d");
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height); //Draw the actual canvas
  ship = new Ship();

  //Push all astroids to array
  for (let i = 0; i < 8; i++) {
    asteroids.push(new Asteroid());
  }

  //Listens whenever a key is pressed
  document.body.addEventListener("keydown", function(e) {
    keys[e.keyCode] = true;
  });

  //Listens whenever a key is let go
  document.body.addEventListener("keyup", function(e) {
    keys[e.keyCode] = false;
    if (e.keyCode === 32) {
      //Keycode 32 is space bar.
      bullets.push(new Bullet(ship.angle));
    }
  });

  //Render everything
  Render();
}

class Ship {
  constructor() {
    this.visible = true;
    this.x = canvasWidth / 2;
    this.y = canvasHeight / 2;
    this.movingForward = false;
    this.speed = 0.05;
    this.velocityX = 0;
    this.velocityY = 0;
    this.rotationSpeed = 0.001;
    this.radius = 15;
    this.angle = 0;
    this.strokeColor = gameColor;
    this.noseX = canvasWidth / 2 + 15;
    this.nosey = canvasHeight / 2;
  }

  //Rotate the ship
  Rotate(dir) {
    this.angle += this.rotationSpeed * dir;
  }

  Update() {
    //Converts degrees into radians
    let radians = (this.angle / Math.PI) * 180;

    //Finding the x and y velocity
    if (this.movingForward) {
      this.velocityX += Math.cos(radians) * this.speed;
      this.velocityY += Math.sin(radians) * this.speed;
    }

    //Following If Statements will make the player go from one side of the screen to the other, like Pac-Man.
    if (this.x < this.radius) {
      this.x = canvas.width;
    }
    if (this.x > canvas.width) {
      this.x = this.radius;
    }
    if (this.y < this.radius) {
      this.y = canvas.height;
    }
    if (this.y > canvas.height) {
      this.y = this.radius;
    }

    //Simulate the ship slowing down when key is let go
    this.velocityX *= 0.99;
    this.velocityY *= 0.99;
    this.x -= this.velocityX;
    this.y -= this.velocityY;
  }

  //Draw the ship
  Draw() {
    ctx.strokeStyle = this.strokeColor;
    ctx.beginPath();
    let vertAngle = (Math.PI * 2) / 3;
    let radians = (this.angle / Math.PI) * 180;
    this.noseX = this.x - this.radius * Math.cos(radians);
    this.noseY = this.y - this.radius * Math.sin(radians);
    for (let i = 0; i < 3; i++) {
      ctx.lineTo(
        this.x - this.radius * Math.cos(vertAngle * i + radians),
        this.y - this.radius * Math.sin(vertAngle * i + radians)
      );
    }
    ctx.closePath();
    ctx.stroke();
  }
}

class Bullet {
  constructor(angle) {
    this.visible = true;
    this.x = ship.noseX;
    this.y = ship.noseY;
    this.angle = angle;
    this.height = 4;
    this.width = 4;
    this.speed = 5;
    this.velocityX = 0;
    this.velocityY = 0;
  }
  Update() {
    let radians = (this.angle / Math.PI) * 180;
    this.x -= Math.cos(radians) * this.speed;
    this.y -= Math.sin(radians) * this.speed;
  }
  Draw() {
    ctx.fillStyle = gameColor;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Asteroid {
  constructor(x, y) {
    this.visible = true;
    this.x = Math.floor(Math.random() * canvasWidth);
    this.y = Math.floor(Math.random() * canvasHeight);
    this.speed = 1;
    this.radius = 50;
    this.angle = Math.floor(Math.random() * 359);
    this.strokeColor = gameColor;
  }
  Update() {
    let radians = (this.angle / Math.PI) * 180;
    this.x += Math.cos(radians) * this.speed;
    this.y += Math.sin(radians) * this.speed;
    if (this.x < this.radius) {
      this.x = canvas.width;
    }
    if (this.x > canvas.width) {
      this.x = this.radius;
    }
    if (this.y < this.radius) {
      this.y = canvas.height;
    }
    if (this.y > canvas.height) {
      this.y = this.radius;
    }
  }
  Draw() {
    ctx.beginPath();
    let vertAngle = (Math.PI * 2) / 6;
    var radians = (this.angle / Math.PI) * 180;
    for (let i = 0; i < 6; i++) {
      ctx.lineTo(
        this.x - this.radius * Math.cos(vertAngle * i + radians),
        this.y - this.radius * Math.sin(vertAngle * i + radians)
      );
      ctx.closePath();
      ctx.stroke();
    }
  }
}

function Render() {
  ship.movingForward = keys[87]; //Keycode 87 is the keycode for W
  if (keys[68]) {
    //Keycode 68 is D
    ship.Rotate(1);
  }
  if (keys[65]) {
    //Keycode 65 is A
    ship.Rotate(-1);
  }
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ship.Update();
  ship.Draw();
  if (bullets.length !== 0) {
    for (let i = 0; i < bullets.length; i++) {
      bullets[i].Update();
      bullets[i].Draw();
    }
  }
  if (asteroids.length !== 0) {
    for (let j = 0; j < asteroids.length; j++) {
      asteroids[j].Update();
      asteroids[j].Draw();
    }
  }
  requestAnimationFrame(Render);
}
