import { Size } from "/js/common/geom.mjs";
import { Demo } from "/js/components/demo.mjs";
import { TimeControls } from "/js/components/time-controls.mjs"
import { Environment } from "/science/computing/simulation/environment.mjs";
import { Simulation } from "/science/computing/simulation/simulation.mjs";

// Collect UI elements
const demo = new Demo('canvas-dot-product')
const controls = new TimeControls('button-start','button-stop')

const environment = new Environment(new Size(demo.canvas.width, demo.canvas.height))
const scenarios = []
// Initialize Model
const simulation = new Simulation(environment, scenarios, (enviro,offset)=> {
  demo.context.clearRect(0, 0, demo.canvas.width, demo.canvas.height)
  // TODO: render the environment
})

// Setup Event Listeners
// == demo.canvas mouseListeners
// == demo.canvas keyListeners
controls.buttonStart.onclick = (event)=>{
    
}
controls.buttonSttop.onclick = (event)=>{

}

// Start Engine
gameEngine.start()
