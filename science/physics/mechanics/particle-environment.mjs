import { Size } from "/js/common/geom.mjs";
import { NoOp } from "/js/common/fns.mjs";
import { Observable, single } from "/js/common/observables.mjs";
import { ForceMatrix } from "/chemistry/computational/force-matrix.mjs";
import { Environment } from "/science/computing/simulation/environment.mjs";

/**
 */
export class ParticleEnvironment extends Environment {
  /**
   * @param {Size} size 
   * @param {ForceMatrix} forceMatrix 
   */
  constructor(size,forceMatrix) {
    super(size)
    /** @type {Observable<ForceMatrix>} */
    this.forceMatrix = single(forceMatrix)
    console.log("Creating force matrix observable with value: " + JSON.stringify(forceMatrix))
    console.log("Property" + JSON.stringify(this.forceMatrix.value))
    this.timeScale = 1E-6
    this.hardCollisions = true

    /** @type {Array<Particle>} */
    this.particleList = new Array()

    /** @type {()=>void} */
    this.onBounce = NoOp.f0
    /** @type {()=>void} */
    this.onCollision = NoOp.f0
  }
  
  /** @param {number} delta */
  step(delta) {
    const step = delta * this.timeScale
    // Clear previous state
    for (const particle of this.particleList) {
      particle.clearForces()
    }

    // Calculate all forces and collisions
    const particleForces = this.particleForces().filter((value) => {
      return value.isEnabled
    })
    const environmentForces = this.environmentForces().filter((value) => {
      return value.isEnabled
    })
    const max = this.particleList.length
    for (let alphaIndex = 0; alphaIndex < max; alphaIndex++) {
      const alpha = this.particleList[alphaIndex]
      for (let betaIndex = alphaIndex + 1; betaIndex < max; betaIndex++) {
        const beta = this.particleList[betaIndex]
        particleForces.forEach((force) => {
          force.applyForce(step, alpha, beta)
        })
      }
      environmentForces.forEach((force) => {
        force.applyForce(step, alpha)
      })
      // TODO: check accumulated force here
    }

    // Integrate entities
    for (const particle of this.particleList) {
      particle.integrate(step)
    }

    // Resolve collisions
    for (let index = 0; index < max; index++) {
      const alpha = this.particleList[index]
      if (this.hardCollisions) {
        for (let otherIndex = index + 1; otherIndex < max; otherIndex++) {
          const beta = this.particleList[otherIndex]
          this.checkParticleCollision(alpha, beta, )
        }
      }
      this.checkEnvironmentCollision(alpha, )
    }
  }

  /**
   * @param {Particle} subject
   */
  checkEnvironmentCollision(subject) {
    if (subject.x > this.width) {
      this.onBounce();
      subject.vx *= -this.forceMatrix.value.boundaries.value;
      subject.x = 2 * this.width - subject.x;
    } else if (subject.x < 0) {
      this.onBounce();
      subject.vx *= -this.forceMatrix.value.boundaries.value;
      subject.x = -subject.x;
    }

    if (subject.y > this.height) {
      this.onBounce();
      subject.vy *= -this.forceMatrix.value.boundaries.value;
      subject.y = 2 * this.height - subject.y;
    } else if (subject.y < 0) {
      this.onBounce();
      subject.vy *= -this.forceMatrix.value.boundaries.value;
      subject.y = -subject.y;
    }
  }

  /**
   * Checks the two particles against each other for collision and resolves
   * it if detected, applying appropriate forces to each particle.
   * 
   * @param {Particle} alpha The first particle to check for collision. 
   * @param {Particle} beta The other particle to check for collision. 
   */
  checkParticleCollision(alpha, beta) {
    // Calculate vector between particles
    const deltaX = beta.x - alpha.x
    const deltaY = beta.y - alpha.y
    const deltaSqr = deltaX * deltaX + deltaY * deltaY;

    // Calculate Properties
    const radiusSum = alpha.props.atomicRadius + beta.props.atomicRadius
    const radiusSumSqr = radiusSum * radiusSum
    const alphaMass = alpha.props.mass
    const betaMass = beta.props.mass
    const totalMass = alphaMass + betaMass
    const massDiff = alphaMass - betaMass

    // Ensure particles within collision range
    if (deltaSqr <= radiusSumSqr) {
      const velX = beta.vx - alpha.vx
      const velY = beta.vy - alpha.vy
      const dotProd = velX * deltaX + velY * deltaY
      // ensure velocities are opposed before reversing
      if (dotProd < 0) {
        // Resolve Collision

        // decompose velocity into parallel and opposing components
        const alphaDiffMag = (alpha.vx * deltaX + alpha.vy * deltaY) / deltaSqr
        const alphaTanMag = (alpha.vx * deltaY - alpha.vy * deltaX) / deltaSqr
        const betaDiffMag = (beta.vx * deltaX + beta.vy * deltaY) / deltaSqr
        const betaTanMag = (beta.vx * deltaY - beta.vy * deltaX) / deltaSqr

        // calculate new components along collision path
        const finalAlphaDiffMag = (massDiff / totalMass) * alphaDiffMag + 2 * betaMass / totalMass * betaDiffMag
        const finalBetaDiffMag = 2 * alphaMass / totalMass * alphaDiffMag - (massDiff / totalMass) * betaDiffMag

        // recompose new velocities
        alpha.vx = finalAlphaDiffMag * deltaX + alphaTanMag * deltaY
        alpha.vy = finalAlphaDiffMag * deltaY + alphaTanMag * (-deltaX)
        beta.vx = finalBetaDiffMag * deltaX + betaTanMag * deltaY
        beta.vy = finalBetaDiffMag * deltaY + betaTanMag * (-deltaX)

        this.onCollide()
      }

      // nudge particles unconditionally
      const deltaMag = Math.sqrt(deltaSqr)
      const diff = radiusSum - deltaMag
      const nudgeX = diff * deltaX / (deltaMag * totalMass);
      const nudgeY = diff * deltaY / (deltaMag * totalMass);
      alpha.x -= nudgeX * betaMass;
      alpha.y -= nudgeY * betaMass;
      beta.x += nudgeX * alphaMass;
      beta.y += nudgeY * alphaMass;
    }
  }

  particleForces() {
      return [
          this.forceMatrix.value.coulomb,
          this.forceMatrix.value.lennardJones
      ]
  }

  environmentForces() {
      return [
          this.forceMatrix.value.boundaries,
          this.forceMatrix.value.drag,
          this.forceMatrix.value.gravity
      ]
  }
}

const DefaultGenerator = (x, y) => { return new Particle(x, y); }
const PassTest = (x, y) => { return true; }
const DefaultStep = 0.5

/*
TODO: consider Generator abstract class with common initialization function, each
  with its own configuration.
 */

/**
 * @param {ParticleEnvironment} simulation The subject simulation to initialize particles within.
 * @param {number} centerX The x coordinate of the center of the circle to initialize particles within.
 * @param {number} centerY The y coordinate of the center of the circle to initialize particles within.
 * @param {number} radius The radius of the circle to initialize particles within.
 */
function initializeCircle(environment, centerX, centerY, radius) {
  let radiusSqr = radius * radius
  initializePoints(
    environment,
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
 * @param {ParticleEnvironment} environment The subject simulation to initialize particles within.
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
  environment,
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
        environment.particleList.push(generator(x, y));
      }
      x += stepx;
    }
    y += stepy;
  }
}
