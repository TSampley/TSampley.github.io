
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

    step(delta,width,height,onCollide,onBounce) {
        const max = this.particleList.length
        for (const index in this.particleList) {
            const particle = this.particleList[index]
            particle.step(delta,width,height,onBounce)
        }
        for (let index = 0; index < max; index++) {
            const particle = this.particleList[index]
            for (let otherIndex = index + 1; otherIndex < max; otherIndex++) {
                const other = this.particleList[otherIndex]
    
                const minRadius = particle.props.collisionRadius + other.props.collisionRadius
                const minSqr = minRadius * minRadius
                const diffX = particle.x - other.x
                const diffY = particle.y - other.y
                const diffSqr = diffX*diffX + diffY*diffY;
    
                // console.log(`${minSqr} > ${diffSqr} => ${minSqr > diffSqr}`)
                if (diffSqr <= minSqr) {
                    const velX = particle.vx - other.vx
                    const velY = particle.vy - other.vy
                    const dotProd = velX*diffX + velY*diffY
                    if (dotProd < 0) {
                        onCollide()
                    } else {
                        console.log('already moving apart')
                    }
                } else {
                    console.log(`${diffSqr} > ${minSqr}`)
                }
            }
        }
    }
}
