
// https://en.wikipedia.org/wiki/Metric_system

export class BaseUnit {
    constructor(name,symbol) {
        this.name=name
        this.symbol=symbol
    }
}

export const BaseUnits = {
    Meter: new BaseUnit("meter", "m"),
    Gram: new BaseUnit("gram", "g"),
    Second: new BaseUnit("second", "s"),
    Ampere: new BaseUnit("ampere", "A"),
    Kelvin: new BaseUnit("kelvin", "K"),
    Mole: new BaseUnit("Mole", "mol"),
    Candela: new BaseUnit("candela", "cd")
}

export class Prefix {
    constructor(name,symbol,factor) {
        this.name=name
        this.symbol=symbol
        this.factor=factor
    }
}

export const Prefixes = {
    Atto: new Prefix("atto","a",1E-18),
    Femto: new Prefix("femto","f",1E-15),
    Pico: new Prefix("pico","p",1E-12),
    Nano: new Prefix("nano","n",1E-9),
    Micro: new Prefix("micro","µ",1E-6),
    Milli: new Prefix("milli","m",1E-3),
    Centi: new Prefix("centi","c",1E-2),
    Deci: new Prefix("deci","d",1E-1),
    Base: new Prefix("","",1E0),
    Deca: new Prefix("deca","da",1E1),
    Hecto: new Prefix("hecto","h",1E2),
    Kilo: new Prefix("kilo","k",1E3),
    Mega: new Prefix("mega","M",1E6),
    Giga: new Prefix("giga","G",1E9),
    Tera: new Prefix("tera","T",1E12),
    Peta: new Prefix("peta","P",1E15),
    Exa: new Prefix("exa","E",1E18),
}


export const METERS_PER_PICOMETER = Prefixes.Pico.factor

export class DerivedUnit {
    constructor(name,symbol,units) {
        this.name=name
        this.symbol=symbol
        this.units=units
    }
}

export const DerivedUnits = {
    Hertz: new DerivedUnit("hertz","hz",{second:-1}),
    Newton: new DerivedUnit("newton","N",{kilogram:1,meter:1,second:-2}),
    Tesla: new DerivedUnit("tesla","T",{kilogram:1,second:-2,ampere:-1})
}
