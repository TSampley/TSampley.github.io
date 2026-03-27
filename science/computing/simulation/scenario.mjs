import { UnimplementedError } from "../../../js/common/errors.mjs"
import { Environment } from "./environment.mjs"

/**
 * Generic container class for a configurable simulation
 * scenario, including simulated entities, and environment
 * state.
 * 
 * @template {Environment} E
 */
export class Scenario {
    constructor(name,description) {
        this.name = name
        this.description = description
    }

    /**
     * Initialize the given {@linkcode Environment} according to the `Scenario`.
     * @param {E} environment The environment
     */
    init(environment) {
        throw UnimplementedError('Scenario','init')
    }
}

/**
 * @template {Environment} E
 * @param {string} name
 * @param {string} description
 * @param {(enviro:E)=>void} setup
 */
export function scenario(name,description,setup) {
    /**
     * @returns {Scenario<E>}
     */
    return class extends Scenario {
        constructor(name,description) {
            super(name,description)
        }

        init(environemt) {
            setup(environemt)
        }
    }
}
