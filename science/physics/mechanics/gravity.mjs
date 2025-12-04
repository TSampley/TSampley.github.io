
import { EnvironmentForce } from "./force.mjs"

/**
 * TODO: move gravitational constant here?
 */
export class Gravity extends EnvironmentForce {
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
