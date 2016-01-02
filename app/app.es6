"use strict";

import Level from './models/Level';
import Player from './models/Player';
import Bounds from './models/Bounds';
import Bullet from './models/Bullet';
import Enemy from './models/Enemy';
import BoundsHelper from './helper/BoundsHelper';
import Util from './helper/Util';

var Game = {};

Game.CANVAS_PADDING = 20;

Game.MINOR_TICK_EVENT = 'minor-tick';
Game.MAJOR_TICK_EVENT = 'major-tick';

Game.BULLET_WIDTH  = 1;
Game.BULLET_HEIGHT = 10;

Game.LEFT_KEY  = 37;
Game.RIGHT_KEY = 39;
Game.SPACE_KEY = 32;


/**
 * Initialize game.
 *
 * @return {void}
 */
Game.init = function(level)
{

  if (!(level instanceof Level)) {
    throw new TypeError('level must be an instance of Level');
  }

  this.level = level;

  this.bullets = [];
  this.enemies = [];

  this.keyState = {};
  this.keyState[this.LEFT_KEY] = false;
  this.keyState[this.RIGHT_KEY] = false;
  this.keyState[this.SPACE_KEY] = false;

  this.enemyCount = this.level.getEnemyCount();
  this.elapsedSeconds = 0;
  this.survivingEnemies = 0;
  this.score = 0;

  this.setCanvasSize();
  this.initaliseEventListeners();

  this.start();
};


/**
 * Begin the game loop.
 *
 * @return {void}
 */
Game.start = function()
{

  this.minorTickInterval = window.setInterval(() => {
    window.dispatchEvent(new Event(this.MINOR_TICK_EVENT));
    this.drawCanvas();
  }, 50);

  this.majorTickInterval = window.setInterval(() => {
    window.dispatchEvent(new Event(this.MAJOR_TICK_EVENT));
    this.incrementTime();
  }, 1000);
};


/**
 * Set the canvas size based on the window.
 *
 * @return {void}
 */
Game.setCanvasSize = function()
{
  this.getCanvas().width  = window.innerWidth - 5;
  this.getCanvas().height = window.innerHeight - 5;
};


/**
 * Initialize the event listeners.
 *
 * @return {void}
 */
Game.initaliseEventListeners = function()
{
  this.initaliseEnemyEventsListeners();
  this.initaliseBulletEventsListeners();
  this.initalisePlayerEventsListeners();

  window.addEventListener(this.MINOR_TICK_EVENT, () => {
      if (this.enemyCount === 0 && this.enemies.length === 0) {
        this.complete();
      }
  });
};


/**
 * Initialize the player event listeners.
 *
 * @return {void}
 */
Game.initalisePlayerEventsListeners = function()
{
  document.addEventListener("keydown", (event) => {

    if (event.keyCode === this.LEFT_KEY) {
      this.keyState[this.LEFT_KEY] = true;
    } else if (event.keyCode === this.RIGHT_KEY) {
      this.keyState[this.RIGHT_KEY] = true;
    } else if (event.keyCode === this.SPACE_KEY) {
      this.keyState[this.SPACE_KEY] = true;
    }
  });

  document.addEventListener("keyup", (event) => {

    if (event.keyCode === this.LEFT_KEY) {
      this.keyState[this.LEFT_KEY] = false;
    } else if (event.keyCode === this.RIGHT_KEY) {
      this.keyState[this.RIGHT_KEY] = false;
    } else if (event.keyCode === this.SPACE_KEY) {
      this.keyState[this.SPACE_KEY] = false;
    }
  });

  window.addEventListener(this.MINOR_TICK_EVENT, () => {

    if (this.keyIsPressed(this.LEFT_KEY)) {
        this.getPlayer().shiftLeft(this.getCanvas().getBoundingClientRect().left);
    } else if (this.keyIsPressed(this.RIGHT_KEY)) {
      this.getPlayer().shiftRight(this.getCanvas().getBoundingClientRect().right - this.getPlayer().getBounds().getWidth());
    }

    if (this.keyIsPressed(this.SPACE_KEY)) {
      this.addBullet(new Bounds(
        this.getPlayer().getBounds().getX() + (this.getPlayer().getBounds().getWidth() / 2),
        this.getPlayer().getBounds().getY(),
        this.BULLET_WIDTH,
        this.BULLET_HEIGHT
      ));
    }
  });
};


/**
 * Initialize the bullet event listeners.
 *
 * @return {void}
 */
Game.initaliseBulletEventsListeners = function()
{
  window.addEventListener(this.MINOR_TICK_EVENT, (event) => {

    this.bullets.forEach((bullet, index) => {

      if (BoundsHelper.isOutOfBounds(this.getCanvas(), bullet)) {
          this.removeBullet(index);
          return;
      }

        bullet.shiftUp();
    });
  });
};


/**
 * Initialize the bullet event listeners.
 *
 * @return {void}
 */
Game.initaliseEnemyEventsListeners = function()
{
  window.addEventListener(this.MAJOR_TICK_EVENT, (event) => {

    var enemiesToAdd = Math.ceil(this.elapsedSeconds / 10);

    while(this.enemyCount > 0 && enemiesToAdd > 0) {

      var icon = this.getEnemyIcon();

      this.addEnemy(new Bounds(
        Util.random(0, this.getCanvas().width),
        icon.height,
        icon.width,
        icon.height
      ));

      this.enemyCount--;
      enemiesToAdd--;
    }
  });

  window.addEventListener(this.MINOR_TICK_EVENT, (event) => {

    this.enemies.forEach((enemy, index) => {

      if (BoundsHelper.isOutOfBounds(this.getCanvas(), enemy)) {
          this.removeEnemy(index);
          this.survivingEnemies++;

          if (this.survivingEnemies > (this.level.getEnemyCount() / 2)) {
            this.gameOver();
          }

          return;
      }

      if (BoundsHelper.hasCollided(this.getPlayer(), enemy)) {
          this.gameOver();
          return;
      }

      this.bullets.forEach((bullet, bulletIndex) => {
          if (BoundsHelper.hasCollided(bullet, enemy)) {
            this.updateScore(this.score + 10);
            this.removeEnemy(index)
            this.removeBullet(bulletIndex)
          }
      });

      enemy.shiftDown();
    });
  });
};


