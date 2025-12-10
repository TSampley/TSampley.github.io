import { Particle } from "./particle.mjs";

/**
 * Renders a field of electric charges with a test charge
 * to determine strength and direction of the field at all
 * points.
 */
export class ElectricFieldRender {

    /**
     * 
     * @param {HTMLCanvasElement} canvas 
     */
    constructor(canvas) {
        this.canvas = canvas
        this.context = canvas.getContext('webgl')
        if (!this.context) {
            console.error('Could not retrieve webgl context')
        }
    }

    /**
     * 
     * @param {Array<Particle>} particles 
     */
    render(particles) {
        // TODO: render field
    }
}
