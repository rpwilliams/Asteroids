(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict;"

/* Classes */
const Game = require('./game.js');
const Player = require('./player.js');
const Asteroid = require('./asteroid.js');

/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var player = new Player({x: canvas.width/2, y: canvas.height/2}, canvas);
var asteroids = [];

const MINIMUM_POINTS = 3;
const MAXIMUM_POINTS = 6;  // Max is actually 5 because it is non inclusive
const MAXIMUM_SIZE = 5;
const MINIMUM_SIZE = 1;

function loopBackgroundMusic()
{
  /*
    Background music is used under the creative commons license
    http://www.freesound.org/people/ERH/sounds/62067/
  */
  var backgroundMusic = new Audio('static/asteroids_music.wav');
  /* Loop the music */
  if (typeof backgroundMusic.loop == 'boolean')
  {
      backgroundMusic.loop = true;
  }
  else
  {
      backgroundMusic.addEventListener('ended', function() {
          this.currentTime = 0;
          this.play();
      }, false);
  }
  backgroundMusic.play();
}
loopBackgroundMusic();

function init() {
  var numAsteroids = 20;
  createAsteroids(numAsteroids);
}
init();

/**
 * @function createAsteroids
 * Randomly generates new asteroids 
 * @param {numAsteroids} the number of asteroids being generated
 */
function createAsteroids(numAsteroids)
{
  var angle = 0;
  for(var i = 0; i < numAsteroids; i++)
  {
    var randomX = Math.floor(Math.random() * 720) + 10;
    var randomY = Math.floor(Math.random() * 480) + 10;
    var randomSize = Math.floor(Math.random() * (MAXIMUM_SIZE - MINIMUM_SIZE)) + MINIMUM_SIZE;
    var randomNumPoints = Math.floor(Math.random() * (MAXIMUM_POINTS - MINIMUM_POINTS)) + MINIMUM_POINTS;
    var randomRightOrLeft = Math.floor(Math.random() * 3) + 1;
    var steerRight = true;
    var steerLeft = true;

    if(randomRightOrLeft == 1)
    {
      steerRight = false;
      steerLeft = false;
    }

    asteroids.push(new Asteroid({x: randomX, y: randomY}, canvas, 
      randomNumPoints, randomSize, 'white', steerRight, steerLeft));
  }
}

/**
 * @function masterLoop
 * Advances the game in sync with the refresh rate of the screen
 * @param {DOMHighResTimeStamp} timestamp the current time
 */
var masterLoop = function(timestamp) {
  game.loop(timestamp);
  window.requestAnimationFrame(masterLoop);
}
masterLoop(performance.now());


/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {DOMHighResTimeStamp} elapsedTime indicates
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime) {
  player.update(elapsedTime);

  // TODO: Update the game objects
  for(var i = 0; i < asteroids.length; i++)
  {
    asteroids[i].update(elapsedTime);
    for(var j = i+1; j < asteroids.length; j++)
    {
      if(boundingBoxCollision(asteroids[i], asteroids[j]))
      {
        asteroids[i].color = 'red';
        asteroids[j].color = 'red';
        console.log("Collision detected!");
      }
    }
  }
}

/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {DOMHighResTimeStamp} elapsedTime indicates
  * the number of milliseconds passed since the last frame.
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function render(elapsedTime, ctx) {
  /*
    Background
    Image is used under the public domain license
    https://pixabay.com/en/space-stars-star-wars-darck-nero-1164579/
  */
  var img = new Image();
  img.src = "static/stars.jpg";
  ctx.drawImage(img, -20, -20);
  // Render the player
  player.render(elapsedTime, ctx);
  // Render the asteroid
  for(var i = 0; i < asteroids.length; i++)
  {
    asteroids[i].render(elapsedTime, ctx);
  }
}

/**
  * @function boundingBoxCollisions
  * Checks for a collision by drawing a box around the shape
  * @param {a} the first asteroid
  * @param {b} the second asteroid
  * @return false if no collision, true if collision
  */
