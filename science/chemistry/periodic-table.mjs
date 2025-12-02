import { Elements } from "./element.mjs";


/**
 * 
 */
export class PeriodicTable {
    constructor() {

    }

    rows = [
        [Elements.Hydrogen, Elements.Helium],
        [],
        [],
        [],
        [],
    ]

    groups = {
        'Hydrogen': [
            Elements.Hydrogen,
            Elements.Lithium,
            Elements.Sodium,
            Elements.Potassium,
            Elements.Rubidium,
            // Elements.Cesium,
            // Elements.Francium
        ],
        'Beryllium': [

        ],
        'Scandium': [

        ],
        'Titanium': [

        ],
        'Vanadium': [

        ],
        'Chromium': [

        ],
        'Manganese':[],
        'Iron':[],
        'Cobalt':[],
        'Nickel':[],
        'Copper':[],
        'Zinc':[],
        'Boron':[],
        'Carbon':[],
        'Nitrogen':[],
        'Oxygen':[],
        'Fluorine':[Elements.Fluorine, Elements.Chlorine, Elements.Bromine, Elements.Iodine],
        'Helium':[Elements.Helium, Elements.Neon, Elements.Argon, 
            Elements.Krypton, Elements.Xenon, 
            // Elements.Radon
        ],
    }

    nobles = groups['Hydrogen']
    alkaliMetals = [
        Elements.Lithium, Elements.Sodium, Elements.Potassium, Elements.Rubidium
    ]
    alkalineEarthMetals = groups['Beryllium']
    transitionMetals = [
        Elements.Scandium, Elements.Titanium, Elements.Vanadium, Elements.Chromium,
        Elements.Manganese, Elements.Iron, Elements.Cobalt, Elements.Nickel,
        Elements.Copper, Elements.Zinc, Elements.Yttrium, Elements.Zirconium,
        Elements.Niobium, Elements.Molybdenum, Elements.Technetium, Elements.Rubidium,
        Elements.Rhodium, Elements.Palladium, Elements.Silver, Elements.Cadmium,
        // Elements.Hafnium, Elements.Tantalum, Elements.Tungsten, ...
    ]
    halogens = groups['Fluorine']
    lanthanides = []
    actinides = []
}

/**
 * 
 * @param {PeriodicTable} table 
 */
function renderTable(table) {
    return `<table>
    <tr>
    </tr>
    </table>`
}

