
import { Scenario } from "/science/computing/simulation/scenario.mjs"
import { Timer } from "../../../js/common/timer.mjs"
import { Demo } from "../../../js/components/demo.mjs"

/**
 * This demo illustrates basic color theory.
 * 
 * TODO: Implement the following modes:
 * 
 * Mode 1 - Quiz: Adjust the RGB values to match the target color.
 * Mode 2 - Exploration: Experiment with RGB values to see resulting colors.
 * Mode 3 - Other Color Models: Explore colors using HSL and CMYK models.
 */
class ColorTheoryDemo extends Demo {

  /**
   * @type {(number)=>void} assignValue 
   */
  #colorUpdater(assignValue) {
    return (element)=>{
      const floatValue = parseFloat(element.target.value)
      assignValue(floatValue)
      updateColor()
    }
  }

  constructor() {
    super('demo-color-theory')

    this.slider1 = document.getElementById('slider1')
    this.slider2 = document.getElementById('slider2')
    this.slider3 = document.getElementById('slider3')
    this.slider4 = document.getElementById('slider4')
    this.toggle = document.getElementById('toggle')

    this.value1 = 0
    this.value2 = 0
    this.value3 = 0
    this.value4 = 0
    
    this.slider1.addEventListener('change',this.#colorUpdater((v)=>this.value1=v))
    this.slider2.addEventListener('change',this.#colorUpdater((v)=>this.value2=v))
    this.slider3.addEventListener('change',this.#colorUpdater((v)=>this.value3=v))
    this.slider4.addEventListener('change',this.#colorUpdater((v)=>this.value4=v))
    
    this.toggle.onchange = (element)=>{
      if (element.target.checked) {
        // HSV to CMYK
        const [c, m, y, k] = hsvToCmyk(this.value1, this.value2, this.value3)
        this.value1 = c
        this.value2 = m
        this.value3 = y
        this.value4 = k
      } else {
        // CMYK to HSV
        const [h, s, v] = cmykToHsv(this.value1, this.value2, this.value3, this.value4)
        this.value1 = h
        this.value2 = s
        this.value3 = v 
      }
      this.value1 = 0
      this.value2 = 0
      this.value3 = 0
      this.value4 = 0
      this.setColorModel(
        element.target.checked ? 'cymk' : 'hsv'
      )
    }

    this.worldController = new ColorTheoryDemoController(
      new Timer()
    )

    this.worldController.setScenario(ColorTheoryScenarios.primaryColors)
  }

  /**
   * 
   * @param {'rgb'|'hsv'|'cymk'} model Color model string
   */
  setColorModel(model) {
    switch (model) {
      case 'rgb':
        // Set red slider label
        // set green slider label
        // set blue slider label
        // hide fourth slider
        break
      case 'hsv':
        // set hue slider label
        // set saturation slider label
        // set value slider label
        // hide fourth slider
        break
      case 'cymk':
        // set cyan slider label
        // set yellow slider label
        // set magenta slider label
        // set black slider label
        break
      default:
        console.warn(`Unknown color model: ${model}`)
    }
  }

  /**
   * 
   * @param {number} mode 
   */
  setMode(mode) {
    switch(mode) {
      case 1:
        this.worldController.setScenario(ColorTheoryScenarios.quizMode)
        this.setColorModel('rgb')
        break
      case 2:
        this.worldController.setScenario(ColorTheoryScenarios.explorationMode)
        this.setColorModel('rgb')
        break
      case 3:
        this.worldController.setScenario(ColorTheoryScenarios.otherColorModels)
        if (this.toggle.checked) {
          this.setColorModel('cymk')
        } else {
          this.setColorModel('hsv')
        }
        break
      default:
        console.warn(`Unknown mode: ${mode}`)
    }
  }
}

function rgbToHsv(r, g, b) {
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min
  
  let h = 0
  let s = (max === 0) ? 0 : delta / max
  let v = max
  if (delta !== 0) {
    if (max === r) {
      h = (g - b) / delta + (g < b ? 6 : 0)
    } else if (max === g) {
      h = (b - r) / delta + 2
    } else {
      h = (r - g) / delta + 4
    }
    h /= 6
  }
  return [h, s, v]
}

function hsvToRgb(h, s, v) {
  let r, g, b
  const i = Math.floor(h * 6)
  const f = h * 6 - i
  const p = v * (1 - s)
  const q = v * (1 - f * s)
  const t = v * (1 - (1 - f) * s)
  
  switch (i % 6) {
    case 0: r = v; g = t; b = p; break
    case 1: r = q; g = v; b = p; break
    case 2: r = p; g = v; b = t; break
    case 3: r = p; g = q; b = v; break
    case 4: r = t; g = p; b = v; break
    case 5: r = v; g = p; b = q; break
  }
  return [r, g, b]
}

function rgbToCmyk(r, g, b) {
  const k = 1 - Math.max(r, g, b)
  const c = (1 - r - k) / (1 - k) || 0
  const m = (1 - g - k) / (1 - k) || 0
  const y = (1 - b - k) / (1 - k) || 0
  return [c, m, y, k]
}

function cmykToRgb(c, m, y, k) {
  const r = (1 - c) * (1 - k)
  const g = (1 - m) * (1 - k)
  const b = (1 - y) * (1 - k)
  return [r, g, b]
}

function hsvToCmyk(h, s, v) {
  const rgb = hsvToRgb(h, s, v)
  const [r, g, b] = rgb
  return [...rgbToCmyk(r, g, b), rgb]
}

function cmykToHsv(c, m, y, k) {
  const rgb = cmykToRgb(c, m, y, k)
  const [r, g, b] = rgb
  return [...rgbToHsv(r, g, b), rgb]
}

class ColorTheoryScenario {
  constructor(name, scenarioFunction) {
    this.name = name
    this.scenarioFunction = scenarioFunction
  }
}

export const ColorTheoryScenarios = {
  primaryColors: new ColorTheoryScenario(
    "Primary Colors",
    ()=>{
    }
  ),
  quizMode: new ColorTheoryScenario(
    "Quiz Mode",
    ()=>{
    }
  ),
  explorationMode: new ColorTheoryScenario(
    "Exploration Mode",
    ()=>{
    }
  ),
  otherColorModels: new ColorTheoryScenario(
    "Other Color Models",
    ()=>{
    }
  )
}

/**
 * 
 */
class ColorTheoryDemoController {
  constructor(timer) {
    this.timer = timer
  }

  /**
   * 
   * @param {Scenario} scenario 
   */
  setScenario(scenario) {

  }
}

// Program Start

const demo = new ColorTheoryDemo()
demo.setColorModel('rgb')
demo.setMode(1)