

import { Environment, ForceMatrix } from './environment.mjs';

import { Timer } from '../../../scripts/common/timer.mjs'
import { Particle } from '../../physics/mechanics/particle.mjs'
import { Entity } from './entity.mjs';
import { COULOMB_CONSTANT, GRAVITY_EARTH_ACCELERATION } from '../../physics/mechanics/constants.mjs';

const DefaultGenerator = (x,y)=>{return new Particle(x, y);}
const PassTest = (x,y)=>{return true;}
const DefaultStep = 0.5

/**
 * 
 * TODO: replace particle list with entity list; consider ParticleSimulation
 *   with extended functionality
 */
export class Simulation {
    constructor() {
        this.world = new Timer()
        /**
         * @type {Array<Particle>}
         */
        this.particleList = new Array()
        /**
         * @type {Array<Entity>}
         */
        this.entityList = new Array()
        this.environment = new Environment(500, 500, new ForceMatrix())
    }

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
        // Clear previous state
        for (const particle of this.particleList) {
            particle.clearForces()
        }

        // Calculate all forces and collisions
        const max = this.particleList.length
        for (let alphaIndex = 0; alphaIndex < max; alphaIndex++) {
            const alpha = this.particleList[alphaIndex]
            console.log(`beginning ${alpha.x}, ${alpha.y}`)
            for (let betaIndex = alphaIndex + 1; betaIndex < max; betaIndex++) {
                const beta = this.particleList[betaIndex]
                alpha.calculateParticleForces(dt,beta,this.environment)
            }
            alpha.calculateEnvironmentForces(dt,this.environment)
        }

        // Integrate entities
        for (const particle of this.particleList) {
            console.log(`integrate ${particle.x}, ${particle.y}`)
            particle.integrate(dt)
            console.log(`integrated ${particle.x}, ${particle.y}`)
        }

        // Resolve collisions
        for (let index = 0; index < max; index++) {
            const alpha = this.particleList[index]
            for (let otherIndex = index + 1; otherIndex < max; otherIndex++) {
                const beta = this.particleList[otherIndex]
                alpha.checkParticleCollision(beta,this.environment)
            }
            // alpha.checkEnvironmentCollision(this.environment)
        }
    }
}
