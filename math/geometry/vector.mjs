
import { UnimplementedError } from '/js/common/errors.mjs'
import { SphericalAngles } from './spherical-angles.mjs'

/**
 * A list of scalars.
 */
export class Vector {

    /**
     * @param {number[]} coordinates The list of scalar values.
     */
    constructor(coordinates) {
        this.coordinates = coordinates
    }
    /**
     * @returns The sum of the squares of all `coordinates`.
     */
    get magnitudeSqr() {
        return this.coordinates.reduce((previousValue,currentValue) => {
            return previousValue + currentValue**2
        }, 0)
    }
    /**
     * @returns The geometric distance between the origin and the point
     * represented by the `coordinates`.
     */
    get magnitude() {
        return Math.sqrt(this.magnitudeSqr)
    }
    /**
     * @returns An array of dimension one less than the coordinates, 
     * indicating deviation from the neutral unit vector.
     */
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
        super([x, y])
    }

    get x() {
        return this.coordinates[0]
    }

    set x(value) {
        this.coordinates[0] = value
    }

    get y() {
        return this.coordinates[1]
    }

    set y(value) {
        this.coordinates[1] = value
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
        super([x, y, z])
        this.x = x
        this.y = y
        this.z = z
    }
    get x() {
        this.coordinates[0]
    }
    set x(value) {
        this.coordinates[0] = value
    }
    get y() {
        this.coordinates[1]
    }
    set y(value) {
        this.coordinates[1] = value
    }
    get z() {
        this.coordinates[2]
    }
    set z(value) {
        this.coordinates[2] = value
    }
    get magnitudeSqr() {
        return this.x**2 + this.y**2 + this.z**2
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
