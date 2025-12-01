
import '../constants.mjs'

import { Entity } from '../../../computing/simulation/entity.mjs'

/**
 * TODO: create Pendulum demo section in simulation integrators page
 * 
 * TODO: create other pendulums
 *   - charged pendulum: weight also affected by charge
 *   - stiff pendulum: weight at fixed radius from anchor
 *   - rope pendulum: weight at max radius from anchor
 *   - spring pendulum: weight on spring
 */
export class Pendulum extends Entity {

    /**
     * 
     * @param {number} x Anchor x-coordinate.
     * @param {number} y Anchor y-coordinate.
     * @param {number} length Pendulum rope length.
     * @param {number} startAngle Pendulum weight starting position relative to 
     * the anchor.
     * @param {*} angularVelocity Pendulum weight starting angular velocity.
     */
    constructor(x,y,length,startAngle,angularVelocity) {
        this.anchorX = x
        this.anchorY = y
        this.length = length
        this.angle = startAngle
        this.angularVelocity = angularVelocity
    }

    step(dt,environment) {
        const angularAccel = environment.gravity * Math.cos(this.angle)

        this.angularVelocity += angularAccel * dt

        this.angle += this.angularVelocity * dt
    }

    draw(context) {
        const weightX = Math.cos(this.angle) * this.length
        const weightY = Math.sin(this.angle) * this.length

        // draw rope
        context.strokeStyle = "white"
        context.moveTo(this.anchorX, this.anchorY)
        context.lineTo(weightX, weightY)
        context.stroke()
        // draw anchor
        context.fillStyle = "white"
        context.ellipse(this.anchorX, this.anchorY, 10, 10, 0, 0, Math.PI*2)
        context.fill()
        // draw weight
        context.fillStyle = "white"
        context.ellipse(weightX, weightY, 20, 20)
        context.fill()
    }
}
