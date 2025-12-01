import { NoOp } from '../../../scripts/common/fns.mjs'
import { COULOMB_CONSTANT, GRAVITY_EARTH_ACCELERATION } from '../../physics/mechanics/constants.mjs'
import { Particle } from '../../physics/mechanics/particle.mjs'


class Force {
    /**
     * 
     * @param {number} value 
     */
    constructor(value) {
        this.isEnabled = true
        this.value = value
    }
}

export class EnvironmentForce extends Force {
    constructor(value) { super(value) }
    /**
     * 
     * @param {number} dt The span of time to simulate over.
     * @param {Particle} subject The particle under influence of the force.
     */
    applyForce(dt,subject) {}
}
/**
 * 
 */
export class InterparticleForce extends Force {
    constructor(value) { super(value) }
    applyForce(dt,alpha,beta) {}
}

export class CoulombForce extends InterparticleForce {
    constructor(value) {
        super(value)
    }

    applyForce(dt,alpha,beta) {
        // Calculate vector between particles for relative forces
        const deltaX = beta.x - alpha.x
        const deltaY = beta.y - alpha.y
        // TODO: explore soft-core potentials
        //   https://pmc.ncbi.nlm.nih.gov/articles/PMC3187911/;
        //   https://www.sciencedirect.com/science/article/abs/pii/S1093326303001967 
        const deltaSqr = deltaX*deltaX + deltaY*deltaY;
        const deltaMag = Math.sqrt(deltaSqr)

        // Coulomb Force/Potential
        const alphaCharge = this.props.charge
        const betaCharge = beta.props.charge
        if (alphaCharge != 0 && betaCharge != 0) {
            const force = -this.value*alphaCharge*betaCharge/deltaSqr
            const forceX = force * deltaX / deltaMag
            const forceY = force * deltaY / deltaMag

            alpha.fx += forceX
            alpha.fy += forceY
            beta.fx -= forceX
            beta.fy -= forceY
        }
    }
}

/**
 * https://en.wikipedia.org/wiki/Lennard-Jones_potential
 */
export class LennardJonesPotential extends InterparticleForce {
    constructor(value) {
        super(value)
    }

    applyForce(dt,alpha,beta) {
        // Calculate vector between particles for relative forces
        const deltaX = beta.x - alpha.x
        const deltaY = beta.y - alpha.y
        // TODO: explore soft-core potentials
        //   https://pmc.ncbi.nlm.nih.gov/articles/PMC3187911/;
        //   https://www.sciencedirect.com/science/article/abs/pii/S1093326303001967 
        const deltaSqr = deltaX*deltaX + deltaY*deltaY;
        const deltaMag = Math.sqrt(deltaSqr)

        // Lennard-Jones Potential
        const epsilon = 10 // depth of potential well
        const sigma = 10 // finite distance where potential is zero
        const sigmaOverDistance = sigma / deltaMag
        const attraction = -(sigmaOverDistance ** 6)
        const repulsion = sigmaOverDistance ** 12
        const total = 4*epsilon*(repulsion + attraction)
        const forceX = total * deltaX / deltaMag
        const forceY = total * deltaY / deltaMag

        alpha.fx += forceX
        alpha.fy += forceY
        beta.fx -= forceX
        beta.fy -= forceY
    }
}

export class Gravity extends EnvironmentForce {
    constructor(value) {
        super(value)
    }

    applyForce(dt,subject) {
        subject.fx += this.value / subject.mass
    }
}

export class ElasticBoundary extends EnvironmentForce {
    constructor(value,width,height) {
        super(value)
        this.width = width
        this.height = height
    }

    applyForce(dt,subject) {

        if (subject.x < 0) {

        } else if (subject.x > this.width) {

        }

        if (subject.y < 0) {
            
        } else if (subject.y > this.height) {

        }
    }
}

export class Drag extends EnvironmentForce {
    constructor(value) {
        super(value)
        this.restitution = 1 - value
    }

    applyForce(dt,subject) {
        subject.fx += this.value * subject.vx
        subject.fy += this.value * subject.vy
    }
}

export class ForceMatrix {
    constructor() {
        this.boundaries = new ElasticBoundary(0.99,500,500)
        this.drag = new Drag(0.01)
        this.gravity = new EnvironmentForce(GRAVITY_EARTH_ACCELERATION * 1E-3)

        this.charge = new InterparticleForce(COULOMB_CONSTANT)
        this.lennardJones = new LennardJonesPotential(1.0)
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

        this.forceMatrix = forceMatrix

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
            this.forceMatrix.charge,
            this.forceMatrix.lennardJones
        ]
    }

    environmentForces() {
        return [
            this.forceMatrix.boundaries,
            this.forceMatrix.drag,
            this.forceMatrix.gravity
        ]
    }
}
