import { Size } from "../../../js/common/geom.mjs";
import { single } from "../../../js/common/observables.mjs";
import { ForceMatrix } from "../../chemistry/computational/force-matrix.mjs";
import { Environment } from "../../computing/simulation/environment.mjs";

/**
 */
export class ParticleEnvironment extends Environment {
  /**
   * @param {Size} size 
   * @param {ForceMatrix} forceMatrix 
   */
  constructor(size,forceMatrix) {
    super(size)
    this.forceMatrix = single(forceMatrix)
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
