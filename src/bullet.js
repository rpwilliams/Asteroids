"use strict";

const MS_PER_FRAME = 1000/8;

/**
 * @module exports the Bullet class
 */
module.exports = exports = Bullet;

/**
 * @constructor Bullet
 * Creates a new Bullet object
 * @param {Postition} position object specifying an x and y
 */
function Bullet(position, canvas, angle) {
  this.worldWidth = canvas.width;
  this.worldHeight = canvas.height;
  
  this.active = true;
  this.height = 3;
  this.width = 3;
  this.speed = 5;
  this.color = "#ffffff";

  this.position = {
    x: position.x,
    y: position.y
  };

  this.velocity = {
    x: Math.sin(angle) * this.speed,
    y: Math.cos(angle) * this.speed
  }

  this.inBounds = function() {
    console.log("inbounds is being called!");
    return this.position.x >= 0 && this.position.x <= this.worldWidth &&
      this.position.y >= 0 && this.position.y <= this.worldHeight;
  }
}



/**
 * @function updates the Bullet object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Bullet.prototype.update = function(time) {
  this.position.x -= this.velocity.x;
  this.position.y -= this.velocity.y;

  this.active = this.active && this.inBounds;
}

/**
 * @function renders the Bullet into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Bullet.prototype.render = function(time, ctx) {
  ctx.fillStyle = this.color;
  ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
}
