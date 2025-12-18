

import { Environment } from '../../computing/simulation/environment.mjs'

import { Properties, NullProperties } from './properties.mjs';


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
}
