

import { Render2D } from "/science/computing/simulation/render.mjs"

/**
 * @typedef {import("./particle.mjs").Particle} Particle
 */

/**
 * 
 */
export class ParticleRender extends Render2D {
    /**
     * @param {CanvasRenderingContext2D} context 
     * @param {Particle} particle 
     */
    render(context,particle) {
        const radius = particle.radius || 8

        context.fillStyle = particle.color || "black"
        context.beginPath();
        context.ellipse(particle.x, particle.y, radius, radius, 0, 0, 2*Math.PI);
        context.closePath();
        context.fill();
        context.stroke();
    }
}

/**
 * 
 */
export class AtomicParticleRender extends ParticleRender {


    /**
     * @param {import("/science/chemistry/cpk-coloring.mjs").ElementColorScheme} colorScheme
     */
    constructor(colorScheme) {
        super()
        this.colorScheme = colorScheme
    }
    /**
     * 
     * @param {CanvasRenderingContext2D} context 
     * @param {Particle} particle
     */
    render(context,particle) {
        const atomicProps = particle.props

        const radius = atomicProps.atomicRadius
        const charge = atomicProps.charge
        if (charge > 0) {
            context.strokeStyle = "red"
            context.lineWidth = charge * radius / 10
        } else if (charge < 0) {
            context.strokeStyle = "rgba(0, 204, 255, 1)"
            context.lineWidth = -charge * radius / 10
        } else {
            context.strokeStyle = null
        }

        const elementColor = this.colorScheme.colorForElement(atomicProps.element);
        context.fillStyle = elementColor
        context.beginPath();
        context.ellipse(particle.x, particle.y, radius, radius, 0, 0, 2*Math.PI);
        context.fill();
        context.stroke();
    }
}
