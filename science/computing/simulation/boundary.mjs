
import { EnvironmentForce } from "../../physics/mechanics/force.mjs"

/**
 * 
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

        if (subject.x < 0) {

        } else if (subject.x > this.width) {

        }

        if (subject.y < 0) {
            
        } else if (subject.y > this.height) {

        }
    }
}
