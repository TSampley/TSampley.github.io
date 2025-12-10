
import { EnvironmentForce } from "../../physics/mechanics/force.mjs"

/**
 * TODO: move ElasticBoundary to special boundaries property instead of force
 */
export class ElasticBoundary extends EnvironmentForce {
    constructor(value,width,height) {
        super(value)
        this.width = width
        this.height = height
    }

    get id() {
        return "boundaries"
    }

    get name() {
        return "Boundary"
    }

    applyForce(dt,subject) {
        // TODO: move implementation here from Simulation.step and Particle.checkEnvironmentCollision
        if (subject.x < 0) {

        } else if (subject.x > this.width) {

        }

        if (subject.y < 0) {
            
        } else if (subject.y > this.height) {

        }
    }
}
