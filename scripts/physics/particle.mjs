
import { ElementColorScheme } from '../../science/chemistry/cpk-coloring.mjs'
import { ArtomicProperties } from '../../science/chemistry/atomic-properties.mjs'

import { Element } from '../../science/chemistry/element.mjs'

import { UnimplementedError } from '../common/errors.mjs'
import { Environment } from './environment.mjs'

/**
 * Used to convert between window units and picometers
 */
export const UNITS_PER_PM_SCALE = 0.02

export class Properties {
    constructor() {

    }
    clone() {
        throw `Abstract Method:${typeof this}`
    }
}

export const NullProperties = new Properties()

/**
 * A particle as a general entity has only a position, (x,y).
 * Properties must usually be attached for use in
 * a specific application.
 */
export class Particle {

    /**
     * Create a new particle centered at `x` and `y` with the
     * given properties.
     * @param {Number} x 
     * @param {Number} y 
     * @param {AtomicProperties|NullProperties} props Default NullProperties
     */
    constructor(x, y, props = NullProperties) {
        this.x = x;
        this.y = y;
        
        this.vx = 0;
        this.vy = 0;

        this.fx = 0;
        this.fy = 0;
        
        this.props = props;
    }

    clearForces() {
        this.fx = 0
        this.fy = 0
    }

    addForce(fx, fy) {
        this.fx += fx
        this.fy += fy
    }

    /**
     * 
     * @param {number} delta 
     * @param {Particle} beta 
     * @param {Environment} environment
     */
    calculateParticleForces(dt,beta,environment) {
        let logOutput = ''
        const alpha = this
        // Calculate vector between particles for relative forces
        const deltaX = beta.x - alpha.x
        const deltaY = beta.y - alpha.y
        // TODO: explore soft-core potentials
        //   https://pmc.ncbi.nlm.nih.gov/articles/PMC3187911/;
        //   https://www.sciencedirect.com/science/article/abs/pii/S1093326303001967 
        const deltaSqr = deltaX*deltaX + deltaY*deltaY;
        const deltaMag = Math.sqrt(deltaSqr)

        let forceSum = 0

        // Coulomb Force/Potential
        const alphaCharge = this.props.charge
        const betaCharge = beta.props.charge
        if (alphaCharge != 0 && betaCharge != 0) {
            const force = -environment.chargeConstant*alphaCharge*betaCharge/deltaSqr
            forceSum += force

            logOutput += `chargeForce=${force}`
        }

        // Lennard-Jones Potential
        const epsilon = 10 // depth of potential well
        const rho = 10 // finite distance where potential is zero
        const rhoOverDistance = rho / deltaMag
        const attraction = -(rhoOverDistance ** 6)
        const repulsion = rhoOverDistance ** 12
        const total = 4*epsilon*(repulsion + attraction)
        forceSum += total

        // Distribute total force
        const impulseX = forceSum * deltaX / deltaMag
        const impulseY = forceSum * deltaY / deltaMag
        alpha.fx += impulseX
        alpha.fy += impulseY
        beta.fx -= impulseX
        beta.fy -= impulseY

        logOutput += `potentialForce=${total}`
    }

    /**
     * 
     * @param {number} dt 
     * @param {Environment} environment 
     */
    calculateEnvironmentForces(dt,environment) {
        if (environment.gravity) {
            this.fy += environment.gravity * this.props.mass
        }
        this.fx -= this.vx * environment.drag
        this.fy -= this.vy * environment.drag
    }

    /**
     * TODO: swap with replaceable Integrators
     * @param {number} dt The span of time to integrate over.
     */
    integrate(dt) {
        console.log(`integrate: ${this.fx}, ${this.fy} / ${this.props.mass}`)
        const ax = this.fx / this.props.mass
        const ay = this.fy / this.props.mass

        this.vx += ax * dt
        this.vy += ay * dt

        this.x += this.vx * dt
        this.y += this.vy * dt
    }

