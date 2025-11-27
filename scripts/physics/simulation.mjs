
import { Timer } from '../common/timer.mjs'
import { Particle } from './particle.mjs'

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
     * @param {number} width 
     * @param {number} height 
     * @param {()=>void} onCollide 
     * @param {()=>void} onBounce 
     */
    step(delta,width,height,onCollide,onBounce) {
        const max = this.particleList.length
        for (const index in this.particleList) {
            const particle = this.particleList[index]
            particle.step(delta,width,height,onBounce)
        }
        // Iterate over all particle pairs **once**
        for (let index = 0; index < max; index++) {
            const alpha = this.particleList[index]
            for (let otherIndex = index + 1; otherIndex < max; otherIndex++) {
                const beta = this.particleList[otherIndex]

                const collision = this.checkCollision(alpha, beta)
                if (collision) {
                    collision.resolve()
                    onCollide()
                }
            }
        }
    }

    /**
     * 
     * @param {Particle} alpha 
     * @param {Particle} beta 
     * @param {Collision?}
     */
    checkCollision(alpha, beta) {
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
                return new Collision(alpha, beta, deltaX, deltaY, deltaSqr)
            } else {
                return null
            }
        }
        return null
    }
}

class Collision {
    constructor(alpha, beta,
        deltaX=beta.x-alpha.x,
        deltaY=beta.y-alpha.y,
        deltaSqr=deltaX*deltaX+deltaY*deltaY
    ) {
        this.alpha = alpha
        this.beta = beta
        this.deltaX = deltaX
        this.deltaY = deltaY
        this.deltaSqr = deltaSqr
    }

    resolve() {
        // decompose velocity into parallel and opposing components
        const alphaDiffMag = (this.alpha.vx*this.deltaX + this.alpha.vy*this.deltaY) / this.deltaSqr
        const alphaTanMag = (this.alpha.vx*this.deltaY - this.alpha.vy*this.deltaX) / this.deltaSqr
        const betaDiffMag = (this.beta.vx*this.deltaX + this.beta.vy*this.deltaY) / this.deltaSqr
        const betaTanMag = (this.beta.vx*this.deltaY - this.beta.vy*this.deltaX) / this.deltaSqr

        // calculate new components along collision path
        const alphaMass = this.alpha.props.mass
        const betaMass = this.beta.props.mass
        const totalMass = alphaMass + betaMass
        const massDiff = alphaMass - betaMass
        const finalAlphaDiffMag = (massDiff/totalMass)*alphaDiffMag + 2*betaMass/totalMass*betaDiffMag
        const finalBetaDiffMag = 2*alphaMass/totalMass*alphaDiffMag - (massDiff/totalMass)*betaDiffMag

        // recompose new velocities
        this.alpha.vx = finalAlphaDiffMag*this.deltaX + alphaTanMag*this.deltaY
        this.alpha.vy = finalAlphaDiffMag*this.deltaY + alphaTanMag*(-this.deltaX)
        this.beta.vx = finalBetaDiffMag*this.deltaX + betaTanMag*this.deltaY
        this.beta.vy = finalBetaDiffMag*this.deltaY + betaTanMag*(-this.deltaX)
    }
}
