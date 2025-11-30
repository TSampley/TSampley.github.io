
import { UnimplementedError } from '../../scripts/common/errors.mjs'
import { Element } from '../../scripts/physics/element.mjs'

/**
 * 
 */
export class ElementColorScheme {
    /**
     * 
     * @param {Element} element
     * @returns {string?} The color to render this element.
     */
    colorForElement(element) {
        throw new UnimplementedError(this,'colorForElement')
    }
}

/**
 * 
 */
export class ArrayColorScheme extends ElementColorScheme {
    /**
     * 
     * @param {Array<string>} scheme 
     */
    constructor(scheme) {
        this.scheme = scheme
    }
    colorForElement(element) {
        if (element.number in this.scheme)
            return this.scheme[element.number]
        else
            return null
    }
}


/**
 * https://en.wikipedia.org/wiki/CPK_coloring#Modern_variants
 */
export const CPKColoring = new ArrayColorScheme(
    [
        "#fff","#aaa","#aaa","#aaa","#aaa",
        "#111","#aaf","#d00","#0f0","#aaa", // 10
        "#aaa","#aaa","#aaa","#aaa","#a0f",
        "#dd0","#0b0","#f0f","#aaa","#aaa", // 20
        "#aaa","#aaa","#aaa","#aaa","#aaa",
        "#aaa","#aaa","#aaa","#aaa","#aaa", // 30
        "#aaa","#aaa","#aaa","#aaa","#080",
        "#aaa","#aaa","#aaa","#aaa","#aaa", // 40
        "#aaa","#aaa","#aaa","#aaa","#aaa",
        "#aaa","#aaa","#aaa","#aaa","#aaa", // 50
        "#aaa","#aaa","#050","#acd",'#000',
        '#000','#000','#000','#000','#000', // 60
        '#000','#000','#000','#000','#000',
        '#000','#000','#000','#000','#000', // 70
        '#000','#000','#000','#000','#000',
        '#000','#000','#000','#000','#000', // 80
    ]
)
