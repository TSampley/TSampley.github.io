
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
    this.canvas = document.getElementById('canvas')
    this.context = this.canvas.getContext('2d')

    this.toolbar = document.getElementById('toolbar')
  }
}

const editor = new SvgEditor()
