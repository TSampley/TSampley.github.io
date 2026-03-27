import { Timer } from '/js/common/timer.mjs'
import { Entity } from './entity.mjs';
import { Environment } from './environment.mjs';
import { Scenario } from './scenario.mjs';

/**
 * @template {any} Subject
 */
export class Render2D {
  /**
   * Draws the environment to the canvas context.
   * 
   * @param {CanvasRenderingContext2D} context HTML Canvas simple context.
   * @param {Subject} subject The subject to render.
   * @param {number} offset Seconds offset since the last calculation frame.
   */
  render(context,subject,offset) {}
}

/**
 * @template {any} Subject
 */
export class Render3D {
  /**
   * Draws the environment to the webgl context.
   * 
   * @param {WebGL2RenderingContext} context HTML Canvas WebGL 2 Context.
   * @param {Subject} subject The subject to render.
   * @param {number} offset Seconds offset since the last calculation frame.
   */
  render(context,subject,offset) {}
}

/**
 * 
 * A `Simulation` is responsible for the time-keeping
 * mechanisms in order to simulate an {@link Environment}.
 * It also retains a reference to a rendering context to
 * pass to the environment at the appropriate time.
 * 
 * @template {Environment} E
 */
export class Simulation {

    /**
     * 
     * @param {E} environment 
     * @param {CanvasRenderingContext2D} context
     * @param {Array<Scenario<E>>} scenarios
     */
    constructor(environment,context,scenarios) {
        this.timer = new Timer()
        /** @type {Array<Entity>} */
        this.entityList = new Array()
        this.environment = environment
        this.context = context
        this.scenarios = scenarios
    }

    #isRunning = false
    start() {
        if (this.#isRunning) return;
        this.#isRunning = true
        this.#step()
    }

    #step() {
        requestAnimationFrame((tsl)=>{this.#frame(tsl)})
    }

    #lastTime = 0
    #frame(tsl) {
        if (!this.#lastTime) this.#lastTime = tsl
        const delta = (tsl - this.#lastTime) / 1000.0

        this.timer.step(delta)
        this.environment.step(delta)
        this.environment.draw(this.context,0)

        if (this.#isRunning) this.#step()
    }

    stop() {
        this.#isRunning = false
    }
}

// TODO: reference below to convert to integrate phase offset parameter
    // /**
    //  * 
    //  * @param {Environment} subject 
    //  */
    // constructor(subject) {
    //     this.subject = subject

    //     /** @type {Observable<boolean>} */
    //     this.isRunning = single(true)
    //     /** @type {Observable<number>} */
    //     this.simulationDelta = single(1000 / 60.0)
    //     /** @type {Observable<number>} */
    //     this.animationDelta = single(1000 / 30.0)
    // }

    // start() {
    //     this.isRunning.value = true

    //     setTimeout()
    //     // TODO: consider 
    //     requestAnimationFrame((tls)=>this.#animate(tls))
    // }

    // #lastTime = 0
    // #simulationPhase = 0
    // #animationPhase = 0
    // #animate(tsl) {
    //     if (this.#lastTime == 0) {
    //         this.#lastTime = tsl
    //     }

    //     const deltaMs = tsl - this.#lastTime

    //     while (this.#simulationPhase >= this.simulationDelta) {
    //         this.step(this.simulationDelta)
    //     }

    //     const offset = (this.#animationPhase + deltaMs) % this.animationDelta
    //     this.#animationPhase = phase
    //     this.draw(phase)
    // }

    // stop() {
    //     this.isRunning.value = false
    // }

    // step(delta) {
    //     this.subject.step(delta)
    // }

    // draw() {
    //     this.subject.draw(context,0)
    // }