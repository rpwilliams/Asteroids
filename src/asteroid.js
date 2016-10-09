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
function Asteroid(position, canvas, randomNumPoints, size) {
  this.worldWidth = canvas.width;
  this.worldHeight = canvas.height;
  this.initialAcceleration = true; 
  this.state = "moving";
  
  // Use random number between 1 - 4 to determine asteroid size increase
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
      this.size = 15;
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
  //this.thrusting = false;
  this.steerLeft = true;
  this.steerRight = true;
  this.randomNumPoints = randomNumPoints;
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
    this.angle -= 0.1;
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

  // Draw Asteroid's ship
  ctx.translate(this.position.x, this.position.y);
  ctx.rotate(-this.angle);
  
  // ctx.beginPath();
  // ctx.moveTo(0, -10);
  // ctx.lineTo(-10, 10);
  // ctx.lineTo(0, 0);
  // ctx.lineTo(10, 10);
  // ctx.closePath();
  // ctx.beginPath();
  // var count = this.randomNumPoints;
  // while(count > 0)
  // {
  //   ctx.moveTo(0, -10);
  //   ctx.lineTo(10,10);
  //   ctx.lineTo(0, 0);
  //   ctx.lineTo(10, 10);
  //   count--;
  // }
  // ctx.closePath();
  ctx.beginPath();
  

  var size = this.size;
  var numPoints = this.randomNumPoints
  console.log(size);

  switch(numPoints)
  {
    case 3:
      ctx.moveTo(0, 20 + size);
      ctx.lineTo(5 + size, 10); 
      ctx.lineTo(10 + size, 15);  
      ctx.closePath();
      console.log("3 points");
      break;
    case 4:
      ctx.moveTo(0, 20 + size);
      ctx.lineTo(10 + size, 15);
      ctx.lineTo(5, 10);
      ctx.lineTo(-10 - size, 10);
      ctx.closePath();
      console.log("4 points");
      break;
    case 5:
      ctx.moveTo(0, 20 + size);
      ctx.lineTo(10 + size, 15);
      ctx.lineTo(5, 10);
      ctx.lineTo(-5 - size, 5);
      ctx.lineTo(-10 - size, 10);
      ctx.closePath();
      console.log("5 points");
      break;
  }
  
  //ctx.arc(0, 15, 10, 0, Math.PI, true);
  //ctx.arc(0, 10, 5, 0, Math.PI, true);
   
  ctx.strokeStyle = 'white';
  ctx.stroke();

  // // Draw engine thrust
  // if(this.thrusting) {
  //   ctx.beginPath();
  //   ctx.moveTo(0, 20);
  //   ctx.lineTo(5, 10);
  //   ctx.arc(0, 10, 5, 0, Math.PI, true);
  //   ctx.closePath();
  //   ctx.strokeStyle = 'orange';
  //   ctx.stroke();
  // }
  ctx.restore();
}
