
"use strict;"

/* Classes */
const Game = require('./game.js');
const Player = require('./player.js');
const Asteroid = require('./asteroid.js');
const Bullet = require('./bullet.js');

/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var player = new Player({x: canvas.width/2, y: canvas.height/2}, canvas);
var asteroids = [];
var bullets = [];

var gameOver = false;
var numAsteroids = 20;
var lives = 3;
var score = 0;
var level = 1;

const MINIMUM_POINTS = 3;
const MAXIMUM_POINTS = 6;  // Max is actually 5 because it is non inclusive
const MAXIMUM_SIZE = 5;
const MINIMUM_SIZE = 1;
const ASTEROID_SIZE_1 = 0;
const ASTEROID_SIZE_2 = 5;
const ASTEROID_SIZE_3 = 10;
const ASTEROID_SIZE_4 = 20;

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

  // Use a random number between 1 - 4 to determine asteroid size increase
  var size = 0;
  switch(randomSize)
  {
    case 1:
      size = ASTEROID_SIZE_1;
      break;
    case 2:
      size = ASTEROID_SIZE_2;
      break;
    case 3:
      size = ASTEROID_SIZE_3;
      break;
    case 4:
      size = ASTEROID_SIZE_4;
      break;
  }

    asteroids.push(new Asteroid({x: randomX, y: randomY}, canvas, 
      randomNumPoints, size, 'white', steerRight, steerLeft));
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
  document.getElementById('score').innerHTML = "Score: " + score;
  document.getElementById('level').innerHTML = "Level: " + level;
  document.getElementById('lives').innerHTML = "Lives: " + lives;
  if(!gameOver)
  {
    player.update(elapsedTime);

    for(var i = 0; i < bullets.length; i++)
    {
      bullets[i].update(elapsedTime);
    }    

    if(player.fire)
    {
      shoot(player);
      // Only include the active bullets   
    }

    bullets.forEach(function(bullet) {
      asteroids.forEach(function(asteroid) {
        if(collides(bullet, asteroid)) {
          destroy(asteroid);
          console.log("You just destroyed an asteroid");
          bullet.active = false;
        }
      });
    });

    bullets = bullets.filter(function(bullet){ return bullet.active; });
    asteroids = asteroids.filter(function(asteroid){ return asteroid.active; });

    // Check for player to asteroid collision
    for(var i =0; i < asteroids.length; i++)
    {
      if(boundingBoxCollision(asteroids[i], player))
      {
        console.log("Player collision!");
        stop();
      }
    }

    // update asteroids
    for(var i = 0; i < asteroids.length; i++)
    {
      asteroids[i].update(elapsedTime);
    }

    // Check for asteroid to asteroid collision
    for(var i = 0; i < asteroids.length; i++)
    {
      for(var j = i+1; j < asteroids.length; j++)
      {
        if(collides(asteroids[i], asteroids[j]))
        {
          asteroids[i].color = 'red';
          asteroids[j].color = 'red';
          destroy(asteroids[i]);
          destroy(asteroids[j]);
          console.log("Asteroid collision!");
          break;
          
        }
      }
    }
  }
  else
  {
    if(lives > 0)
    {
      //document.getElementById('final').innerHTML = "Final Score: " + score;
      //document.getElementById('try again').innerHTML = "<b>Press space to continue</b>";
      asteroids = [];
      init();
      gameOver = false;
      player.position.x = 380;
      player.position.y = 240;
      player.velocity.x = 0;
      player.velocity.y = 0;
      console.log("Lives: " + lives);
    }
    else
    {
      asteroids = [];
      document.getElementById('game over').innerHTML = "Game Over";
      document.getElementById('final').innerHTML = "Final Score: " + score;    
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
  player.render(elapsedTime, ctx, gameOver);
  // Render the asteroid
  for(var i = 0; i < asteroids.length; i++)
  {
    asteroids[i].render(elapsedTime, ctx);
  }
  // Render the bullets
  for(var i = 0; i < bullets.length; i++)
  {
    bullets[i].render(elapsedTime, ctx)
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

function collides(a, b) {
  if(a === undefined || b === undefined
    || a === undefined || b === undefined)
  {
    return;
  }
  if(a.position === undefined || b.position === undefined
    || a.position === undefined || b.position === undefined)
  {
    return;
  }
  return a.position.x < b.position.x + b.width &&
         a.position.x + a.width > b.position.x &&
         a.position.y < b.position.y + b.height &&
         a.position.y + a.height > b.position.y;
}

function stop()
{
  var audio = new Audio('static/player_death.wav'); // Created with http://www.bfxr.net/
  audio.play();
  lives--;
  gameOver = true;
}

function shoot(player)
{
  var now = Date.now();
  if(now - player.lastShootTime < player.shootRate) return;
  player.lastShootTime = now;

  var audio = new Audio('static/player_shoot.wav'); // Created with http://www.bfxr.net/
  audio.play();

  var bulletPosition = player.midpoint();
  bullets.push(new Bullet({
    x: bulletPosition.x, 
    y: bulletPosition.y},
    canvas, player.angle
    ));
}

function destroy(asteroid)
{
  var audio = new Audio('static/asteroid_death.wav'); // Created with http://www.bfxr.net/
  audio.play();

  if(asteroid.size == ASTEROID_SIZE_1)
  {
    asteroid.active = false;  // eliminate the asteroid
  }
  else if(asteroid.size == ASTEROID_SIZE_2)
  {
    asteroids.push(new Asteroid({x: asteroid.position.x + 20, y: asteroid.position.y},
     canvas, asteroid.randomNumPoints, ASTEROID_SIZE_1, asteroid.color, true, true));
    asteroids.push(new Asteroid({x: asteroid.position.x - 20, y: asteroid.position.y},
     canvas, asteroid.randomNumPoints, ASTEROID_SIZE_1, asteroid.color, false, false));
    asteroid.active = false;
  }
  else if(asteroid.size == ASTEROID_SIZE_3)
  {
    asteroids.push(new Asteroid({x: asteroid.position.x + 20,y: asteroid.position.y},
     canvas, asteroid.randomNumPoints, ASTEROID_SIZE_2, asteroid.color, true, true));
    asteroids.push(new Asteroid({x: asteroid.position.x - 20,y: asteroid.position.y},
     canvas, asteroid.randomNumPoints, ASTEROID_SIZE_2, asteroid.color, false, false));
    asteroid.active = false;
  } 
  else if(asteroid.size == ASTEROID_SIZE_4)
  {
   asteroids.push(new Asteroid({x: asteroid.position.x + 20,y: asteroid.position.y},
    canvas, asteroid.randomNumPoints, ASTEROID_SIZE_3, asteroid.color, true, true));
    asteroids.push(new Asteroid({x: asteroid.position.x - 20, y: asteroid.position.y},
     canvas, asteroid.randomNumPoints, ASTEROID_SIZE_3, asteroid.color, false, false));
    asteroid.active = false;
  }  
}