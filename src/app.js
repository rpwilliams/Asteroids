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
  var numAsteroids = 10;
  createAsteroids(numAsteroids);
}
init();

function createAsteroids(numAsteroids)
{
  // An asteroid can't have anything less than three points
  const MINIMUM_POINTS = 3;
  const MAXIMUM_POINTS = 6;  // Max is actually 5 because it is non inclusive
  const MAXIMUM_SIZE = 4;
  const MINIMUM_SIZE = 1;
  var angle = 10
  for(var i = 0; i < numAsteroids; i++)
  {
    var randomX = Math.floor(Math.random() * 720) + 10;
    var randomY = Math.floor(Math.random() * 480) + 10;
    var randomSize = Math.floor(Math.random() * MAXIMUM_SIZE) + MINIMUM_SIZE;
    var randomNumPoints = Math.floor(Math.random() * MAXIMUM_POINTS - MINIMUM_POINTS) + MINIMUM_POINTS;

    // Alternate every other direction of the asteroid
    // e.g 1 is right, 2 is left, 3 is right, etc.
    // var rightOrLeft = i % 2;
    // var right;
    // var left;

    // Make the first asteroid a different direction than all the asteroids
    // if(i == 0)
    // {
    //   right = true;
    //   left = true;
    // }
    // else if(rightOrLeft == 0)
    // {
    //   right = true;
    //   left = false;
    // }
    // else
    // {
    //   left = true;
    //   right = false;
    // }
    asteroids.push(new Asteroid({x: randomX, y: randomY}, canvas, 
      randomNumPoints, randomSize, angle));
    angle += 5;
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

  for(var i = 0; i < asteroids.length; i++)
  {
    asteroids[i].update(elapsedTime);
  }

  for(var i = 0; i < asteroids.length - 1; i++)
  {
    if(checkCollision(asteroids[i], asteroids[i+1]))
    {
      if(asteroids[i].size == 1)
      {
        // remove the asteroid
      }
      if(asteroids[i + 1].size == 1)
      {
        // remove the asteroid
      }

      asteroids[i].size /= 2;
      asteroids[i+1].size /= 2;
    }
  }
  // TODO: Update the game objects
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

function checkCollision(asteroid1, asteroid2)
{
  var rect1 = {x: asteroid1.position.x, y: asteroid1.position.y, 
    width: asteroid1.width, height: asteroid1.height};
  var rect2 = {x: asteroid2.position.x, y: asteroid2.position.y, 
    width: asteroid2.width, height: asteroid2.height};
  if (rect1.x < rect2.x + rect2.width &&
   rect1.x + rect1.width > rect2.x &&
   rect1.y < rect2.y + rect2.height &&
   rect1.height + rect1.y > rect2.y) {
    console.log("Collision detected between num of points " +
      asteroid1.randomNumPoints + "and num of points " + asteroid2.randomNumPoints);
    return;
    //return true;  // Collision detected
  }
}
