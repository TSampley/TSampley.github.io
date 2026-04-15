

/**
 * @typedef { import('/science/physics/mechanics/particle.mjs').Particle } Particle
 */

/**
 * A generic force with scalar property that can be disabled.
 */
export class Force {
  /**
   * 
   * @param {number} value 
   * @param {boolean} isEnabled 
   */
  constructor(value,isEnabled=true) {
    this.value = value
    this.isEnabled = isEnabled
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  applyForce(dt,subject) {}
}

/**
 * 
 */
export class InterparticleForce extends Force {
  constructor(value) { super(value) }
  /**
   * 
   * @param {number} dt The span of time to simulate over.
   * @param {Particle} alpha The first particle under influence of the other.
   * @param {Particle} beta The second particle under influence of the first.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  applyForce(dt,alpha,beta) {}
}
