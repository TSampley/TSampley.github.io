
import { Properties } from "../physics/mechanics/properties.mjs";
import { UNITS_PER_PM_SCALE } from "../physics/mechanics/particle-render.mjs";
import { Element } from "./element.mjs";

/**
 * https://en.wikipedia.org/wiki/Chemical_bond
 */
export class AtomicProperties extends Properties {

    /**
     * @param {Element} element Determines the base properties of the atom.
     * @param {Number} charge Difference in electrons and protons.
     * @param {Number} neutronCount Number of neutrons in this atom.
     */
    constructor(element,charge,neutronCount) {
        super()
        if (charge > element.number) throw "Charge must be less than or equal to the atomic number."
        if (neutronCount <= 0) throw "Neutron Count must be greater than 0."
        this.element = element;
        this.charge = charge;
        this.neutronCount = neutronCount;
    }

    get protonCount() {
        return this.element.number;
    }
    get electronCount() {
        return this.element.number - this.charge;
    }
    /**
     * @returns {Number} Atomic mass in Daltons (Da) a.k.a. unified atomic mass unit (u)
     */
    get mass() {
        return this.element.number * 1.0073 + this.neutronCount * 1.0087
    }

    /**
     * @returns {Number?} the scaled van der waals radius of this atom or null if none.
     */
    get collisionRadius() {
        return AtomicRadii.vanDerWaals[this.element.number] * UNITS_PER_PM_SCALE;
    }

    /**
     * @returns {Number?} the van der waals radius of this atom or null if none.
     */
    get atomicRadius() {
        return AtomicRadii.vanDerWaals[this.element.number];
    }

    /**
     * @returns {Number?} the effective radius of this atom tested empirically or null if none.
     */
    get empiricalRadius() {
        return AtomicRadii.empiricalRadius[this.element.number];
    }

    /**
     * @returns {Number?} the effective radius of this atom calculated or null if none.
     */
    get calculatedRadius() {
        return AtomicRadii.calculatedRadius[this.element.number];
    }

    clone() {
        return new AtomicProperties(
            this.element,
            this.charge,
            this.neutronCount
        )
    }

    /**
     * @param {Particle} alpha
     * @param {Particle} beta
     */
    static bondLength(alpha,beta) {
        return 50
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
    static vanDerWaals = [
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

    /**
     * https://en.wikipedia.org/wiki/Atomic_radii_of_the_elements_(data_page)
     */
    static empirical = [
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

    static calculated = [
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

    static covalent = [
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

    static triple = [
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

    /**
     * Metallic bonds only form between metallic atoms and some non-metallic
     * elements, e.g. carbon in alloys.
     */
    static metallic = [
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
