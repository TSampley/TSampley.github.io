/*
 * Copyright (c) 2026 Taush Sampley
 * This software is released under the GPL-3.0 License.
 * See LICENSE file in the project root for full license information.
 * 
 * entity.mjs
 */

import { Render2D } from './render.mjs'
import { UnimplementedError } from '/js/common/errors.mjs'
import { Point } from '/js/common/geom.mjs'

/**
 * An `Entity` is the basic discrete unit of interaction in a 
 * simulated environment.
 * @abstract
 */
export class Entity {

  static NO_POSITION = new Point(Number.NaN,Number.NaN)

  /**
   * @param {Point} position 
   */
  constructor(position,velocity) {
    this.position = position || Entity.NO_POSITION
    this.velocity = velocity
  }

  /**
   * Progresses the entity's internal state by `delta`.
   * @param {number} delta Change in time for this simulation step.
   * @abstract
   */
  step(delta) {
    throw new UnimplementedError(this,'step')
  }
}

/**
 * A simple renderer for an `Entity` that draws a black circle at the
 * entity's position.
 */
export class EntityRender extends Render2D {
  
  /**
   * @param {CanvasRenderingContext2D} context 
   * @param {Entity} subject
   * @param {number} offset 
   */
  render(context,subject,offset) {
    if (isNaN(subject.position.x) || isNaN(subject.position.y)) {
      return
    }
    context.fillStyle = 'black'
    if (subject.velocity) {
      context.ellipse(subject.position.x + subject.velocity.x * offset, subject.position.y + subject.velocity.y * offset, 5, 5, 0, 0, 2 * Math.PI)
    } else {
      context.ellipse(subject.position.x, subject.position.y, 5, 5, 0, 0, 2 * Math.PI)
    }
    context.fill()
  }
}
