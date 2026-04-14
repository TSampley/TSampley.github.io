/*
 * Copyright (c) 2026 Taush Sampley
 * This software is released under the GPL-3.0 License.
 * See LICENSE file in the project root for full license information.
 * 
 * dot-world.mjs
 */

import { Point, Size } from "/js/common/geom.mjs";
import { Render2D } from "/science/computing/simulation/render.mjs";
import { Simulation } from "/science/computing/simulation/simulation.mjs";
import { Environment } from "/science/computing/simulation/environment.mjs";
import { Entity } from "/science/computing/simulation/entity.mjs";


/**
 * Seconds per day
 * 
 * TODO: rename to SECONDS_PER_DAY
 */
const DAY_PERIOD = 1000
/**
 * Days per year
 * TODO: rename to DAYS_PER_YEAR
 */
const YEAR_PERIOD = 100

/**
 * Earth's axial tilt in radians. 
 * https://en.wikipedia.org/wiki/Axial_tilt
 */
export const EARTH_TILT = 23.5 * Math.PI / 180
/**
 * Oklahoma's approximate latitude in radians.
 * https://en.wikipedia.org/wiki/Oklahoma
 */
export const OK_LAT = 35 * Math.PI / 180

/**
 * Solar flux in kilowatts per square meter emitted by the sun.
 * https://en.wikipedia.org/wiki/Solar_constant
 */
export const SUN_POWER_FLUX = 1.361 // kW/m^2

/**
 * A world full of dots, interacting in social (or ecological) simulations.
 * 
 * TODO: plant/heat dynamics
 * - once plants reach size/cycle, produce flowers
 * - flowers produce seeds that disperse on wind
 * - wind determined by air temperatures driving convection
 * 
 * TODO: consider other animals, fungi, members of ecosystem
 * - 
 */
export class DotWorld extends Environment {

  /**
   * @param {Size} size
   */
  constructor(size, axisOffset = EARTH_TILT, latitude = OK_LAT) {
    super(size)

    /** @type {Plant[]} */
    this.plants = []
    /** @type {Bunny[]} */
    this.bunnies = []
    /** @type {Wolf[]} */
    this.wolves = []

    /** Total elapsed time in seconds. @type {number} */
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
    /** [0, YEAR_PERIOD) */
    // const year = Math.floor(days / YEAR_PERIOD)
    /** [0, YEAR_PERIOD) */
    const dayOfYear = days % YEAR_PERIOD
    /** [0, 1) */
    const annualPhase = dayOfYear / YEAR_PERIOD
    /** [0, 2Pi) */
    const seasonPhase = Math.PI * 2 * annualPhase

    // == determine weather conditions ==
    const irradiance = DotWorld.irradianceAtLatitude(this.axisOffset, this.latitude, seasonPhase, dayPhase * 2 * Math.PI)
    const cloudCover = this.cloudCover(this.latitude, this.longitude)
    const precipitation = this.precipitation(this.latitude, this.longitude)
    // determine light transmission through atmosphere - simply use cloud cover for now, but could be more complex with dust, pollution, etc.
    // const reflectionFactor = 0.3
    // const absorptionFactor = 0.7
    // const absorbedEnergy = irradiance * cloudCover * absorptionFactor // heats clouds
    // const reflectedEnergy = irradiance * cloudCover * reflectionFactor // reflected back to space

    // determine energy contributed across environment
    const energyFlux = irradiance * (1 - cloudCover) // kW/m^2

    // plants grow, reproduce, die
    for (const plant of this.plants) {
      const surfaceArea = plant.size || Math.PI * 100
      const incidentEnergy = surfaceArea * energyFlux

      plant.absorb(precipitation, incidentEnergy)
    }

    // bunnies forage, reproduce, die
    for (const bunny of this.bunnies) {
      // 
      bunny.step(delta)
    }

    // wolves hunt, reproduce, die
    for (const wolf of this.wolves) {
      // 
      wolf.step(delta)
    }
  }

  spawnPlant(x, y) {
    this.plants.push(new Plant(new Point(x, y)))
  }

