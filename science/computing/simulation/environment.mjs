import { NoOp } from '../../../js/common/fns.mjs'
import { Observable, single } from '../../../js/common/observables.mjs'

import { Size } from '../../../js/common/geom.mjs'

/**
 * 
 */
export class Environment {
  /**
   * 
   * @param {Size} size 
   */
  constructor(size) {
    /** @type {Observable<Size>} */
    this.size = single(size)
    /** @type {(w:number)=>void} */
    this.onSetWidth = NoOp.f1
    /** @type {(h:number)=>void} */
    this.onSetHeight = NoOp.f1
  }

  setWidth(width) {
    this.size.value.width = width
  }

  setHeight(height) {
    this.size.value.height = height
  }

  set width(value) {
    this.size.value.width = value
    this.onSetWidth()
  }
  get width() { return this.size.value.width }

  set height(value) {
    this.size.value.height = value
    this.onSetHeight()
  }
  get height() { return this.size.value.height }

  #unimplemented(method) {
    throw new UnimplementedError('BaseEnvironment', method)
  }

  /**
   * Progresses the environment by some amount of time in seconds.
   * 
   * @param {number} delta 
   */
  step(delta) {
    this.#unimplemented('step')
  }

  /**
   * Draws the environment to the canvas context.
   * 
   * @param {CanvasRenderingContext2D} context HTML Canvas simple context.
   * @param {number} offset Seconds offset since the last calculation frame.
   */
  draw(context, offset) {
    this.#unimplemented('draw')
  }

  /**
   * Draws the environment to the webgl context.
   * 
   * @param {WebGL2RenderingContext} context HTML Canvas WebGL 2 Context.
   * @param {*} offset 
   */
  draw3d(context,offset) {
    this.#unimplemented('draw3d')
  }
}
