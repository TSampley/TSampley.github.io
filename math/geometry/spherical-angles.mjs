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
    constructor(theta, phi) {
        this.theta = theta;
        this.phi = phi;
    }
}
