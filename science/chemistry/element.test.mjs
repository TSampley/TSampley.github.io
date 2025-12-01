
import { Element, Elements } from './element.mjs'


test("Element should correspond to number.", () => {
    expect(Element.getByNumber(1)).toBe(Elements.Hydrogen);
    expect(Element.getByNumber(8)).toBe(Elements.Oxygen);
    expect(Element.getByNumber(11)).toBe(Elements.Sodium);
    expect(Element.getByNumber(21)).toBe(Elements.Scandium);
    expect(Element.getByNumber(34)).toBe(Elements.Selenium);
    expect(Element.getByNumber(35)).toBe(Elements.Bromine);
    expect(Element.getByNumber(47)).toBe(Elements.Silver);
    expect(Element.getByNumber(48)).toBe(Elements.Cadmium);
    expect(Element.getByNumber(49)).toBe(Elements.Indium);
});
