
/**
 * 
 */
export class Component {
  constructor() {

  }
}

/**
 * 
 */
export class SvgEditor extends Component {
  constructor() {
    super()
    this.canvas = document.getElementById('canvas')
    this.context = this.canvas.getContext('2d')

    this.toolbar = document.getElementById('toolbar')
  }

  resizeCanvas() {
    const width = this.canvas.clientWidth
    const height = this.canvas.clientHeight

    if (width != this.canvas.width || height != this.canvas.height) {
      console.info('SvgEditor.resizeCanvas')
      this.canvas.width = width
      this.canvas.height = height
    }
  }
}

const editor = new SvgEditor()
const observer = new ResizeObserver(()=>editor.resizeCanvas())
observer.observe(editor.canvas)
editor.resizeCanvas()
