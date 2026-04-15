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
    throw new UnimplementedError('Scenario','init')
  }
}

/**
 * @template {Environment} E
 */
export class FunctionalScenario extends Scenario {
  /**
   * @param {string} name
   * @param {string} description
   * @param {(enviro:E)=>void} setup
   */
  constructor(name,description,setup) {
    super(name,description)
    this.setup = setup
  }

  /** @param {Environment} environment */
  init(environment) {
    this.setup(environment)
  }
}

/**
 * @template {Environment} E
 * @param {string} name
 * @param {string} description
 * @param {(enviro:E)=>void} setup
 * @returns {Scenario<E>}
 */
export function scenarioFun(name,description,setup) {
  return new FunctionalScenario(name,description,setup)
}