  spawnBunny(x, y) {
    this.plants.push(new Bunny(new Point(x, y)))
  }

  spawnWolf(x, y) {
    this.plants.push(new Wolf(new Point(x, y)))
  }

  /**
   * Calculates the irradiance at a given latitude and season phase in kilowatts per square meter.
   * 
   * @param {number} axisOffset The axial tilt of the world in radians. 0 means no tilt; positive means the northern hemipshere is tilted towards the star(s) at seasonPhase=0, negative means the southern hemisphere is tilted towards the star(s) at seasonPhase=0.
   * @param {number} latitude Determines the incident angle, in radians. 0 at equator, positive northward, negative southward.
   * @param {number} seasonPhase Determines the distance from the world's star(s), in radians. 0 at northern summer solstice, Pi at northern winter solstice.
   * @param {number} hourAngle Determines the time of day, in radians. 0 at solar noon, Pi at solar midnight.
   * @returns {number} The irradiance at the given latitude and season phase, in Kilowatts per square meter (kW/m^2).
   */
  static irradianceAtLatitude(axisOffset, latitude, seasonPhase, hourAngle) {
    const declination = axisOffset * Math.cos(seasonPhase)
    const zenithAngle = Math.acos(Math.sin(latitude) * Math.sin(declination) +
      Math.cos(latitude) * Math.cos(declination) * Math.cos(hourAngle))
    return SUN_POWER_FLUX * Math.max(0, Math.cos(zenithAngle))
  }

  /**
   * 
   * 
   * @param {number} latitude 
   * @param {number} longitude 
   * @returns {number} cloud cover as a percentage [0, 1]
   */
  cloudCover(latitude, longitude) {
    return Math.max(0, Math.cos(latitude + longitude + this.time / 10000))
  }

  /**
   * 
   * @param {number} latitude 
   * @param {number} longitude 
   * @returns {number} The temperature in degrees Celsius.
   */
  temperature(latitude, longitude) {
    return -5 + 30 * Math.cos(latitude + longitude + this.time / 10000)
  }

  /**
   * @param {number} latitude
   * @param {number} longitude
   * @returns {number} The amount of precipitation in millimeters.
   */
  precipitation(latitude, longitude) {
    const clouds = this.cloudCover(latitude, longitude)
    const tempFactor = (Math.max(30, Math.min(30, this.temperature(latitude, longitude))) - 30) / 30
    // naive model: if temperature factor is below the cloud cover percentage, it precipitates
    const diff = clouds - tempFactor
    return diff > 0 ? diff / 10 : 0
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
    this.dotRender = new DotRender()

    const size = new Size(this.canvas.width, this.canvas.height)
    this.dotWorld = new DotWorld(size)
    this.simulation = new Simulation(this.dotWorld, this.context, this.onDraw)
  }

  onStart() {
    this.simulation.start()
  }

  onStop() {
    this.simulation.stop()
  }

  onDraw(environment, offset) {
    this.dotRender.render(this.context, environment, offset)
  }
}

class Plant extends Entity {
  absorb(precipitation, energy) {
    this.water += precipitation
    this.energy += energy
  }
}

class Bunny extends Entity {

}

class Wolf extends Entity {

}

/**
 * @param {DotWorld} subject
 */
class DotRender extends Render2D {

  /**
   * 
   * @param {CanvasRenderingContext2D} context 
   * @param {DotWorld} subject
   * @param {number} offset 
   */
  render(context,subject) {
    // clear area
    context.clearRect(this.width, this.height)
    context.save()

    // set color filter
    const brightness = Math.max(0, Math.cos(this.dayPhase / 2))
    context.filter = `brightness(${brightness}%)`

    // draw field
    context.fillStyle = 'green'
    context.fillRect(0, 0, this.width, this.height)

    subject.plants.forEach(plant => {
      console.info(`draw plant at ${plant.position}`)
    })

    subject.bunnies.forEach(bunny => {
      console.info(`draw bunny at ${bunny.position}`)
    })

    subject.wolves.forEach(wolf => {
      console.info(`draw wolf at ${wolf.position}`)
    })

    context.restore()
  }
}
