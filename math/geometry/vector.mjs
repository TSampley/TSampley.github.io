
import { UnimplementedError } from '../../js/common/errors.mjs'
import { SphericalAngles } from './spherical-angles.mjs'

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