/**
 * Lazy load the player.
 *
 * @return {Player}
 */
Game.getPlayer = function()
{
  if (!this.player) {

    var bounds = new Bounds(
      (this.getCanvas().width / 2) - (this.getPlayerIcon().width / 2),
      (this.getCanvas().height - this.getPlayerIcon().height) - this.CANVAS_PADDING,
      this.getPlayerIcon().width,
      this.getPlayerIcon().height
    );

    this.player = new Player('Ben Gibson', bounds);
  }

  return this.player;
};


/**
 * Lazy load the canvas.
 *
 * @return {HTMLElement}
 */
Game.getCanvas = function ()
{
  if (!this.canvas) {

    var canvas = document.getElementById("canvas");

    if (!(canvas instanceof HTMLCanvasElement)) {
        throw new TypeError('canvas must be an instance of HTMLCanvasElement');
    }

    this.canvas = canvas;
  }

  return this.canvas;
};


/**
 * Draw the canvas.
 *
 * @return {void}.
 */
Game.drawCanvas = function()
{
  var context = this.getCanvas().getContext('2d');

  context.clearRect(0, 0, this.getCanvas().width, this.getCanvas().height);

  var icon = this.getPlayerIcon();

  context.drawImage(
    icon,
    this.getPlayer().getBounds().getX(),
    this.getPlayer().getBounds().getY(),
    this.getPlayer().getBounds().getWidth(),
    this.getPlayer().getBounds().getHeight()
  );

  this.bullets.forEach((bullet) => {
    context.fillStyle="#FFFFFF";
    context.fillRect(
      bullet.getBounds().getX(),
      bullet.getBounds().getY(),
      bullet.getBounds().getWidth(),
      bullet.getBounds().getHeight()
    );
  });

  this.enemies.forEach((enemy) => {
    context.drawImage(
      this.getEnemyIcon(),
      enemy.getBounds().getX(),
      enemy.getBounds().getY(),
      enemy.getBounds().getWidth(),
      enemy.getBounds().getHeight()
    );
  });
};


/**
 * Get the player image icon.
 *
 * @return {HTMLImageElement}
 */
Game.getPlayerIcon = function()
{
    var icon = document.getElementById("player");

    if (!(icon instanceof HTMLImageElement)) {
      throw new TypeError('player icon must be an instance of HTMLImageElement');
    }

    return icon;
};


/**
 * Get the enemy image icon.
 *
 * @return {HTMLImageElement}
 */
Game.getEnemyIcon = function()
{
    var icon = document.getElementById("enemy");

    if (!(icon instanceof HTMLImageElement)) {
      throw new TypeError('enemy icon must be an instance of HTMLImageElement');
    }

    return icon;
};


/**
 * Add a new bullet.
 *
 * @param {Bounds}  bounds  The bullets current bounds.
 *
 * @return {void}
 */
Game.addBullet = function(bounds)
{
  this.bullets.push(new Bullet(bounds));
};


/**
 * Remove a bullet.
 *
 * @param  {int} index The index of the bullet to remove.
 *
 * @return {void}
 */
Game.removeBullet = function(index)
{
  this.bullets.splice(index, 1);
};


/**
 * Add a new enemy.
 *
 * @param {Bounds}  bounds  The enemies current bounds.
 *
 * @return {void}
 */
Game.addEnemy = function(bounds)
{
  this.enemies.push(new Enemy(bounds));
};


/**
 * Remove a enemy.
 *
 * @param  {int} index The index of the enemy to remove.
 *
 * @return {void}
 */
Game.removeEnemy = function(index)
{
  this.enemies.splice(index, 1);
};


/**
 * Is a given key pressed.
 *
 * @param  {int}  key  The unique key id.
 *
 * @return {boolean}
 */
Game.keyIsPressed = function(key)
{
  if (!(key in this.keyState)) {
      throw new TypeError(`No state is being tracked for key '${key}'.`);
  }

  return this.keyState[key];
};


/**
 * Update the score.
 *
 * @param {value} value  The new score value.
 *
 * @return {void}
 */
Game.updateScore = function(value)
{
  this.score = value;
  document.getElementById('score').innerHTML = this.score;
};


/**
 * Increment the elapsed time in seconds.
 *
 * @return {void}
 */
Game.incrementTime = function()
{
  this.elapsedSeconds++;
  document.getElementById('time').innerHTML = this.elapsedSeconds;
};


/**
 * Complete game.
 *
 * @return {void}
 */
Game.complete = function()
{
  this.stop();
  document.getElementById('mission-complete-title').style.display = "initial";
};


/**
 * Game Over.
 *
 * @return {void}
 */
Game.gameOver = function()
{
  this.stop();
  document.getElementById('game-over-title').style.display = "initial";
};


/**
 * Stop the game loop.
 *
 * @return {void}
 */
Game.stop = function()
{
  clearInterval(this.minorTickInterval);
  clearInterval(this.majorTickInterval);
};


// begin
window.onload = () => {
  Game.init(new Level(50));
};
