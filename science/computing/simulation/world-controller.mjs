
import '../../physics/mechanics/constants.mjs';
import { Particle } from '../../physics/mechanics/particle.mjs';
import { Scenario } from './scenario.mjs';
import { Simulation } from './simulation.mjs';
import { Timer } from '../../../js/common/timer.mjs';

import { CPKColorScheme } from '../../chemistry/cpk-coloring.mjs'
import { Element } from '../../chemistry/element.mjs';
import { AtomicProperties } from '../../chemistry/atomic-properties.mjs';
import { AtomicParticleRender } from '../../physics/mechanics/particle-render.mjs';

const noOpScenario = {
  init: function() {}
}
/**
 * 
 */
export class WorldController {

    /**
     * 
     * @param {Simulation} simulation The simulation data.
     * @param {Timer} timer
     */
    constructor(simulation,timer) {
        this.simulation = simulation
        this.timer = timer
        this.onSetDisplay = (display)=>{}
        this.onSetCharge = (charge)=>{}

        this.colorScheme = CPKColorScheme

        this.isRunning = true

        this.atomicRender = new AtomicParticleRender(this.colorScheme)

        this.scenario = noOpScenario
    }

    /**
     * @param {Scenario} scenario 
     */
    setScenario(scenario) {
        this.scenario = scenario
    }

    reset() {
        this.scenario.init(this.simulation.environment)
    }

    /**
     * 
     * @type {Element}
     */
    #element
    setElement(element) {
        this.#element = element
        this.onSetDisplay(element.name)
    }

    /**
     * @type {number} 
     */
    #charge
    setCharge(charge) {
        this.#charge = charge
        this.onSetCharge(charge)
    }
    incrementCharge() {
        this.setCharge(this.#charge + 1)
    }
    decrementCharge() {
        this.setCharge(this.#charge - 1)
    }

    /**
     * 
     * @param {number} x 
     * @param {number} y 
     */
    spawn(x,y) {
        const newParticle = new Particle(x,y,new AtomicProperties(this.#element, this.#charge, this.#element.number))
        this.addParticle(newParticle)
    }

    /**
     * 
     * @param {Particle} particle 
     */
    addParticle(particle) {
        this.simulation.particleList.push(particle)
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} context 
     */
    drawParticles(context) {
        for (const particle of this.simulation.particleList) {
            this.atomicRender.render(context, particle)
            /* 
            TODO: pair particles with renderers based on props type-tag
              switch (particle.type) {
                  case 'atom':
                      console.log('drawing atom')
                      break;
              }
             */
        }
    }
}
