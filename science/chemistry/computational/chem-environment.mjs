import { NoOp } from "../../../js/common/fns.mjs";
import { Observable, single } from "../../../js/common/observables.mjs";
import { ForceMatrix } from "../computational/force-matrix.mjs"
import { ParticleEnvironment } from "../../physics/mechanics/particle-environment.mjs";
import { UnimplementedError } from "../../../js/common/errors.mjs";

/**
 * TODO: migrate Simulation particle step logic here
 */
export class ChemEnvironment extends ParticleEnvironment {
  /**
   * 
   * @param {number} width 
   * @param {number} height 
   * @param {ForceMatrix} forceMatrix
   * @param {()=>void} onCollide 
   * @param {()=>void} onBounce 
   */
  constructor(size,forceMatrix,onCollide=NoOp.f0,onBounce=NoOp.f0) {
    super(size,forceMatrix)

    /** @type {()=>void} */
    this.onCollide = onCollide
    /** @type {()=>void} */
    this.onBounce = onBounce
  }

  step(delta) {
    super.step(delta)
  }

  draw(context,offset) {
    super.draw(context,offset)
  }

  draw3d(webgl,offset) {
    throw new UnimplementedError('ChemEnvironment','draw3d')
  }
}
