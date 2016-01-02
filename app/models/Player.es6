"use strict";

import Bounds from './Bounds';
import Component from './Component';

/**
 * Player.
 */
export default class extends Component
{

  /**
   * Constructor.
   *
   * @param  {string}  name      The name.
   * @param  {Bounds}  bounds  The current bounds.
   * @param  {string}  speed     The speed.
   *
   * @return {void}
   */
  constructor(name, bounds, speed = 20)
  {
    super(bounds);

    this.name = name;
    this.speed = speed;
  }


  /**
   * Get the name.
   *
   * @return {string}
   */
  getName()
  {
    return this.name;
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
   * Shift the position to the left.
   *
   * @param {int}  minimum  The minimum value.
   *
   * @return {void}
   */
  shiftLeft(minimum = 0)
  {
    var x = this.getBounds().getX() - this.getSpeed();
    this.getBounds().setX(Math.max(x, minimum));
  }


  /**
   * Shift the position to the right.
   *
   * @param {int}  maximum  The maximum value.
   *
   * @return {void}
   */
  shiftRight(maximum = 100)
  {
    var x = this.getBounds().getX() + this.getSpeed();
    this.getBounds().setX(Math.min(x, maximum));
  }
}
