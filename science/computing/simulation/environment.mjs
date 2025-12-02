import { NoOp } from '../../../scripts/common/fns.mjs'
import { COULOMB_CONSTANT, GRAVITY_EARTH_ACCELERATION } from '../../physics/mechanics/constants.mjs'
import { Particle, UNITS_PER_PM_SCALE } from '../../physics/mechanics/particle.mjs'


export class Force {
    /**
     * 
     * @param {number} value 
     */
    constructor(value) {
        this.value = value
        this.isEnabled = true
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

    get id() {
        return "charge"
    }

    get name() {
        return "Coulomb"
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
        const alphaCharge = alpha.props.charge
        const betaCharge = beta.props.charge
        if (alphaCharge != 0 && betaCharge != 0) {
            const force = -this.value*alphaCharge*betaCharge/deltaSqr
            console.log(`coulomb force: ${force}`)
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

    get id() {
        return "lennardJones"
    }

    get name() {
        return "Lennard-Jones"
    }

    applyForce(dt,alpha,beta) {
        // Calculate vector between particles for relative forces
        const deltaX = (beta.x - alpha.x) / UNITS_PER_PM_SCALE
        const deltaY = (beta.y - alpha.y) / UNITS_PER_PM_SCALE
        // TODO: explore soft-core potentials
        //   https://pmc.ncbi.nlm.nih.gov/articles/PMC3187911/;
        //   https://www.sciencedirect.com/science/article/abs/pii/S1093326303001967 
        const deltaSqr = Math.max(deltaX*deltaX + deltaY*deltaY, 100) // minimum distance 100pm
        const deltaMag = Math.sqrt(deltaSqr)

        // Lennard-Jones Potential
        // epsilon: depth of potential well
        const epsilon = 1 // eV
        // sigma: finite distance where potential is zero, i.e., atoms "collide"
        const sigma = (alpha.props.atomicRadius + beta.props.atomicRadius) // PM
        const sigmaOverDistance = sigma / deltaMag
        const attraction = -(sigmaOverDistance ** 6)
        const repulsion = sigmaOverDistance ** 12
        const total = 4*epsilon*(repulsion + attraction)
        console.log(`lennard jones: ${total}`)
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

    get id() {
        return "gravity"
    }

    get name() {
        return "Gravity"
    }

    applyForce(dt,subject) {
        const force = this.value * subject.props.mass
        subject.fy += force
        console.log(`gravity: ${force}`)
    }
}

export class ElasticBoundary extends EnvironmentForce {
    constructor(value,width,height) {
        super(value)
        this.width = width
        this.height = height
    }

    get id() {
        return "boundaries"
    }

    get name() {
        return "Boundary"
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

    get id() {
        return "drag"
    }

    get name() {
        return "Drag"
    }

    applyForce(dt,subject) {
        subject.fx += this.value * subject.vx
        subject.fy += this.value * subject.vy
        const dragMag = Math.sqrt(subject.vx**2 + subject.vy**2) * this.value
        console.log(`drag: ${dragMag}`)
    }
}

export class ForceMatrix {
    constructor() {
        this.boundaries = new ElasticBoundary(0.99,500,500)
        this.drag = new Drag(0.01)
        this.gravity = new Gravity(GRAVITY_EARTH_ACCELERATION * 1E-5)

        this.charge = new CoulombForce(COULOMB_CONSTANT)
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
