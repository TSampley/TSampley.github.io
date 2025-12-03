
/**
 * 
 */
export class ParticleRender {
    render(context,particle) {
        throw new UnimplementedError
    }
}
/**
 * Used to convert between window units and picometers
 */
export const UNITS_PER_PM_SCALE = 0.02

/**
 * 
 */
export class AtomicParticleRender {


    /**
     * 
     */
    constructor() {

    }
    /**
     * 
     * @param {CanvasRenderingContext2D} context 
     * @param {ElementColorScheme} colorScheme
     */
    render(context,colorScheme,particle) {
        const atomicProps = particle.props

        const radius = atomicProps.collisionRadius

        const elementColor = colorScheme.colorForElement(atomicProps.element);
        context.fillStyle = elementColor
        context.beginPath();
        context.ellipse(particle.x, particle.y, radius, radius, 0, 0, 2*Math.PI);
        context.fill();
    }
}
