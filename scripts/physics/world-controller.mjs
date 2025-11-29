
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
        this.onSetDisplay = (display)=>{}
        this.onSetCharge = (charge)=>{}
    }

    reset() {
        this.simulation.particleList = []
    }

    /**
     * @type {Particle}
     */
    #particle = null
    setParticle(particle) {
        this.#particle = particle
        this.onSetDisplay(particle.props.element.name)
    }

    setCharge(charge) {
        this.#particle.props.charge = charge
        this.onSetCharge(charge)
    }
    incrementCharge() {
        this.setCharge(this.#particle.props.charge + 1)
    }
    decrementCharge() {
        this.setCharge(this.#particle.props.charge - 1)
    }

    /**
     * 
     * @param {number} x 
     * @param {number} y 
     */
    spawn(x,y) {
        const newParticle = new Particle(x,y,this.#particle.props.clone())
        this.addParticle(newParticle)
    }

    /**
     * 
     * @param {Particle} particle 
     */
    addParticle(particle) {
        this.simulation.particleList.push(particle)
    }

    setGravityOn(value) {
        this.simulation.gravityOn = value
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
