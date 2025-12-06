
import { EnvironmentForce } from "./force.mjs"

/**
 * TODO: move gravitational constant here?
 * 
 * $`F_g = G * m_a * m_b / d^2`$
 */
export class Gravity extends EnvironmentForce {
    /**
     * 
     * @param {number} value $`N * m^2 * kg^-2`$
     */
    constructor(value) {
        super(value)
    }

    get id() {
        return "gravity"
    }

    get name() {
        return "Gravity"
    }

    applyForce(dt,subject) {
        const force = this.value * subject.props.mass
        subject.fy += force
        console.log(`gravity: ${force}`)
    }
}
