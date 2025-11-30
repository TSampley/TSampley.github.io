
import './constants.mjs'

/**
 * TODO: create Pendulum demo section in simulation integrators page
 */
export class Pendulum {

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

    /**
     * Progresses the pendulum simulation by `dt`
     * 
     * @param {number} dt Change in time for this simulation step.
     */
    step(dt) {
        // force = mass * gravity_accel
        // angularAccel = 

        this.angle += this.angularVelocity * dt
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} context 
     */
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
