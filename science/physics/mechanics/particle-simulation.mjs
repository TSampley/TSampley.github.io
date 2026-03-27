import { Simulation } from "../../computing/simulation/simulation.mjs"
import { ParticleEnvironment } from "./particle-environment.mjs";

/**
 * 
 * @template {ParticleEnvironment} E
 */
export class ParticleSimulation extends Simulation {
  /**
   * @param {E} environment
   * @param {any} context
   * @param {Array<Scenario<E>>} scenarios
   */
  constructor(environment,context,scenarios) {
    super(environment,context,scenarios)
  }
}

// region Generators

const DefaultGenerator = (x, y) => { return new Particle(x, y); }
const PassTest = (x, y) => { return true; }
const DefaultStep = 0.5

/*
TODO: consider Generator abstract class with common initialization function, each
  with its own configuration.
 */

/**
 * @param {ParticleSimulation} simulation The subject simulation to initialize particles within.
 * @param {number} centerX The x coordinate of the center of the circle to initialize particles within.
 * @param {number} centerY The y coordinate of the center of the circle to initialize particles within.
 * @param {number} radius The radius of the circle to initialize particles within.
 */
function initializeCircle(simulation, centerX, centerY, radius) {
  let radiusSqr = radius * radius
  initializePoints(
    simulation,
    centerX - radius,
    centerX + radius,
    centerY - radius,
    centerY + radius,
    test = (x, y) => {
      let xDif = x - centerX;
      let yDif = y - centerY;
      return xDif * xDif + yDif * yDif <= radiusSqr
    }
  )
}

/**
 * Initializes particles within the rectangular bounds defined by
 * left, right, top, and bottom, with points spaced 
 * using stepx, and stepy. Only points for which {@link test} 
 * returns true will be passed to {@link generator} to
 * create a new particle.
 * @param {ParticleSimulation} simulation The subject simulation to initialize particles within.
 * @param {number} left
 * @param {number} right
 * @param {number} top
 * @param {number} bottom
 * @param {number} stepx
 * @param {number} stepy
 * @param {(x:number,y:number)=>Boolean} test
 * @param {(x:number,y:number)=>Particle} generator
 */
function initializePoints(
  simulation,
  left, right, top, bottom,
  stepx = DefaultStep,
  stepy = DefaultStep,
  test = PassTest,
  generator = DefaultGenerator
) {
  // iterate over bounds to generate points
  var y = top;
  while (y < bottom) {
    var x = left;
    while (x < right) {
      // check for points in path
      if (test(x, y)) {
        simulation.particleList.push(generator(x, y));
      }
      x += stepx;
    }
    y += stepy;
  }
}


// endregion
