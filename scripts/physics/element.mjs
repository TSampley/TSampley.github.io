
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
     * @param {Number} electronegativity
     */
    constructor(number,name,symbol,meanMass,electronegativity) {
        this.number = number;
        this.name = name;
        this.symbol = symbol;
        this.meanMass = meanMass;
        this.electronegativity = electronegativity;
    }

    /**
     * 
     * @param {Number} number 
     * @returns {Element?}
     */
    static getByNumber(number) {
        for (const key in Elements) {
            if (Elements[key].number == number) {
                return Elements[key];
            }
        }
        return null;
    }
}

/**
 * https://en.wikipedia.org/wiki/Periodic_table
 */
export const Elements = Object.freeze({
    Hydrogen: new Element(1,"Hydrogen","H",1.008,0.0),
    Helium: new Element(2,"Helium","He",4.0026,0.0),

    Lithium: new Element(3,"Lithium","Li",6.94,0.0),
    Berilium: new Element(4,"Berilium","Be",9.0122,0.0),
    Boron: new Element(5,"Boron","B", 10.81,0.0),
    Carbon: new Element(6,"Carbon","C", 12.011,0.0),
    Nitrogen: new Element(7,"Nitrogen","N",14.007,0.0),
    Oxygen: new Element(8,"Oxygen","O",15.999,0.0),
    Fluorine: new Element(9,"Fluorine","F",18.998,0.0),
    Neon: new Element(10,"Neon","Ne",20.180,0.0),

    Sodium: new Element(11,"Sodium","Na",22.990,0.0),
    Magnesium: new Element(12,"Magnesium","Mg",24.305,0.0),
    Aliuminium: new Element(13,"Aluminium","Al",26.982,0.0),
    Silicon: new Element(14,"Silicon","Si",28.085,0.0),
    Phosphorous: new Element(15,"Phosphorous","P",30.974,0.0),
    Sulfur: new Element(16,"Sulfer","S",32.06,0.0),
    Chlorine: new Element(17,"Chlorine","Cl",35.45,0.0),
    Argon: new Element(18,"Argon","Ar",39.95,0.0),

    Potassium: new Element(19,"Potassium","K",39.098,0.0),
    Calcium: new Element(20,"Calcium","Ca",40.078,0.0),
    Scandium: new Element(21,"Scandium","Sc",44.956,0.0),
    Titanium: new Element(22,"Titanium","Ti",47.867,0.0),
    Vanadium: new Element(23,"Vanadium","V",50.942,0.0),
    Chromium: new Element(24,"Chromium","Cr",51.996,0.0),
    Manganese: new Element(25,"Manganese","Mn",54.938,0.0),
    Iron: new Element(26,"Iron","Fe",55.845,0.0),
    Cobalt: new Element(27,"Cobalt","Co",58.933,0.0),
    Nickel: new Element(28,"Nickel","Ni",58.693,0.0),
    Copper: new Element(29,"Copper","Cu",63.546,0.0),
    Zinc: new Element(30,"Zinc","Zn",65.38,0.0),
    Gallium: new Element(31,"Gallium","Ga",69.723,0.0),
    Germanium: new Element(32,"Germanium","Ge",72.630,0.0),
    Arsenic: new Element(33,"Arsenic","As",74.922,0.0),
    Selenium: new Element(34,"Selenium","Se",78.971,0.0),
    Bromine: new Element(35,"Bromine","Br",79.904,0.0),
    Krypton: new Element(36,"Krypton","Kr",83.798,0.0),

    Rubidium: new Element(37,"Rubidium","Rb",85.468,0.0),
    Strontium: new Element(38,"Strontium","Sr",87.62,0.0),
    Yttrium: new Element(39,"Yttrium","Y",88.906,0.0),
    Zirconium: new Element(40,"Zirconium","Zr",91.224,0.0),
    Niobium: new Element(41,"Niobium","Nb",92.906,0.0),
    Molybdenum: new Element(42,"Molybdenum","Mo",95.95,0.0),
    Technetium: new Element(43,"Technetium","Tc",97,0.0),
    Ruthenium: new Element(44,"Ruthenium","Ru",101.07,0.0),
    Rhodium: new Element(45,"Rhodium","Rh",102.91,0.0),
    Palladium: new Element(46,"Palladium","Pd",106.42,0.0),
    Silver: new Element(47,"Silver","Ag",107.87,0.0),
    Cadmium: new Element(48,"Cadmium","Cd",112.41,0.0),
    Indium: new Element(49,"Indium","In",114.82,0.0),
    Tin: new Element(50,"Tin","Sn",118.71,0.0),
    Antimony: new Element(51,"Antimony","Sb",121.76,0.0),
    Tellurium: new Element(52,"Tellurium","Te",127.60,0.0),
    Iodine: new Element(53,"Iodine","I",126.90,0.0),
    Xenon: new Element(54,"Krypton","Xe",131.29,0.0),
})
