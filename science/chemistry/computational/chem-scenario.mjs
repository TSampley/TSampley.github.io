import { single } from "../../../js/common/observables.mjs";
import { ChemEnvironment } from "./chem-environment.mjs";
import { ForceMatrix } from "./force-matrix.mjs";
import { Particle } from "../../physics/mechanics/particle.mjs"
import { Scenario } from "../../computing/simulation/scenario.mjs";

/**
 * @template {ChemEnvironment} E
 */
export class ChemScenario extends Scenario {
    /**
     * 
     * @param {string} name
     * @param {ForceMatrix} forceMatrix
     * @param {()=>Array<Particle>} spawner 
     */
    constructor(name,forceMatrix,spawner) {
        super(name)
        this.forceMatrix=forceMatrix
        this.spawner=spawner
    }

    init(environment) {
        environment.forceMatrix = single(this.forceMatrix)
        environment.particles = this.spawner()
    }
}
