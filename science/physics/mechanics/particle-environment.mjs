import { Size } from "../../../js/common/geom.mjs";
import { Observable, single } from "../../../js/common/observables.mjs";
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
    /** @type {Observable<ForceMatrix>} */
    this.forceMatrix = single(forceMatrix)
    console.log("Creating force matrix observable with value: " + JSON.stringify(forceMatrix))
    console.log("Property" + JSON.stringify(this.forceMatrix.value))
    this.timeScale = 1E-6
    this.hardCollisions = true
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
