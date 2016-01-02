"use strict";

/**
 * Util helper.
 */
export default class
{

  /**
   * Generate a random integer between a given range.
   *
   * @param  {int}  min  The minimum value.
   * @param  {int}  max  The maximum value.
   *
   * @return {int}
   */
  static random(min, max)
  {
    return Math.floor(Math.random() * (max - min +1)) + min;
  }
}
