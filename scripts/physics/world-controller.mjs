
import './constants.mjs';
import './particle.mjs';
import './simulation.mjs';
import './world.mjs';

/**
 * 
 */
export class WorldController {

    constructor(simulation,world) {
        this.simulation = new Simulation()
        this.world = new World()
    }

    /**
     * 
     * @param {Particle} particle 
     */
    addParticle(particle) {
        
    }
}
