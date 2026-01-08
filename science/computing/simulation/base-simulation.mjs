import { UnimplementedError } from "../../../js/common/errors.mjs"
import { Observable, single } from '../../../js/common/observables.mjs';
import { Environment } from "./environment.mjs"



/**
 * TODO: rename to Simulation
 */
export class BaseSimulation {
    /**
     * 
     * @param {Environment} subject 
     */
    constructor(subject) {
        this.subject = subject

        /** @type {Observable<boolean>} */
        this.isRunning = single(true)
        /** @type {Observable<number>} */
        this.simulationDelta = single(1000 / 60.0)
        /** @type {Observable<number>} */
        this.animationDelta = single(1000 / 30.0)
    }

    start() {
        this.isRunning.value = true

        setTimeout()
        // TODO: consider 
        requestAnimationFrame((tls)=>this.#animate(tls))
    }

    #lastTime = 0
    #simulationPhase = 0
    #animationPhase = 0
    #animate(tsl) {
        if (this.#lastTime == 0) {
            this.#lastTime = tsl
        }

        const deltaMs = tsl - this.#lastTime

        while (this.#simulationPhase >= this.simulationDelta) {
            this.step()
        }

        const offset = (this.#animationPhase + deltaMs) % this.animationDelta
        this.#animationPhase = phase
        this.draw(phase)
    }

    stop() {
        this.isRunning.value = false
    }

    #unimplemented(method) {
        throw new UnimplementedError('BaseSimulation',method)
    }

    step() {
        this.#unimplemented('step')
    }

    draw() {
        this.#unimplemented('draw')
    }
}