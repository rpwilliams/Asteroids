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
  this.active = true;
  this.size = size;

  // Calculate the height and width of the asteroid for the rectanglular collisions
  switch(randomNumPoints)
  {
    case 3:
      this.height = (10 + this.size);
      this.width = (20 + this.size) - (10);
      break;
    case 4:
      this.height = (20 + this.size) - 10;
      this.width = (5 + this.size) - (-5 - this.size);  // this is cut in half
      break;
    case 5:
      this.height = (20 + this.size) - 5;
      this.width = (10 + this.size) - (-10 - this.size);
      break;
    default:
      this.height = (10 + this.size);
      this.width = (20 + this.size) - (10);
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

  // Check if size is less than 0
  this.active = this.active && this.size >= 0;
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
  
  // Draw an polygon shaped asteroid based on its number of points
  switch(numPoints)
  {
    // 3 points (triangle)
    case 3:
      ctx.moveTo(0, 20 + size);
      ctx.lineTo(5 + size, 10); 
      ctx.lineTo(10 + size, 15);  
      ctx.closePath();
      break;
    // 4 points
    case 4:
      ctx.moveTo(0, 20 + size);
      ctx.lineTo(10 + size, 15);
      ctx.lineTo(5, 10);
      ctx.lineTo(-10 - size, 10);
      ctx.closePath();
      break;
    // 5 points
    case 5:
      ctx.moveTo(0, 20 + size);
      ctx.lineTo(10 + size, 15);
      ctx.lineTo(5, 10);
      ctx.lineTo(-5 - size, 5);
      ctx.lineTo(-10 - size, 10);
      ctx.closePath();
      break;
  }  
  ctx.strokeStyle = this.color;
  ctx.stroke();
  ctx.restore();
}

