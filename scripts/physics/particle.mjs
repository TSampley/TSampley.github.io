
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
 * Represents an abstract ideal element - not meant for use as
 * individual atomic properties, e.g. the mean mass may be fractional
 * which would often require fractional neutrons - impossible for
 * real elemental atoms.
 * 
 * https://www.nature.com/articles/s41467-021-22429-0
 */
export class Element {
    /**
     * 
     * @param {Number} number 
     * @param {String} name
     * @param {String} symbol
     * @param {Number} meanMass
     */
    constructor(number,name,symbol,meanMass) {
        this.number = number;
        this.name = name;
        this.symbol = symbol;
        this.meanMass = meanMass;
        this.electronegativity = 0.0;
    }
}

/**
 * https://en.wikipedia.org/wiki/Periodic_table
 */
export const Elements = Object.freeze({
    Hydrogen: new Element(1,"Hydrogen","H",1.008),
    Helium: new Element(2,"Helium","He",4.0026),

    Lithium: new Element(3,"Lithium","Li",6.94),
    Berilium: new Element(4,"Berilium","Be",9.0122),
    Boron: new Element(5,"Boron","B", 10.81),
    Carbon: new Element(6,"Carbon","C", 12.011),
    Nitrogen: new Element(7,"Nitrogen","N",14.007),
    Oxygen: new Element(8,"Oxygen","O",15.999),
    Fluorine: new Element(9,"Fluorine","F",18.998),
    Neon: new Element(10,"Neon","Ne",20.180),

    Sodium: new Element(11,"Sodium","Na",22.990),
    Magnesium: new Element(12,"Magnesium","Mg",24.305),
    Aliuminium: new Element(13,"Aluminium","Al",26.982),
    Silicon: new Element(14,"Silicon","Si",28.085),
    Phosphorous: new Element(15,"Phosphorous","P",30.974),
    Sulfur: new Element(16,"Sulfer","S",32.06),
    Chlorine: new Element(17,"Chlorine","Cl",35.45),
    Argon: new Element(18,"Argon","Ar",39.95),

    Potassium: new Element(19,"Potassium","K",39.098),
    Calcium: new Element(20,"Calcium","Ca",40.078),
    Scandium: new Element(21,"Scandium","Sc",44.956),
    Titanium: new Element(22,"Titanium","Ti",47.867),
    Vanadium: new Element(23,"Vanadium","V",50.942),
    Chromium: new Element(24,"Chromium","Cr",51.996),
    Manganese: new Element(25,"Manganese","Mn",54.938),
    Iron: new Element(26,"Iron","Fe",55.845),
    Cobalt: new Element(27,"Cobalt","Co",58.933),
    Nickel: new Element(28,"Nickel","Ni",58.693),
    Copper: new Element(29,"Copper","Cu",63.546),
    Zinc: new Element(30,"Zinc","Zn",65.38),
    Gallium: new Element(31,"Gallium","Ga",69.723),
    Germanium: new Element(32,"Germanium","Ge",72.630),
    Arsenic: new Element(33,"Arsenic","As",74.922),
    Selenium: new Element(34,"Selenium","Se",78.971),
    Bromine: new Element(35,"Bromine","Br",79.904),
    Krypton: new Element(36,"Krypton","Kr",83.798),

    Rubidium: new Element(37,"Rubidium","Rb",85.468),
    Strontium: new Element(38,"Strontium","Sr",87.62),
    Yttrium: new Element(39,"Yttrium","Y",88.906),
    Zirconium: new Element(40,"Zirconium","Zr",91.224),
    Niobium: new Element(41,"Niobium","Nb",92.906),
    Molybdenum: new Element(42,"Molybdenum","Mo",95.95),
    Technetium: new Element(43,"Technetium","Tc",97),
    Ruthenium: new Element(44,"Ruthenium","Ru",101.07),
    Rhodium: new Element(45,"Rhodium","Rh",102.91),
    Palladium: new Element(46,"Palladium","Pd",106.42),
    Silver: new Element(47,"Silver","Ag",107.87),
    Cadmium: new Element(48,"Cadmium","Cd",112.41),
    Indium: new Element(49,"Indium","In",114.82),
    Tin: new Element(50,"Tin","Sn",118.71),
    Antimony: new Element(51,"Antimony","Sb",121.76),
    Tellurium: new Element(52,"Tellurium","Te",127.60),
    Iodine: new Element(53,"Iodine","I",126.90),
    Xenon: new Element(54,"Krypton","Xe",131.29),
})

/**
 * https://en.wikipedia.org/wiki/Chemical_bond
 */
class AtomicProperties {

    /**
     * 
     * @param {Number} number Also the proton count.
     * @param {Number} charge Difference in electrons and protons.
     * @param {Number} neutronCount Number of neutrons in this atom.
     */
    constructor(number,charge,neutronCount) {
        if (charge > number) throw "Charge must be less than or equal to the atomic number."
        if (neutronCount <= 0) throw "Neutron Count must be greater than 0."
        this.number = number;
        this.electronCount = number - charge;
        this.neutronCount = neutronCount;
    }

    get protonCount() {
        return this.number;
    }
    get electronCount() {
        return this.electronCount;
    }
    get neutronCount() {
        return this.neutronCount;
    }
    get charge() {
        return this.number - this.electronCount;
    }

    /**
     * @returns {Number?} the van der waals radius of this atom or null if none.
     */
    get atomicRadius() {
        return AtomicRadii.vanDerWaals[number];
    }

    /**
     * @returns {Number?} the effective radius of this atom tested empirically or null if none.
     */
    get empiricalRadius() {
        return AtomicRadii.empiricalRadius[number];
    }

    /**
     * @returns {Number?} the effective radius of this atom calculated or null if none.
     */
    get calculatedRadius() {
        return AtomicRadii.calculatedRadius[number];
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

    /**
     * https://en.wikipedia.org/wiki/Atomic_radii_of_the_elements_(data_page)
     */
    empirical = [
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

    calculated = [
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

    triple = [
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

    metallic = [
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
