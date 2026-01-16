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
    constructor(name) {
        this.name = name
    }

    /**
     * 
     * @param {E} environment The environment
     */
    init(environment) {
        throw UnimplementedError('Scenario','init')
    }
}
