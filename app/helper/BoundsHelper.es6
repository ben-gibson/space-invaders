"use strict";

import Component from '../models/Component';

/**
 * Bounds helper.
 */
export default class
{

  /**
   * Is the component out of an elements bounds.
   *
   * @param  {HTMLElement}  element    The element whose bounds we want to check.
   * @param  {Component}    component  The component that could be out of bounds.
   *
   * @return {Boolean}
   */
  static isOutOfBounds(element, component)
  {
    if (!(element instanceof HTMLElement)) {
      throw new TypeError('element must be an instance of HTMLElement');
    }

    if (!(component instanceof Component)) {
      throw new TypeError('component must be an instance of Component');
    }

    var bounds = element.getBoundingClientRect();

    return (
      (component.getBounds().getX() < bounds.left) ||
      (component.getBounds().getX() > bounds.right) ||
      (component.getBounds().getY() > bounds.bottom) ||
      (component.getBounds().getY() < bounds.top)
    );
  }


  /**
   * Has the provided components collided.
   *
   * @param  {Component}  component1  The component.
   * @param  {Component}  component2  The component.
   *
   * @return {Boolean}
   */
  static hasCollided(component1, component2)
  {
    if (!(component1 instanceof Component)) {
      throw new TypeError('component1 must be an instance of Component');
    }

    if (!(component2 instanceof Component)) {
      throw new TypeError('component2 must be an instance of Component');
    }

    var bounds1 = component1.getBounds();
    var bounds2 = component2.getBounds();

    return (
      (bounds1.getX() < (bounds2.getX() + bounds2.getWidth())) &&
      ((bounds1.getX() + bounds1.getWidth()) > bounds2.getX()) &&
      (bounds1.getY() < (bounds2.getY() + bounds2.getHeight())) &&
      ((bounds1.getY() + bounds1.getHeight()) > bounds2.getY())
    );
  }
}
