

import { Environment } from './environment.mjs';

import { Timer } from '../../../js/common/timer.mjs'
import { Entity } from './entity.mjs';

/**
 * 
 * A `Simulation` is responsible for the time-keeping
 * mechanisms in order to simulate an {@link Environment}.
 * 
 * @type {E extends Environment}
 */
export class Simulation {

    /**
     * 
     * @param {Environment} environment 
     */
    constructor(environment) {
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
    }

    #isRunning = false
    start() {
        this.#isRunning = true
        requestAnimationFrame(this.#step)
    }

    #step(delta) {

    }
}
