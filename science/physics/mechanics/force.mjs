
import { Particle } from '../../physics/mechanics/particle.mjs'

/**
 * 
 */
export class Force {
    /**
     * 
     * @param {number} value 
     */
    constructor(value) {
        this.value = value
        this.isEnabled = true
    }
}

/**
 * 
 */
export class EnvironmentForce extends Force {
    constructor(value) { super(value) }
    /**
     * 
     * @param {number} dt The span of time to simulate over.
     * @param {Particle} subject The particle under influence of the force.
     */
    applyForce(dt,subject) {}
}

/**
 * 
 */
export class InterparticleForce extends Force {
    constructor(value) { super(value) }
    applyForce(dt,alpha,beta) {}
}
