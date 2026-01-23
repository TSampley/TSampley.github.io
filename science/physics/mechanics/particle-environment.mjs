import { Environment } from "../../computing/simulation/environment.mjs";

/**
 * TODO: move particle-specific implementation in simulation here
 */
export class ParticleEnvironment extends Environment {

  constructor(size) {
    super(size)
  }

  step(delta) {

  }

  draw(context,offset) {
    
  }

  particleForces() {
      return [
          this.forceMatrix.value.coulomb,
          this.forceMatrix.value.lennardJones
      ]
  }

  environmentForces() {
      return [
          this.forceMatrix.value.boundaries,
          this.forceMatrix.value.drag,
          this.forceMatrix.value.gravity
      ]
  }
}
