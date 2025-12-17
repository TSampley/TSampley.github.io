
import { ElementColorScheme } from "../../chemistry/cpk-coloring.mjs"
import { Particle } from "./particle.mjs"

/**
 * 
 */
export class ParticleRender {
    render(context,particle) {
        throw new UnimplementedError
    }
}

/**
 * 
 */
export class AtomicParticleRender {


    /**
     * @param {ElementColorScheme} colorScheme
     */
    constructor(colorScheme) {
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
