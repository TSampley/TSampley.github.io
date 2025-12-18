

import { Environment, ForceMatrix } from './environment.mjs';

import { Timer } from '../../../scripts/common/timer.mjs'
import { Particle } from '../../physics/mechanics/particle.mjs'
import { Entity } from './entity.mjs';

const DefaultGenerator = (x,y)=>{return new Particle(x, y);}
const PassTest = (x,y)=>{return true;}
const DefaultStep = 0.5

/**
 * 
 * TODO: replace particle list with entity list; consider ParticleSimulation
 *   with extended functionality
 */
export class Simulation {

    /**
     * 
     * @param {Environment} environment 
     */
    constructor(environment) {
        this.world = new Timer()
        /**
         * @type {Array<Particle>}
         */
        this.particleList = new Array()
        /**
         * @type {Array<Entity>}
         */
        this.entityList = new Array()
        this.environment = environment
    }

    /**
     * 
     * @param {number} centerX 
     * @param {number} centerY 
     * @param {number} radius 
     */
    initializeCircle(centerX,centerY,radius) {
        let radiusSqr = radius*radius
        this.initializePoints(
            left = centerX - radius,
            right = centerX + radius,
            top = centerY - radius,
            bottom = centerY + radius,
            test = (x,y)=>{
                let xDif = x - centerX;
                let yDif = y - centerY;
                return xDif*xDif + yDif*yDif <= radiusSqr
            }
        )
    }

    /**
     * Initializes particles within the rectangular bounds defined by
     * left, right, top, and bottom, with points spaced 
     * using stepx, and stepy. Only points for which {@link test} 
     * returns true will be passed to {@link generator} to
     * create a new particle.
     * 
     * @param {Number} left
     * @param {Number} right
     * @param {Number} top
     * @param {Number} bottom
     * @param {Number} stepx
     * @param {Number} stepy
     * @param {(Number,Number)=>Boolean} test
     * @param {(Number,Number)=>Particle} generator
     */
    initializePoints(
        left,right,top,bottom,
        stepx = DefaultStep,
        stepy = DefaultStep,
        test = PassTest,
        generator = DefaultGenerator
    ) {
        // iterate over bounds to generate points
        var y = top;
        while (y < bottom) {
            var x = left;
            while (x < right) {
                // check for points in path
                if (test(x, y)) {
                    this.particleList.push(generator(x,y));
                }
                x+=stepx;
            }
            y+=stepy;
        }
    }

    /**
     * 
     * @param {number} dt
     */
    step(dt) {
        const step = dt * this.environment.timeScale
        // Clear previous state
        for (const particle of this.particleList) {
            particle.clearForces()
        }

        // Calculate all forces and collisions
        const particleForces = this.environment.particleForces().filter((value)=>{
            return value.isEnabled
        })
        const environmentForces = this.environment.environmentForces().filter((value)=>{
            return value.isEnabled
        })
        const max = this.particleList.length
        for (let alphaIndex = 0; alphaIndex < max; alphaIndex++) {
            const alpha = this.particleList[alphaIndex]
            for (let betaIndex = alphaIndex + 1; betaIndex < max; betaIndex++) {
                const beta = this.particleList[betaIndex]
                particleForces.forEach((force)=>{
                    force.applyForce(step,alpha,beta)
                })
            }
            environmentForces.forEach((force)=>{
                force.applyForce(step,alpha)
            })
            // TODO: check accumulated force here
        }

        // Integrate entities
        for (const particle of this.particleList) {
            particle.integrate(step)
        }

        // Resolve collisions
        for (let index = 0; index < max; index++) {
            const alpha = this.particleList[index]
            if (this.environment.hardCollisions) {
                for (let otherIndex = index + 1; otherIndex < max; otherIndex++) {
                    const beta = this.particleList[otherIndex]
                    checkParticleCollision(alpha,beta,this.environment)
                }
            }
            checkEnvironmentCollision(alpha,this.environment)
        }
    }

    /**
     * 
     * @param {Environment} environment 
     */
    checkEnvironmentCollision(subject,environment) {
        if (subject.x > environment.width) {
            environment.onBounce();
            subject.vx *= -environment.forceMatrix.boundaries.value;
            subject.x = 2*environment.width - subject.x;
        } else if (subject.x < 0) {
            environment.onBounce();
            subject.vx *= -environment.forceMatrix.boundaries.value;
            subject.x = -subject.x;
        }

        if (subject.y > environment.height) {
            environment.onBounce();
            subject.vy *= -environment.forceMatrix.boundaries.value;
            subject.y = 2*environment.height - subject.y;
        } else if (subject.y < 0) {
            environment.onBounce();
            subject.vy *= -environment.forceMatrix.boundaries.value;
            subject.y = -subject.y;
        }
    }

    /**
     * Checks the two particles against each other for collision and resolves
     * it if detected, applying appropriate forces to each particle.
     * 
     * @param {Particle} beta The other particle to check for collision. 
     * @param {Environment} environment The environment the particles exist within.
     */
    checkParticleCollision(alpha,beta,environment) {
        // Calculate vector between particles
        const deltaX = beta.x - alpha.x
        const deltaY = beta.y - alpha.y
        const deltaSqr = deltaX*deltaX + deltaY*deltaY;

        const radiusSum = alpha.props.atomicRadius + beta.props.atomicRadius
        const radiusSumSqr = radiusSum * radiusSum

        // Ensure particles within collision range
        if (deltaSqr <= radiusSumSqr) {
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

                // nudge particles
                const deltaMag = Math.sqrt(deltaSqr)
                const diff = radiusSum - deltaMag
                const nudgeX = diff * deltaX / (deltaMag * totalMass);
                const nudgeY = diff * deltaY / (deltaMag * totalMass);
                alpha.x -= nudgeX * betaMass;
                alpha.y -= nudgeY * betaMass;
                beta.x += nudgeX * alphaMass;
                beta.y += nudgeY * alphaMass;

                environment.onCollide()
            }
        }
    }
}
