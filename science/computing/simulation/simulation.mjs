import { Timer } from '../../../js/common/timer.mjs'
import { Entity } from './entity.mjs';
import { Environment } from './environment.mjs';

/**
 * 
 * A `Simulation` is responsible for the time-keeping
 * mechanisms in order to simulate an {@link Environment}.
 * It also retains a reference to a rendering context to
 * pass to the environment at the appropriate time.
 * 
 * @type {E extends Environment}
 */
export class Simulation {

    /**
     * 
     * @param {Environment} environment 
     * @param {CanvasRenderingContext2D} context
     */
    constructor(environment,context) {
        this.world = new Timer()
        /**
         * @type {Array<Particle>}
         */
        this.particleList = new Array()
        /**
         * @type {Array<Entity>}
         */
        this.entityList = new Array()
        this.environment = environment
        this.context = context
    }

    #isRunning = false
    start() {
        if (this.#isRunning) return;
        this.#isRunning = true
        this.#step()
    }

    #step() {
        requestAnimationFrame((tsl)=>{this.#frame(tsl)})
    }

    #lastTime = 0
    #frame(tsl) {
        if (!this.#lastTime) this.#lastTime = tsl
        const delta = (tsl - this.#lastTime) / 1000.0

        this.world.step(delta)
        this.environment.step(delta)
        this.environment.draw(this.context,0)

        if (this.#isRunning) this.#step()
    }

    stop() {
        this.#isRunning = false
    }
}
