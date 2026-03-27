
import 'science/physics/mechanics/constants.mjs'

import { Entity } from '/science/computing/simulation/entity.mjs'
import { Render2D } from 'science/computing/simulation/simulation.mjs'

/**
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
}

/**
 * Renders a {@codelink Pendulum} in a 2D context.
 */
export class PendulumRender extends Render2D {
    /**
     * 
     * @param {CanvasRenderingContext2D} context 
     * @param {Pendulum} subject The subject to render.
     * @param {number} offset 
     */
    render(context, subject, offset) {
        const weightX = Math.cos(subject.angle) * subject.length
        const weightY = Math.sin(subject.angle) * subject.length

        // draw rope
        context.strokeStyle = "white"
        context.moveTo(subject.anchorX, tsubjecthis.anchorY)
        context.lineTo(weightX, weightY)
        context.stroke()
        // draw anchor
        context.fillStyle = "white"
        context.ellipse(subject.anchorX, subject.anchorY, 10, 10, 0, 0, Math.PI*2)
        context.fill()
        // draw weight
        context.fillStyle = "white"
        context.ellipse(weightX, weightY, 20, 20)
        context.fill()
    }
}
