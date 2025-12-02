
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
     * Used to convert between window units and picometers
     */
    UNITS_PER_PM_SCALE = 0.02

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
    render(context,particle) {
        const atomicProps = particle.props

        const radius = atomicProps.collisionRadius

        const elementColor = colorScheme.colorForElement(atomicProps.element);
        context.fillStyle = elementColor
        context.beginPath();
        context.ellipse(this.x, this.y, radius, radius, 0, 0, 2*Math.PI);
        context.fill();
    }
}
