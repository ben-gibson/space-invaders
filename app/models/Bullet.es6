"use strict";

import Bounds from './Bounds';
import Component from './Component';

/**
 * Bullet.
 */
export default class extends Component
{

  /**
   * Constructor.
   *
   * @param  {Bounds}  bounds  The current bounds.
   * @param  {int}     speed   The speed.
   *
   * @return {void}
   */
  constructor(bounds, speed = 20)
  {
    super(bounds);
    this.speed = speed;
  }


  /**
   * Get the speed.
   *
   * @return {int}
   */
  getSpeed()
  {
    return this.speed;
  }


  /**
   * Shift the position up.
   *
   * @return {void}
   */
  shiftUp()
  {
    this.getBounds().setY(this.getBounds().getY() - this.getSpeed());
  }
}
