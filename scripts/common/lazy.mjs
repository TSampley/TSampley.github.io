
/**
 * Holds a provider function to evaluate the first time the
 * value is requested.
 * @type V 
 */
export class LazyValue {
    /**
     * 
     * @param {()=>V} provider 
     */
    constructor(provider) {
        this.provider = provider;
    }

    #value
    get value() {
        if (this.#value === undefined) {
            this.#value = this.provider()
        }
        return this.#value
    }
}

/**
 * 
 * @param {()=>V} provider The value provider to invoke the first time the 
 * value is referenced.
 * @returns {LazyValue}
 */
export function lazy(provider) {
    return new LazyValue(provider)
}
