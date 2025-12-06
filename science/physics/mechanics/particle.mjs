

import { Environment } from '../../computing/simulation/environment.mjs'

import { Properties, NullProperties } from './properties.mjs';
import { AtomicParticleRender } from './particle-render.mjs';


/**
 * A particle as a general entity has only a position, (x,y).
 * Properties must usually be attached for use in
 * a specific application.
 * 
 * https://en.wikipedia.org/wiki/Particle
 * https://www.etymonline.com/word/particle
 */
export class Particle {

    /**
     * Create a new particle centered at `x` and `y` with the
     * given properties.
     * @param {Number} x 
     * @param {Number} y 
     * @param {Properties} props Default NullProperties
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
            this.vx *= -environment.forceMatrix.boundaries.value;
            this.x = 2*environment.width - this.x;
        } else if (this.x < 0) {
            environment.onBounce();
            this.vx *= -environment.forceMatrix.boundaries.value;
            this.x = -this.x;
        }

        if (this.y > environment.height) {
            environment.onBounce();
            this.vy *= -environment.forceMatrix.boundaries.value;
            this.y = 2*environment.height - this.y;
        } else if (this.y < 0) {
            environment.onBounce();
            this.vy *= -environment.forceMatrix.boundaries.value;
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
       const alpha = this
        // Calculate vector between particles
        const deltaX = beta.x - alpha.x
        const deltaY = beta.y - alpha.y
        const deltaSqr = deltaX*deltaX + deltaY*deltaY;

        const minRadius = alpha.props.atomicRadius + beta.props.atomicRadius
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

    #render = new AtomicParticleRender()

    /**
     * 
     */
    draw(context,colorScheme) {
        this.#render.render(context,colorScheme,this)
    }
}
