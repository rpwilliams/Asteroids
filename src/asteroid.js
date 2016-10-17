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
function Asteroid(position, canvas, randomNumPoints, size, angle) {
  this.worldWidth = canvas.width;
  this.worldHeight = canvas.height;
  this.initialAcceleration = true; 
  this.state = "moving";
  this.randomNumPoints = randomNumPoints;

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
      this.size = 20;
      break;
  }

  // Calculate the height and width of the asteroid
  switch(randomNumPoints)
  {
    case 3:
      this.height = (20 + this.size) - (15);
      this.width = (10 + this.size) - (5 + this.size);
      break;
    case 4:
      this.height = (20 + this.size) - 5;
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
  this.angle = angle;
  this.radius  = 64;
  //this.thrusting = false;

  // if(right && left)
  // {
  //   this.steerRight = true;
  //   this.steerLeft = true;
  // }
  // else if(left)
  // {
  //   this.steerLeft = true;
  //   this.steerRight = false;
  // }
  // else if(right)
  // {
  //   this.steerRight = true;
  //   this.steerLeft = false;
  // }
  this.steerRight = true;
  this.steerLeft = true;
  

  // Calculate the mass
  // this.mass = this.size * this.this.randomNumPoints;
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
Asteroid.prototype.render = function(time, ctx, color) {
  ctx.save();

  // Draw Asteroid's ship
  ctx.translate(this.position.x, this.position.y);
  ctx.rotate(-this.angle);
  
  ctx.beginPath();
  var size = this.size;
  var numPoints = this.randomNumPoints
  
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
  
  //ctx.arc(0, 15, 10, 0, Math.PI, true);
  //ctx.arc(0, 10, 5, 0, Math.PI, true);
   
  ctx.strokeStyle = color;
  ctx.stroke();

  

  ctx.restore();
}

