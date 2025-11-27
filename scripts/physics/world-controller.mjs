
import './constants.mjs';
import { Particle } from './particle.mjs';
import { Simulation } from './simulation.mjs';
import { Timer } from '../common/timer.mjs';

/**
 * 
 */
export class WorldController {

    /**
     * 
     * @param {Simulation} simulation The simulation data.
     * @param {Timer} timer
     */
    constructor(simulation,timer) {
        this.simulation = simulation
        this.timer = timer
    }

    reset() {
        this.simulation.particleList = []
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
        for (const key in this.simulation.particleList) {
            const particle = this.simulation.particleList[key]
            const radius = particle.props.collisionRadius

            context.beginPath();
            context.ellipse(particle.x, particle.y, radius, radius, 0, 0, 2*Math.PI);
            context.closePath();
            context.fillStyle = particle.props.element.renderColor;
            context.fill();
        }
    }
}
