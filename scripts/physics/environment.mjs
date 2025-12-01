import { NoOp } from '../common/fns.mjs'
import { GRAVITY_EARTH_ACCELERATION } from './constants.mjs'

/**
 * 
 */
export class Environment {
    /**
     * 
     * @param {number} width 
     * @param {number} height 
     * @param {()=>void} onCollide 
     * @param {()=>void} onBounce 
     */
    constructor(width,height,onCollide,onBounce) {
        /** @type {(number)=>void} */
        this.onSetWidth = NoOp.f1
        this.width = width
        /** @type {(number)=>void} */
        this.onSetHeight = NoOp.f1
        this.height = height

        this.gravity = GRAVITY_EARTH_ACCELERATION
        /** @type {()=>void} */
        this.onCollide = NoOp.f0
        /** @type {()=>void} */
        this.onBounce = NoOp.f0
    }

    #width = 0
    set width(value) {
        this.#width = value
        this.onSetWidth()
    }
    get width() { return this.#width }
    #height = 0
    set height(value) {
        this.#height = value
        this.onSetHeight()
    }
    get height() { return this.#height }
}
