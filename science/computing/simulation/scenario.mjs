import { ForceMatrix } from "./environment.mjs"
import { Particle } from "../../physics/mechanics/particle.mjs"

/**
 * Generic container class for a configurable simulation
 * scenario, including simulated entities, and environment
 * state.
 */
export class Scenario {

    /**
     * 
     * @param {string} name
     * @param {ForceMatrix} forceMatrix
     * @param {()=>Array<Particle>} spawner 
     */
    constructor(name,forceMatrix,spawner) {
        this.name=name
        this.forceMatrix=forceMatrix
        this.spawner=spawner
    }

    /**
     * 
     * @returns {Array<Particle>}
     */
    spawnParticles() {
        return this.spawner()
    }
}
