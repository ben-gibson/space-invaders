"use strict";

/**
 * Bounds.
 */
export default class
{

  /**
   * Constructor.
   *
   * @param  {int}  x       The x coordinates.
   * @param  {int}  y       The y Coordinates.
   * @param  {int}  width   The width.
   * @param  {int}  height  The height.
   *
   * @return {void}
   */
  constructor(x, y, width, height)
  {
    this.x = x;
    this.y = y;
    this.width  = width;
    this.height = height;
  }


  /**
   * Get the x position.
   *
   * @return {int}
   */
  getX()
  {
    return this.x;
  }


  /**
   * Get the y position.
   *
   * @return {int}
   */
  getY()
  {
    return this.y;
  }


  /**
   * Get the width.
   *
   * @return {int}
   */
  getWidth() {
    return this.width;
  }


  /**
   * Get the height.
   *
   * @return {int}
   */
  getHeight() {
    return this.height;
  }


  /**
   * Set the x position.
   *
   * @param {int}  x  The x position to set.
   *
   * @return {void}
   */
  setX(x)
  {
    this.x = x;
  }


  /**
   * Set the y position.
   *
   * @param {int}  y  The y position to set.
   *
   * @return {void}
   */
  setY(y)
  {
    this.y = y;
  }
}
