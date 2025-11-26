
import './constants.mjs';
import './particle.mjs';
import { Simulation } from './simulation.mjs';
import { World } from './world.mjs';

/**
 * 
 */
export class WorldController {

    /**
     * 
     * @param {Simulation} simulation The simulation data.
     * @param {World} world The ongoing state of the world.
     */
    constructor(simulation,world) {
        this.simulation = new Simulation()
        this.world = new World()
    }

    /**
     * 
     * @param {Particle} particle 
     */
    addParticle(particle) {
        this.simulation.particleList.push(particle)
    }
}
