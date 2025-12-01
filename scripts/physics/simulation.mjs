

import { COULOMB_CONSTANT } from './constants.mjs'
import { Timer } from '../common/timer.mjs'
import { Particle, UNITS_PER_PM_SCALE } from './particle.mjs'
import { Environment } from './environment.mjs';
import { Entity } from './entity.mjs';

const DefaultGenerator = (x,y)=>{return new Particle(x, y);}
const PassTest = (x,y)=>{return true;}
const DefaultStep = 0.5

/**
 * 
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
        this.environment = new Environment(500, 500)
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
     * @param {number} delta
     * @param {Environment} environment
     */
    step(delta) {
        // Clear previous state
        for (const particle of this.particleList) {
            particle.clearForces()
        }

        // Calculate all forces and collisions
        const max = this.particleList.length
        for (let index = 0; index < max; index++) {
            const alpha = this.particleList[index]
            for (let otherIndex = index + 1; otherIndex < max; otherIndex++) {
                const beta = this.particleList[otherIndex]
                alpha.calculateParticleForces(beta,this.environment)
            }
            alpha.calculateEnvironmentForces(this.environment)
        }

        // Integrate entities
        for (const particle of this.particleList) {
            particle.integrate(delta)
        }

        // Resolve collisions
        for (let index = 0; index < max; index++) {
            const alpha = this.particleList[index]
            for (let otherIndex = index + 1; otherIndex < max; otherIndex++) {
                const beta = this.particleList[otherIndex]
                alpha.checkParticleCollision(beta,this.environment)
            }
            alpha.checkEnvironmentCollision(this.environment)
        }
    }
}
