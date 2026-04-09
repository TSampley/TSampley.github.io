import { NoOp } from '/js/common/fns.mjs'
import { Size } from '/js/common/geom.mjs'
import { Observable, single } from '/js/common/observables.mjs'

/**
 * 
 */
export class Environment {
  /**
   * 
   * @param {Size} size 
   */
  constructor(size) {
    console.assert(size != undefined, "Size must be defined")
    /** @type {Observable<Size>} */
    this.size = single(size)
    /** @type {(w:number)=>void} */
    this.onSetWidth = NoOp
    /** @type {(h:number)=>void} */
    this.onSetHeight = NoOp
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
    throw new UnimplementedError('Environment', method)
  }

  /**
   * Progresses the environment by some amount of time in seconds.
   * 
   * @param {number} delta 
   * @abstract
   */
  step(delta) {
    this.#unimplemented('step')
  }
}
