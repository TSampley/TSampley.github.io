
import { COULOMB_CONSTANT, GRAVITY_EARTH_ACCELERATION } from '../../physics/mechanics/constants.mjs'

import { ElasticBoundary } from '../../computing/simulation/boundary.mjs'
import { Drag } from '../../physics/mechanics/drag.mjs'
import { Gravity } from '../../physics/mechanics/gravity.mjs'
import { CoulombForce } from '../../physics/mechanics/coulomb.mjs'
import { LennardJonesPotential } from '../../chemistry/computational/lennard-jones.mjs'
import { Force } from '../../physics/mechanics/force.mjs'

/**
 * // TODO: move back to computing domain to generalize environments/simulations
 * 
 * A collection of {@link Force}
 */
export class ForceMatrix {
    constructor(boundaries,drag,gravity,coulomb,lennardJones) {
        this.boundaries = boundaries
        this.drag = drag
        this.gravity = gravity

        this.coulomb = coulomb
        this.lennardJones = lennardJones
    }
}

export function forceMatrixSim(boundaryRetention,drag,gravity,coulomb,lennardJones) {
    return new ForceMatrix(
        new ElasticBoundary(boundaryRetention,500,500),
        new Drag(drag),
        new Gravity(gravity),
        new CoulombForce(coulomb),
        new LennardJonesPotential(lennardJones)
    )
}
/**
 * 
 * @returns A {@link ForceMatrix} with simulation values adjusted for
 * chemical reaction scale.
 */
export function forceMatrixChemistry() {
    return new ForceMatrix(
        new ElasticBoundary(0.99,600E-12,500E-12),
        new Drag(1E46),
        new Gravity(GRAVITY_EARTH_ACCELERATION * 1E-5),
        new CoulombForce(COULOMB_CONSTANT*1E6),
        new LennardJonesPotential(1.0)
    )
}
