import { NoOp } from '../../../js/common/fns.mjs'
import { Observable, single } from '../../../js/common/observables.mjs'

import { COULOMB_CONSTANT, GRAVITY_EARTH_ACCELERATION } from '../../physics/mechanics/constants.mjs'

import { ElasticBoundary } from './boundary.mjs'
import { Drag } from '../../physics/mechanics/drag.mjs'
import { Gravity } from '../../physics/mechanics/gravity.mjs'
import { CoulombForce } from '../../physics/mechanics/coulomb.mjs'
import { LennardJonesPotential } from '../../chemistry/computational/lennard-jones.mjs'
import { Force } from '../../physics/mechanics/force.mjs'

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

/**
 * TODO: rename Environment=>DynamicEnvironment; BaseEnvironment=>Environment
 */
export class BaseEnvironment {
    constructor() {
        this.width = width
        this.height = height
    }
}

/**
 * 
 */
export class Environment {
    /**
     * 
     * @param {number} width 
     * @param {number} height 
     * @param {ForceMatrix} forceMatrix
     * @param {()=>void} onCollide 
     * @param {()=>void} onBounce 
     */
    constructor(width,height,forceMatrix,onCollide=NoOp.f0,onBounce=NoOp.f0) {
        /** @type {(number)=>void} */
        this.onSetWidth = NoOp.f1
        this.width = width
        /** @type {(number)=>void} */
        this.onSetHeight = NoOp.f1
        this.height = height

        /** @type {Observable<ForceMatrix>} */
        this.forceMatrix = single(forceMatrix)
        this.timeScale = 1E-6
        this.hardCollisions = true

        /** @type {()=>void} */
        this.onCollide = onCollide
        /** @type {()=>void} */
        this.onBounce = onBounce
    }

    #width = 0
    set width(value) {
        this.#width = value
        this.onSetWidth()
    }
    get width() { return this.#width }
    #height = 0
    set height(value) {
        this.#height = value
        this.onSetHeight()
    }
    get height() { return this.#height }

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
