
import { EnvironmentForce } from "../../physics/mechanics/force.mjs"

/**
 * TODO: move ElasticBoundary to special boundaries property instead of force
 */
export class ElasticBoundary extends EnvironmentForce {
    /**
     * 
     * @param {number} value The restitution constant.
     * @param {number} width horizontal dimension of the boundary
     * @param {number} height vertical dimension of the boundary
     */
    constructor(value,width,height) {
        super(value)
        this.width = width
        this.height = height

        this.appliedForce = 0
    }

    get id() {
        return "boundaries"
    }

    get name() {
        return "Boundary"
    }

    clearForce() {
        this.appliedForce = 0
    }

    #onBounce(force) {
        this.appliedForce += force
    }

    applyForce(dt,subject) {
        return
        // F = m * a
        //   a = dv/dt
        //   dv = 2*{subject.vxy}
        //   dt = {dt}
        if (subject.x > this.width) {
            this.#onBounce(subject.props.mass * 2*subject.vx / dt);
            subject.vx *= -this.value;
            subject.x = 2*this.width - subject.x;
        } else if (subject.x < 0) {
            this.#onBounce(subject.props.mass * -2*subject.vx / dt);
            subject.vx *= -this.value;
            subject.x = -subject.x;
        }

        if (subject.y > this.height) {
            this.#onBounce(subject.props.mass * 2*subject.vy / dt);
            subject.vy *= -this.value;
            subject.y = 2*this.height - subject.y;
        } else if (subject.y < 0) {
            this.#onBounce(subject.props.mass * -2*subject.vy / dt);
            subject.vy *= -this.value;
            subject.y = -subject.y;
        }
    }
}
