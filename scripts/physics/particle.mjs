
import { ElementColorScheme } from '../../science/chemistry/cpk-coloring.mjs'
import { UnimplementedError } from '../common/errors.mjs'
import { GRAVITY_EARTH_ACCELERATION } from './constants.mjs'
import { Element } from './element.mjs'
import { Environment } from './environment.mjs'

export const UNITS_PER_PM_SCALE = 0.02
const RESTITION_BOUNCE = 0.99

const MEDIUM_DRAG = 0.01
/** @deprecated */
const RESTITUTION_MEDIUM = (1 - 0.01)
const MEDIUM_RESTITUTION = (1 - MEDIUM_DRAG)

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

    /**
     * Progress the particle simulation by [delta].
     * @param {number} delta The amount of time to advance the simulation.
     * @param {()=>void} onBounce Callback to notify of bounce events.
     */
    step(delta,environment) { /* gravityOn,width,height,onBounce */

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
     */
    calculateParticleForces(dt,beta) {
        // TODO: coulomb force
        const alpha = this
        const alphaCharge = this.props.charge
        const betaCharge = this.props.charge
        if (alphaCharge != 0 && betaCharge != 0) {
            // Calculate vector between particles
            const deltaX = beta.x - alpha.x
            const deltaY = beta.y - alpha.y
            // TODO: explore soft-core potentials - https://pmc.ncbi.nlm.nih.gov/articles/PMC3187911/; https://www.sciencedirect.com/science/article/abs/pii/S1093326303001967 
            const deltaSqr = Math.max(deltaX*deltaX + deltaY*deltaY, (200*UNITS_PER_PM_SCALE)**2);
            const deltaMag = Math.sqrt(deltaSqr)
            const force = -COULOMB_CONSTANT*alphaCharge*betaCharge/deltaSqr

            const impulseX = force * deltaX / deltaMag
            const impulseY = force * deltaY / deltaMag
            alpha.vx += impulseX / alpha.mass
            alpha.vy += impulseY / alpha.mass
            beta.vx -= impulseX / beta.mass
            beta.vy -= impulseY / beta.mass
        }
    }

    /**
     * 
     * @param {number} dt 
     * @param {Environment} environment 
     */
    calculateEnvironmentForces(dt,environment) {
        if (environment.gravity != 0) {
            this.fy += environment.gravity * this.mass
        }
        this.fx -= this.vx * MEDIUM_DRAG
        this.fy -= this.vy * MEDIUM_DRAG
    }

    /**
     * TODO: swap with replaceable Integrators
     * @param {number} dt The span of time to integrate over.
     */
    integrate(dt) {
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
        // TODO: check bounds of environment
        if (this.x > environment.width) {
            environment.onBounce();
            this.vx *= -RESTITION_BOUNCE;
            this.x = 2*width - this.x;
        } else if (this.x < 0) {
            environment.onBounce();
            this.vx *= -RESTITION_BOUNCE;
            this.x = -this.x;
        }

        if (this.y > environment.height) {
            environment.onBounce();
            this.vy *= -RESTITION_BOUNCE;
            this.y = 2*height - this.y;
        } else if (this.y < 0) {
            environment.onBounce();
            this.vy *= -RESTITION_BOUNCE;
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
        Na-Na-Na + Cl-Cl Cl-Cl
        Na-Na Na + Cl-Cl Cl-Cl
        Na-Na Na + Cl Cl Cl-Cl
        Na-Na + Na Cl + Cl Cl-Cl
        Na-Na + Na+ Cl- + Cl Cl-Cl
        Na-Na + Na+Cl- + Cl Cl-Cl
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
        context.fillStyle = this.props.element.renderColor
        const radius = this.props.collisionRadius

        context.beginPath();
        context.ellipse(this.x, this.y, radius, radius, 0, 0, 2*Math.PI);
        context.closePath();
        const elementColor = colorScheme.colorForElement(this.props.element);
        context.fillStyle = elementColor
        context.fill();
    }
}

/**
 * https://en.wikipedia.org/wiki/Chemical_bond
 * 
 * TODO: move to AtomicProperties file
 */
export class AtomicProperties extends Properties {

    /**
     * @param {Element} element Determines the base properties of the atom.
     * @param {Number} charge Difference in electrons and protons.
     * @param {Number} neutronCount Number of neutrons in this atom.
     */
    constructor(element,charge,neutronCount) {
        super()
        if (charge > element.number) throw "Charge must be less than or equal to the atomic number."
        if (neutronCount <= 0) throw "Neutron Count must be greater than 0."
        this.element = element;
        this.charge = charge;
        this.neutronCount = neutronCount;
    }

    get protonCount() {
        return this.element.number;
    }
    get electronCount() {
        return this.element.number - this.charge;
    }
    /**
     * @returns {Number} Atomic mass in Daltons (Da) a.k.a. unified atomic mass unit (u)
     */
    get mass() {
        return this.element.number * 1.0073 + this.neutronCount * 1.0087
    }

    /**
     * @returns {Number?} the scaled van der waals radius of this atom or null if none.
     */
    get collisionRadius() {
        return AtomicRadii.vanDerWaals[this.element.number] * UNITS_PER_PM_SCALE;
    }

    /**
     * @returns {Number?} the van der waals radius of this atom or null if none.
     */
    get atomicRadius() {
        return AtomicRadii.vanDerWaals[this.element.number];
    }

    /**
     * @returns {Number?} the effective radius of this atom tested empirically or null if none.
     */
    get empiricalRadius() {
        return AtomicRadii.empiricalRadius[this.element.number];
    }

    /**
     * @returns {Number?} the effective radius of this atom calculated or null if none.
     */
    get calculatedRadius() {
        return AtomicRadii.calculatedRadius[this.element.number];
    }

    clone() {
        return new AtomicProperties(
            this.element,
            this.charge,
            this.neutronCount
        )
    }

    /**
     * @param {Particle} alpha
     * @param {Particle} beta
     */
    static bondLength(alpha,beta) {
        return 50
    }
}

/**
 * One of a variety depending on application: https://en.wikipedia.org/wiki/Atomic_radius#Definitions
 */
class AtomicRadii {

    /**
     * 
     * https://en.wikipedia.org/wiki/Van_der_Waals_radius
     */
    static vanDerWaals = [
        null,
        120, 140, 182, 153, 192,
        170, 155, 152, 147, 154, // 10
        227, 173, 184, 210, 180,
        180, 175, 188, 275, 231, // 20
        211, null, null, null, null, 
        null, null, 163, 140, 139, // 30
        187, 211, 185, 190, 185,
        202, 303, 249, null, null, // 40
        null, null, null, null, null, 
        163, 172, 158, 193, 217, // 50
        206, 206, 198, 216, 343, 
        268, null, null, null, null, // 60 
        null, null, null, null, null, 
        null, null, null, null, null, // 70
        null, null, null, null, null, 
        null, null, 175, 166, 155, // 80
        196, 202, 207, 197, 202,
        220, 348, 283, null, null, // 90
        null, 186
    ]

    /**
     * https://en.wikipedia.org/wiki/Atomic_radii_of_the_elements_(data_page)
     */
    static empirical = [
        null,
        null, null, null, null, null,
        null, null, null, null, null, // 10 
        null, null, null, null, null,
        null, null, null, null, null, // 20 
        null, null, null, null, null,
        null, null, null, null, null, // 30 
        null, null, null, null, null,
        null, null, null, null, null, // 40 
        null, null, null, null, null,
        null, null, null, null, null, // 50 
        null, null, null, null, null,
        null, null, null, null, null, // 60 
        null, null, null, null, null,
        null, null, null, null, null, // 70 
        null, null, null, null, null,
        null, null, null, null, null, // 80 
        null, null, null, null, null,
        null, null, null, null, null, // 90 
        null, null, null, null, null,
        null, null, null, null, null // 100 
    ]

    static calculated = [
        null,
        null, null, null, null, null,
        null, null, null, null, null, // 10 
        null, null, null, null, null,
        null, null, null, null, null, // 20 
        null, null, null, null, null,
        null, null, null, null, null, // 30 
        null, null, null, null, null,
        null, null, null, null, null, // 40 
        null, null, null, null, null,
        null, null, null, null, null, // 50 
        null, null, null, null, null,
        null, null, null, null, null, // 60 
        null, null, null, null, null,
        null, null, null, null, null, // 70 
        null, null, null, null, null,
        null, null, null, null, null, // 80 
        null, null, null, null, null,
        null, null, null, null, null, // 90 
        null, null, null, null, null,
        null, null, null, null, null // 100 
    ]

    static covalent = [
        null,
        null, null, null, null, null,
        null, null, null, null, null, // 10 
        null, null, null, null, null,
        null, null, null, null, null, // 20 
        null, null, null, null, null,
        null, null, null, null, null, // 30 
        null, null, null, null, null,
        null, null, null, null, null, // 40 
        null, null, null, null, null,
        null, null, null, null, null, // 50 
        null, null, null, null, null,
        null, null, null, null, null, // 60 
        null, null, null, null, null,
        null, null, null, null, null, // 70 
        null, null, null, null, null,
        null, null, null, null, null, // 80 
        null, null, null, null, null,
        null, null, null, null, null, // 90 
        null, null, null, null, null,
        null, null, null, null, null // 100 
    ]

    static triple = [
        null,
        null, null, null, null, null,
        null, null, null, null, null, // 10 
        null, null, null, null, null,
        null, null, null, null, null, // 20 
        null, null, null, null, null,
        null, null, null, null, null, // 30 
        null, null, null, null, null,
        null, null, null, null, null, // 40 
        null, null, null, null, null,
        null, null, null, null, null, // 50 
        null, null, null, null, null,
        null, null, null, null, null, // 60 
        null, null, null, null, null,
        null, null, null, null, null, // 70 
        null, null, null, null, null,
        null, null, null, null, null, // 80 
        null, null, null, null, null,
        null, null, null, null, null, // 90 
        null, null, null, null, null,
        null, null, null, null, null // 100 
    ]

    /**
     * Metallic bonds only form between metallic atoms and some non-metallic
     * elements, e.g. carbon in alloys.
     */
    static metallic = [
        null,
        null, null, null, null, null,
        null, null, null, null, null, // 10 
        null, null, null, null, null,
        null, null, null, null, null, // 20 
        null, null, null, null, null,
        null, null, null, null, null, // 30 
        null, null, null, null, null,
        null, null, null, null, null, // 40 
        null, null, null, null, null,
        null, null, null, null, null, // 50 
        null, null, null, null, null,
        null, null, null, null, null, // 60 
        null, null, null, null, null,
        null, null, null, null, null, // 70 
        null, null, null, null, null,
        null, null, null, null, null, // 80 
        null, null, null, null, null,
        null, null, null, null, null, // 90 
        null, null, null, null, null,
        null, null, null, null, null // 100 
    ]
}
