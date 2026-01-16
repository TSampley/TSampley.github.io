import { Environment } from "../../computing/simulation/environment.mjs";

/**
 * TODO: move particle-specific implementation in simulation here
 */
export class ParticleEnvironment extends Environment {

  constructor(size) {
    super(size)
    /** @type {Array<Particle>} */
    this.particleList = new Array()
  }

  step(delta) {

  }

  draw(context,offset) {

  }
}
