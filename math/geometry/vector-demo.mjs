

import { Render2D } from '/science/computing/simulation/render.mjs'
import { Vector2D } from './vector.mjs'

/**
 * 
 * @param {CanvasRenderingContext2D} context 
 * @param {(CanvasRenderingContext2D)=>void} render 
 */
function tempState(context,render) {
  context.save()
  render(context)
  context.restore()
}

/**
 * MARK: Model
 */
export class VectorDemoModel extends EventTarget {
  /**
   * @param {Vector2D[]} vectorList
   */
  constructor(vectorList) {
    super()
    this.vectorList = vectorList || []
  }

  #state() {
    return {
      vectorList: this.vectorList.slice()
    }
  }

  #emitEvent() {
    this.dispatchEvent(new CustomEvent('state', { detail: this.#state() }))
  }

  /**
   * 
   * @param {Vector2D|{x:number,y:number}} vector 
   */
  setPosition(vector) {
    if (this.vectorList.length == 0) {
      this.vectorList.push(new Vector2D(vector.x, vector.y))
    } else {
      const v = this.vectorList[0]
      v.x = vector.x; v.y = vector.y;
    }

    this.#emitEvent()
  }
}

/**
 * MARK: UI
 */
export class VectorDemoUi {
  constructor(canvasId) {
    this.canvas = e(canvasId)
    this.context = this.canvas.getContext('2d')
  }

  bind(
    onStart,
    onMove,
    onEnd
  ) {
    
  }
}
function e(id) { return document.getElementById(id) }

/**
 * @extends {Render2D<Vector2D>}
 */
export class VectorRender extends Render2D {
  /**
   * @override
   * @param {CanvasRenderingContext2D} context 
   * @param {Vector2D} subject 
   */
  render(context,subject) {
    tempState(context, (context) => {
      context.strokeStyle = 'black'
      context.lineWidth = 2
      context.lineCap = 
      context.beginPath()
      context.moveTo(0, 0)
      context.lineTo(subject.x, subject.y)
      context.stroke()
    })
  }
}

/**
 * MARK: Presenter 
 */
export class VectorDemoPresenter {
  /**
   * @param {VectorDemoUi} model 
   * @param {VectorDemoModel} ui 
   */
  constructor(model,ui) {
    this.ui = ui
    this.model = model
  }

  /**
   * Add listeners to components in `ui` to pass events on to `model`
   */
  bind() {
    // Add listeners to components in `ui`
    this.ui.canvas.addEventListener('mousedown', (event)=> {
      const position = { x: event.clientX, y: event.clientY }
      console.info(`mousedown: ${event.clientX}, ${event.clientY}`)

      this.model.setPosition(position)
    })
    this.ui.canvas.addEventListener('mousemove', (event)=> {
      const position = { x: event.clientX, y: event.clientY }
      console.info(`mousemove: ${event.clientX}, ${event.clientY}`)
      
      this.model.setPosition(position)
    })
    this.ui.canvas.addEventListener('mouseup', (event)=> {
      console.info(`mouseup: ${event.clientX}, ${event.clientY}`)
      
    })

    // add model event listeners to update ui state
    const vectorRender = new VectorRender()
    this.model.addEventListener('state', (event) => {
      const detail = event.detail
      console.info('onState: ', detail)
      
      requestAnimationFrame((time) => {
        const vectorList = detail.vectorList

        vectorList.forEach((vector)=>{
          vectorRender.render(this.ui.context, vector)
        })
      })
    })
  }
}
