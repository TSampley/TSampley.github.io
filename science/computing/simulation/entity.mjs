
import { UnimplementedError } from '../../../js/common/errors.mjs'
import { Point } from '../../../js/common/geom.mjs'

/**
 * An `Entity` is the basic discrete unit of interaction in a 
 * simulated environment.
 */
export class Entity {
    /**
     * 
     * @param {Point} position 
     */
    constructor(position) {
        this.position = position
    }

    /**
     * Progresses the entity's internal state by `delta`.
     * @param {number} delta Change in time for this simulation step.
     */
    step(delta) {
        throw new UnimplementedError(this,'step')
    }

    /**
     * Draws the entity within the given rendering context.
     * TODO: consider moving to different rendering objects
     * @param {CanvasRenderingContext2D} context 
     */
    draw(context) {
        throw new UnimplementedError(this,'draw')
    }
}