    /**
     * 
     * @param {Environment} environment 
     */
    checkEnvironmentCollision(environment) {
        if (this.x > environment.width) {
            environment.onBounce();
            this.vx *= -environment.bounceRestitution;
            this.x = 2*width - this.x;
        } else if (this.x < 0) {
            environment.onBounce();
            this.vx *= -environment.bounceRestitution;
            this.x = -this.x;
        }

        if (this.y > environment.height) {
            environment.onBounce();
            this.vy *= -environment.bounceRestitution;
            this.y = 2*environment.height - this.y;
        } else if (this.y < 0) {
            environment.onBounce();
            this.vy *= -environment.bounceRestitution;
            this.y = -this.y;
        }
    }
    /**
     * Checks the two particles against each other for collision and resolves
     * it if detected, applying appropriate forces to each particle.
     * 
     * @param {Particle} beta The other particle to check for collision. 
     * @param {Environment} environment The environment the particles exist within.
     */
    checkParticleCollision(beta,environment) {
        // TODO: check collision energy directed along normal to overcome bond energy + ionization energy
        // TODO: e.g. Na+ Cl- formation requires free Na particle and Cl particle
        /*
        Na-Na-Na + Cl-Cl Cl-Cl : initial state
        Na-Na Na + Cl-Cl Cl-Cl : Sodium atom dissociates from bulk
        Na-Na Na + Cl Cl Cl-Cl : Chlorine atom dissociates from diatom
        Na-Na + Na Cl + Cl Cl-Cl : Free sodium and chlorine atoms depart bulks
        Na-Na + Na+ Cl- + Cl Cl-Cl : Charge exchanged upon collision
        Na-Na + Na+Cl- + Cl Cl-Cl : Ions drawn to each other by charge
        */
       const alpha = this
        // Calculate vector between particles
        const deltaX = beta.x - alpha.x
        const deltaY = beta.y - alpha.y
        const deltaSqr = deltaX*deltaX + deltaY*deltaY;
        // TODO: calculate soft force progressively with Lennard-Jones force
        const minRadius = alpha.props.collisionRadius + beta.props.collisionRadius
        const minRadiusSqr = minRadius * minRadius

        // Ensure particles within collision range
        if (deltaSqr <= minRadiusSqr) {
            const velX = beta.vx - alpha.vx
            const velY = beta.vy - alpha.vy
            const dotProd = velX*deltaX + velY*deltaY
            // ensure velocities are opposed
            if (dotProd < 0) {
                // Resolve Collision

                // decompose velocity into parallel and opposing components
                const alphaDiffMag = (alpha.vx*deltaX + alpha.vy*deltaY) / deltaSqr
                const alphaTanMag = (alpha.vx*deltaY - alpha.vy*deltaX) / deltaSqr
                const betaDiffMag = (beta.vx*deltaX + beta.vy*deltaY) / deltaSqr
                const betaTanMag = (beta.vx*deltaY - beta.vy*deltaX) / deltaSqr

                // calculate new components along collision path
                const alphaMass = alpha.props.mass
                const betaMass = beta.props.mass
                const totalMass = alphaMass + betaMass
                const massDiff = alphaMass - betaMass
                const finalAlphaDiffMag = (massDiff/totalMass)*alphaDiffMag + 2*betaMass/totalMass*betaDiffMag
                const finalBetaDiffMag = 2*alphaMass/totalMass*alphaDiffMag - (massDiff/totalMass)*betaDiffMag

                // recompose new velocities
                alpha.vx = finalAlphaDiffMag*deltaX + alphaTanMag*deltaY
                alpha.vy = finalAlphaDiffMag*deltaY + alphaTanMag*(-deltaX)
                beta.vx = finalBetaDiffMag*deltaX + betaTanMag*deltaY
                beta.vy = finalBetaDiffMag*deltaY + betaTanMag*(-deltaX)

                environment.onCollide()
            }
        }
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} context 
     * @param {ElementColorScheme} colorScheme
     */
    draw(context,colorScheme) {
        const radius = this.props.collisionRadius

        console.log(`draw ellipse ${this.x}, ${this.y}`)
        const elementColor = colorScheme.colorForElement(this.props.element);
        context.fillStyle = elementColor
        context.beginPath();
        context.ellipse(this.x, this.y, radius, radius, 0, 0, 2*Math.PI);
        context.fill();
    }
}
