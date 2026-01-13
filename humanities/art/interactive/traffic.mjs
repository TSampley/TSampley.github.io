import { Observable, single } from "../../../js/common/observables.mjs"
import { Environment } from "../../../science/computing/simulation/environment.mjs"

console.debug('==start traffic.mjs')

export class TrafficWorld extends Environment {
  constructor(size) {
    super(size)

    this.cars = []
  }

  step(delta) {
    for (const car of this.cars) {
      car.step(delta)
    }
  }

  draw(canvas,offset) {
    for (const car of this.cars) {
      car.draw(canvas,offset)
    }
  }

  // draw3d() {
    // TODO: add aquarium glass border for city-scapes with abrupt borders as alternative to distance fog
  // }
}

export class CanvasController {
  constructor(canvasId) {
    /** @type {HTMLCanvasElement} */
    this.canvas = document.getElementById(canvasId)
    /** @type {CanvasRenderingContext2D} */
    this.context = this.canvas.getContext('2d')
  }
}

export class TrafficController {
  constructor() {
    /** @type {Observable<CanvasController?>} */
    this.canvasController = single(null)
  }

  bind(canvasId) {
    console.info(`bind ${canvasId}`)
    const controller = new CanvasController(canvasId)
    this.canvasController.value = controller
  }
}

addEventListener('load', ()=>{
  // TODO: on load start traffic simulation
})

// region Expose Event Functions to Window

window.enterFullscreen = function() {
  alert('going fullscreen!')
}

// endregion

console.debug('==end traffic.mjs')
