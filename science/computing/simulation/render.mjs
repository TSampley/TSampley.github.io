/*
 * Copyright (c) 2026 Taush Sampley
 * This software is released under the GPL-3.0 License.
 * See LICENSE file in the project root for full license information.
 * 
 * render.mjs
 */

/**
 * @abstract
 * @template {any} Subject
 */
export class Render2D {
  /**
   * Draws the environment to the canvas context.
   * 
   * @abstract
   * @param {CanvasRenderingContext2D} context HTML Canvas simple context.
   * @param {Subject} subject The subject to render.
   * @param {number} offset Seconds offset since the last calculation frame.
   */
  render(context,subject,offset) {}
}

/**
 * @abstract
 * @template {any} Subject
 */
export class Render3D {
  /**
   * Draws the environment to the webgl context.
   * 
   * @abstract
   * @param {WebGL2RenderingContext} context HTML Canvas WebGL 2 Context.
   * @param {Subject} subject The subject to render.
   * @param {number} offset Seconds offset since the last calculation frame.
   */
  render(context,subject,offset) {}
}