function boundingBoxCollision(a, b)
{
  return !(
    ((a.position.y + a.height) < (b.position.y)) ||
    (a.position.y > (b.position.y + b.height)) ||
    ((a.position.x + a.width) < b.position.x) ||
    (a.position.x > b.position.x + b.width)
    );
}


},{"./asteroid.js":2,"./game.js":3,"./player.js":4}],2:[function(require,module,exports){
"use strict";

const MS_PER_FRAME = 1000/8;

/**
 * @module exports the Asteroid class
 */
module.exports = exports = Asteroid;

/**
 * @constructor Asteroid
 * Creates a new Asteroid object
 * @param {Postition} position object specifying an x and y
 */
function Asteroid(position, canvas, randomNumPoints, size,  color, steerRight, steerLeft) {
  this.worldWidth = canvas.width;
  this.worldHeight = canvas.height;
  this.initialAcceleration = true; 
  this.state = "moving";
  this.randomNumPoints = randomNumPoints;

  // Use a random number between 1 - 4 to determine asteroid size increase
  switch(size)
  {
    case 1:
      this.size = 0;
      break;
    case 2:
      this.size = 5;
      break;
    case 3:
      this.size = 10;
      break;
    case 4:
      this.size = 20;
      break;
  }

  // Calculate the height and width of the asteroid for the rectanglular collisions
  switch(randomNumPoints)
  {
    case 3:
      this.height = (10 + this.size);
      this.width = (20 + this.size) - (10);
      break;
    case 4:
      this.height = (20 + this.size) - 10;
      this.width = (10 + this.size) - (-10 - this.size);
      break;
    case 5:
      this.height = (20 + this.size) - 5;
      this.width = (10 + this.size) - (-10 - this.size);
      break;
  }
  
  this.position = {
    x: position.x,
    y: position.y
  };
  this.velocity = {
    x: 0,
    y: 0
  }
  this.angle = 0;
  this.radius  = 64;
  this.color = color;
  this.steerRight = steerRight;
  this.steerLeft = steerLeft;
}

/**
 * @function updates the Asteroid object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Asteroid.prototype.update = function(time) {
  // Apply angular velocity
  if(this.steerLeft) {
    this.angle += time * 0.005;
  }
  if(this.steerRight) {
    this.angle -= .1;
  }
  // Apply acceleration
  if(this.initialAcceleration) {
    var acceleration = {
      x: Math.sin(this.angle),
      y: Math.cos(this.angle)
    }
    this.velocity.x -= acceleration.x;
    this.velocity.y -= acceleration.y;
    this.initialAcceleration = false;
  }
  // Apply velocity
  this.position.x += this.velocity.x;
  this.position.y += this.velocity.y;
  // Wrap around the screen
  if(this.position.x < 0) this.position.x += this.worldWidth;
  if(this.position.x > this.worldWidth) this.position.x -= this.worldWidth;
  if(this.position.y < 0) this.position.y += this.worldHeight;
  if(this.position.y > this.worldHeight) this.position.y -= this.worldHeight;
}

/**
 * @function renders the Asteroid into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Asteroid.prototype.render = function(time, ctx) {
  ctx.save();
  
  ctx.translate(this.position.x, this.position.y);
  ctx.rotate(-this.angle);
  
  ctx.beginPath();
  var size = this.size;
  var numPoints = this.randomNumPoints;
  
  // Draw an asteroid based on its number of points
  switch(numPoints)
  {
    case 3:
      ctx.moveTo(0, 20 + size);
      ctx.lineTo(5 + size, 10); 
      ctx.lineTo(10 + size, 15);  
      ctx.closePath();

      //console.log("3 points size: " + this.size);
      //console.log("3 points height: " + this.height + "width: " + this.width);
      break;
    case 4:
      ctx.moveTo(0, 20 + size);
      ctx.lineTo(10 + size, 15);
      ctx.lineTo(5, 10);
      ctx.lineTo(-10 - size, 10);
      ctx.closePath();
      
      //console.log("4 points size: " + this.size);
      //console.log("4 points height: " + this.height + "width: " + this.width);
      break;
    case 5:
      ctx.moveTo(0, 20 + size);
      ctx.lineTo(10 + size, 15);
      ctx.lineTo(5, 10);
      ctx.lineTo(-5 - size, 5);
      ctx.lineTo(-10 - size, 10);
      ctx.closePath();

    
      //console.log("5 points size: " + this.size);
      //console.log("5 points height: " + this.height + "width: " + this.width);
      break;
  }  
  ctx.strokeStyle = this.color;
  ctx.stroke();
  ctx.restore();
}


},{}],3:[function(require,module,exports){
"use strict";

/**
 * @module exports the Game class
 */
module.exports = exports = Game;

/**
 * @constructor Game
 * Creates a new game object
 * @param {canvasDOMElement} screen canvas object to draw into
 * @param {function} updateFunction function to update the game
 * @param {function} renderFunction function to render the game
 */
function Game(screen, updateFunction, renderFunction) {
  this.update = updateFunction;
  this.render = renderFunction;

  // Set up buffers
  this.frontBuffer = screen;
  this.frontCtx = screen.getContext('2d');
  this.backBuffer = document.createElement('canvas');
  this.backBuffer.width = screen.width;
  this.backBuffer.height = screen.height;
  this.backCtx = this.backBuffer.getContext('2d');

  // Start the game loop
  this.oldTime = performance.now();
  this.paused = false;
}

/**
 * @function pause
 * Pause or unpause the game
 * @param {bool} pause true to pause, false to start
 */
Game.prototype.pause = function(flag) {
  this.paused = (flag == true);
}

/**
 * @function loop
 * The main game loop.
 * @param{time} the current time as a DOMHighResTimeStamp
 */
Game.prototype.loop = function(newTime) {
  var game = this;
  var elapsedTime = newTime - this.oldTime;
  this.oldTime = newTime;

  if(!this.paused) this.update(elapsedTime);
  this.render(elapsedTime, this.frontCtx);

  // Flip the back buffer
  this.frontCtx.drawImage(this.backBuffer, 0, 0);
}

},{}],4:[function(require,module,exports){
"use strict";

const MS_PER_FRAME = 1000/8;

/**
 * @module exports the Player class
 */
module.exports = exports = Player;

/**
 * @constructor Player
 * Creates a new player object
 * @param {Postition} position object specifying an x and y
 */
function Player(position, canvas) {
  this.worldWidth = canvas.width;
  this.worldHeight = canvas.height;
  this.state = "idle";
  this.position = {
    x: position.x,
    y: position.y
  };
  this.velocity = {
    x: 0,
    y: 0
  }
  this.angle = 0;
  this.radius  = 64;
  this.thrusting = false;
  this.steerLeft = false;
  this.steerRight = false;

  var self = this;
  window.onkeydown = function(event) {
    switch(event.key) {
      case 'ArrowUp': // up
      case 'w':
        self.thrusting = true;
        break;
      case 'ArrowLeft': // left
      case 'a':
        self.steerLeft = true;
        break;
      case 'ArrowRight': // right
      case 'd':
        self.steerRight = true;
        break;
    }
  }

  window.onkeyup = function(event) {
    switch(event.key) {
      case 'ArrowUp': // up
      case 'w':
        self.thrusting = false;
        break;
      case 'ArrowLeft': // left
      case 'a':
        self.steerLeft = false;
        break;
      case 'ArrowRight': // right
      case 'd':
        self.steerRight = false;
        break;
    }
  }
}



/**
 * @function updates the player object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Player.prototype.update = function(time) {
  // Apply angular velocity
  if(this.steerLeft) {
    this.angle += time * 0.005;
  }
  if(this.steerRight) {
    this.angle -= 0.1;
  }
  // Apply acceleration
  if(this.thrusting) {
    var acceleration = {
      x: Math.sin(this.angle),
      y: Math.cos(this.angle)
    }
    this.velocity.x -= acceleration.x/4;
    this.velocity.y -= acceleration.y/4;
  }
  // Apply velocity
  this.position.x += this.velocity.x;
  this.position.y += this.velocity.y;
  // Wrap around the screen
  if(this.position.x < 0) this.position.x += this.worldWidth;
  if(this.position.x > this.worldWidth) this.position.x -= this.worldWidth;
  if(this.position.y < 0) this.position.y += this.worldHeight;
  if(this.position.y > this.worldHeight) this.position.y -= this.worldHeight;

  console.log("( " + this.position.x + "," + this.position.y + ")");
}

/**
 * @function renders the player into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Player.prototype.render = function(time, ctx) {
  ctx.save();

  // Draw player's ship
  ctx.translate(this.position.x, this.position.y);
  ctx.rotate(-this.angle);
  ctx.beginPath();
  ctx.moveTo(0, -10);
  ctx.lineTo(-10, 10);
  ctx.lineTo(0, 0);
  ctx.lineTo(10, 10);
  ctx.closePath();
  ctx.strokeStyle = 'white';
  ctx.stroke();

  // Draw engine thrust
  if(this.thrusting) {
    ctx.beginPath();
    ctx.moveTo(0, 20);
    ctx.lineTo(5, 10);
    ctx.arc(0, 10, 5, 0, Math.PI, true);
    ctx.closePath();
    ctx.strokeStyle = 'orange';
    ctx.stroke();
  }
  ctx.restore();
}

},{}]},{},[1]);
