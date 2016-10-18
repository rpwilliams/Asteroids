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

