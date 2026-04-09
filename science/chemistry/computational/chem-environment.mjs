import { UnimplementedError } from "/js/common/errors.mjs";
import { NoOp } from "/js/common/fns.mjs";
import { ForceMatrix } from "./force-matrix.mjs";
import { ParticleEnvironment } from "/science/physics/mechanics/particle-environment.mjs";

/**
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
  constructor(size,forceMatrix,onCollide=NoOp,onBounce=NoOp) {
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
