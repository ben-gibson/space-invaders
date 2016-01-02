"use strict";

import Bounds from './Bounds';

/**
 * Component that has bounds.
 */
export default class
{

  /**
   * Constructor.
   *
   * @param  {Bounds}  bounds  The current bounds of the component.
   *
   * @return {void}
   */
  constructor(bounds)
  {

    if (!(bounds instanceof Bounds)) {
      throw new TypeError('bounds must be an instance of Bounds');
    }

    this.bounds = bounds;
  }


  /**
   * Get the current bounds.
   *
   * @return {Bounds}
   */
  getBounds()
  {
    return this.bounds;
  }
}
