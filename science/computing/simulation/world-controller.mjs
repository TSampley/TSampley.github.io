
import '../../physics/mechanics/constants.mjs';
import { Particle } from '../../physics/mechanics/particle.mjs';
import { Simulation } from './simulation.mjs';
import { Timer } from '../../../scripts/common/timer.mjs';

import { CPKColorScheme } from '../../chemistry/cpk-coloring.mjs'

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

        this.colorScheme = CPKColorScheme
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
        this.simulation.environment.forceMatrix.gravity.isEnabled = value
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} context 
     */
    drawParticles(context) {
        for (const particle of this.simulation.particleList) {
            particle.draw(context,this.colorScheme)
        }
    }
}
