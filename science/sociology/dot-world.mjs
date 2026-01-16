import { Size } from "../../js/common/geom.mjs";
import { Simulation } from "../computing/simulation/simulation.mjs";
import { Environment } from "../computing/simulation/environment.mjs";


/**
 * Seconds per day
 */
const DAY_PERIOD = 1000
/**
 * Days per year
 */
const YEAR_PERIOD = 100

const EARTH_TILT = 23.5 * Math.PI / 180
const OK_LAT = 35

/**
 * A world full of dots, interacting in social (or ecological) simulations.
 * 
 * TODO: plant/heat dynamics
 * - once plants reach size/cycle, produce flowers
 * - flowers produce seeds that disperse on wind
 * - wind determined by air temperatures driving convection
 */
export class DotWorld extends Environment {

  /**
   * @param {Size} size
   */
  constructor(size, axisOffset = EARTH_TILT, latitude = OK_LAT) {
    super(size)

    this.plants = []
    this.bunnies = []
    this.wolves = []

    this.time = 0

    this.axisOffset = axisOffset
    this.latitude = latitude

    this.dayPhase = 0
    this.annualPhase = 0
  }

  step(delta) {
    // progress total elapsed time
    this.time += delta
    // determine season + day/night cycle
    const seconds = this.time % DAY_PERIOD
    const dayPhase = seconds / DAY_PERIOD
    const days = Math.floor(this.time / DAY_PERIOD)
    /** [0, 1) */
    const annualPhase = days % YEAR_PERIOD
    /** [0, inf) */
    const year = Math.floor(days / YEAR_PERIOD)
    const dayOfYear = days % YEAR_PERIOD
    /** [0, 2Pi) */
    const seasonPhase = Math.PI * 2 * annualPhase

    // determine weather conditions
    const transmission = 1 // always sunny for now

    // determine energy contributed across environment
    const energyFlux = 10 // J * m^-2 * s^-1

    // plants grow, reproduce, die
    for (const plant of this.plants) {
      const surfaceArea = plant.size || Math.PI*100
      const incidentEnergy = surfaceArea * energyFlux

      plant.absorb(incidentEnergy)
    }

    // bunnies forage, reproduce, die
    for (const bunny of this.bunnies) {

    }

    // wolves hunt, reproduce, die
    for (const wolf of this.wolves) {

    }
  }

  /**
   * 
   * @param {CanvasRenderingContext2D} context 
   * @param {number} offset 
   */
  draw(context, offset) {
    // clear area
    context.clearRect(this.width, this.height)
    context.save()

    // set color filter
    const brightness = Math.max(0, Math.cos(this.dayPhase / 2))
    context.filter = `brightness(${brightness}%)`

    // draw field

    // draw plants

    // draw bunnies

    // draw wolves

    context.restore()
  }
}

/**
 * 
 */
export class DotWorldController {
  /**
   * 
   * @param {*} canvasId 
   */
  constructor(canvasId) {
    /** @type {HTMLCanvasElement} */
    this.canvas = document.getElementById(canvasId)
    /** @type {CanvasRenderingContext2D} */
    this.context = this.canvas.getContext('2d')

    const size = new Size(this.canvas.width, this.canvas.height)
    this.dotWorld = new DotWorld(size)
    this.simulation = new Simulation(this.dotWorld, this.context)
  }

  onStart() {
    this.simulation.start()
  }

  onStop() {
    this.simulation.stop()
  }

}