
import { Properties } from "../physics/mechanics/properties.mjs";
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
        if (neutronCount < 0) throw "Neutron Count must greater than or equal to 0."
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
        120E-12, 140E-12, 182E-12, 153E-12, 192E-12,
        170E-12, 155E-12, 152E-12, 147E-12, 154E-12, // 10
        227E-12, 173E-12, 184E-12, 210E-12, 180E-12,
        180E-12, 175E-12, 188E-12, 275E-12, 231E-12, // 20
        211E-12, null, null, null, null, 
        null, null, 163E-12, 140E-12, 139E-12, // 30
        187E-12, 211E-12, 185E-12, 190E-12, 185E-12,
        202E-12, 303E-12, 249E-12, null, null, // 40
        null, null, null, null, null, 
        163E-12, 172E-12, 158E-12, 193E-12, 217E-12, // 50
        206E-12, 206E-12, 198E-12, 216E-12, 343E-12, 
        268E-12, null, null, null, null, // 60 
        null, null, null, null, null, 
        null, null, null, null, null, // 70
        null, null, null, null, null, 
        null, null, 175E-12, 166E-12, 155E-12, // 80
        196E-12, 202E-12, 207E-12, 197E-12, 202E-12,
        220E-12, 348E-12, 283E-12, null, null, // 90
        null, 186E-12
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
