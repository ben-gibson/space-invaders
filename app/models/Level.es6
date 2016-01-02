"use strict";

/**
 * Level.
 */
export default class
{

  /**
   * Constructor.
   *
   * @param  {int}  enemyCount  The number of enemies for this level.
   * @param  {int}  speed       The speed of the enemies.
   *
   * @return {void}
   */
  constructor(enemyCount, speed = 20)
  {
    this.enemyCount = enemyCount;
    this.speed = speed;
  }


  /**
   * Get the enemy speed.
   *
   * @return {int}
   */
  getEnemySpeed() {
    return this.speed;
  }


  /**
   * Get enemy count.
   *
   * @return {int}
   */
  getEnemyCount() {
    return this.enemyCount;
  }
}
