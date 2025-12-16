
import { EnvironmentForce } from "./force.mjs";


/**
 * $`F
 * $`F_d = \frac{1}{2} * \rho * u^2 * c_d * A`$
 * $`\rho`$: mass density of fluid
 * $`u`$: flow velocity relative to object
 * $`c_d`$: coefficient of drag
 * $`A`$: orthographic projection in direction of flow
 * 
 * https://en.wikipedia.org/wiki/Drag_equation
 */
export class Drag extends EnvironmentForce {
    constructor(value) {
        super(value)
        this.dragCoefficient = 1
        this.rhoCoefHalf = value * this.dragCoefficient * 1/2
    }

    get id() {
        return "drag"
    }

    get name() {
        return "Drag"
    }

    applyForce(dt,subject) {
        // F_d = rho * v^2 * A * C_d * 1/2
        //     = rho * C_d * 1/2 * (v^2 * A)
        const flowMagSqr = subject.vx**2 + subject.vy**2
        const flowMag = Math.sqrt(flowMagSqr)
        if (flowMag == 0) return
        let area = subject.props.area
        if (!area) {
            area = 1E-36
        }
        const force = this.rhoCoefHalf * flowMagSqr * area
        const factor = force * 0.5 / flowMag
        console.log(`drag-v: ${factor}`)
        subject.fx += -subject.vx * factor
        subject.fy += -subject.vy * factor
    }
}