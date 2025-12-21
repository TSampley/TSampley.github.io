
import { UnimplementedError } from '../../js/common/errors.mjs'

/**
 * 
 */
export class Vector {
    get magnitudeSqr() {
        throw new UnimplementedError(this,'magnitudeSqr')
    }
    get magnitude() {
        throw new UnimplementedError(this,'magnitude')
    }
    get direction() {
        throw new UnimplementedError(this,'direction')
    }
}

/**
 * 
 */
export class Vector2D extends Vector {

    /**
     * 
     * @param {number} x 
     * @param {number} y 
     */
    constructor(x, y) {
        this.x = x
        this.y = y
    }

    get magnitudeSqr() {
        return this.x*this.x + this.y*this.y
    }

    get magnitude() {
        return Math.sqrt(this.magnitudeSqr)
    }

    get direction() {
        return Math.atan2(this.y, this.x)
    }

    get slope() {
        return this.y / this.x
    }
}

/**
 * The pair of angles in a spherical coordinate system.
 * 
 * https://en.wikipedia.org/wiki/Spherical_coordinate_system
 */
export class SphericalAngles {
    /**
     * 
     * @param {number} theta Rise toward y-coordinate from run z-coordinate.
     * @param {number} phi Rise toward y-coordinate from run x-coordinate.
     */
    constructor(theta,phi) {
        this.theta = theta
        this.phi = phi
    }
}

/**
 * 
 */
export class Vector3D extends Vector {
    constructor(x,y,z) {
        this.x = x
        this.y = y
        this.z = z
    }
    get magnitudeSqr() {
        return this.x*this.x + this.y*this.y + this.z*this.z
    }
    get magnitude() {
        return Math.sqrt(this.magnitudeSqr)
    }
    get direction() {
        return new SphericalAngles(
            Math.atan2(this.y, this.z),
            Math.atan2(this.y, this.x)
        )
    }
}
