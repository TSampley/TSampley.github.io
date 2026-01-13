import { NoOp } from "../../../js/common/fns.mjs";
import { Observable, single } from "../../../js/common/observables.mjs";
import { Environment, ForceMatrix } from "../../computing/simulation/environment.mjs";

/**
 * TODO: migrate Simulation particle step logic here
 */
class ChemEnvironment extends Environment {
  /**
   * 
   * @param {number} width 
   * @param {number} height 
   * @param {ForceMatrix} forceMatrix
   * @param {()=>void} onCollide 
   * @param {()=>void} onBounce 
   */
  constructor(width,height,forceMatrix,onCollide=NoOp.f0,onBounce=NoOp.f0) {
    super(width,height)

    /** @type {Observable<ForceMatrix>} */
    this.forceMatrix = single(forceMatrix)
    this.timeScale = 1E-6
    this.hardCollisions = true

    /** @type {()=>void} */
    this.onCollide = onCollide
    /** @type {()=>void} */
    this.onBounce = onBounce
  }

  step(delta) {

  }

  draw(context) {

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
