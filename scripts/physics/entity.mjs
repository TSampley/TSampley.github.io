
import { UnimplementedError } from '../common/errors.mjs'
import { Environment } from '../physics/environment.mjs'

/**
 * A {@link Simulation} consists of an {@link Environment} and 
 * the `Entity` instances that populate it.
 */
export class Entity {
    /**
     * Progresses the entity by `dt` in the given `environment`.
     * @param {number} dt Change in time for this simulation step.
     * @param {Environment} environment The encompassing {@link Environment}
     */
    step(dt,environment) {
        throw new UnimplementedError(this,'step')
    }

    /**
     * Draws the entity within the given rendering context.
     * @param {CanvasRenderingContext2D} context 
     */
    draw(context) {
        throw new UnimplementedError(this,'draw')
    }
}
