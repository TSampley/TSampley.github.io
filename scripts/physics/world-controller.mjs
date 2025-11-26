
import './constants.mjs';
import { Particle } from './particle.mjs';
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

    /**
     * 
     * @param {CanvasRenderingContext2D} context 
     */
    drawParticles(context) {
        for (const particle in this.simulation.particleList) {
            context.beginPath();
            context.ellipse(particle.x, particle.y, 10, 10, 0, 0, 2*Math.PI);
            context.closePath();
            context.fillStyle = particle.props.renderColor;
            context.fill();
        }
    }
}
