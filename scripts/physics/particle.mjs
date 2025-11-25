
/**
 * 
 */
export class Particle {
    constructor(x, y, props) {
        this.x = x;
        this.y = y;
    }

    /**
     * Progress the particle simulation by [delta].
     * @param {number} delta 
     */
    step(delta) {
        
    }
}

/**
 * https://en.wikipedia.org/wiki/Chemical_bond
 */
class AtomicProperties {

    /**
     * 
     * @param {Number} number
     * @param {Number} charge
     */
    constructor(number,charge) {
        if (charge > number) throw "Charge cannot be greater than the atomic number."
        this.number = number;
        this.electronCount = number - charge;
    }

    get protonCount() {
        return this.number;
    }
    get electronCount() {
        return this.electronCount;
    }
    get charge() {
        return this.number - this.electronCount;
    }

    get atomicRadius() {

    }

    /**
     * @param {Particle} alpha
     * @param {Particle} beta
     */
    static bondLength(alpha,beta) {
        
    }
}

/**
 * One of a variety depending on application: https://en.wikipedia.org/wiki/Atomic_radius#Definitions
 */
class AtomicRadii {
    /**
     * 
     * https://en.wikipedia.org/wiki/Van_der_Waals_radius
     */
    vanDerWaals = [
        null,
        120, 140, 182, 153, 192,
        170, 155, 152, 147, 154, // 10
        227, 173, 184, 210, 180,
        180, 175, 188, 275, 231, // 20
        211, null, null, null, null, 
        null, null, 163, 140, 139, // 30
        187, 211, 185, 190, 185,
        202, 303, 249, null, null, // 40
        null, null, null, null, null, 
        163, 172, 158, 193, 217, // 50
        206, 206, 198, 216, 343, 
        268, null, null, null, null, // 60 
        null, null, null, null, null, 
        null, null, null, null, null, // 70
        null, null, null, null, null, 
        null, null, 175, 166, 155, // 80
        196, 202, 207, 197, 202,
        220, 348, 283, null, null, // 90
        null, 186
    ]

    covalent = [
        null,
        null, null, null, null, null,
        null, null, null, null, null, // 10 
        null, null, null, null, null,
        null, null, null, null, null, // 20 
        null, null, null, null, null,
        null, null, null, null, null, // 30 
        null, null, null, null, null,
        null, null, null, null, null, // 40 
        null, null, null, null, null,
        null, null, null, null, null, // 50 
        null, null, null, null, null,
        null, null, null, null, null, // 60 
        null, null, null, null, null,
        null, null, null, null, null, // 70 
        null, null, null, null, null,
        null, null, null, null, null, // 80 
        null, null, null, null, null,
        null, null, null, null, null, // 90 
        null, null, null, null, null,
        null, null, null, null, null // 100 
    ]
}

// module.exports = {
//     Particle: Particle
// }
