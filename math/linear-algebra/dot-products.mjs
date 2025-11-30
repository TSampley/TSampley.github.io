import { Demo } from "../../scripts/components/demo.mjs";
import { TimeControls } from "../../scripts/components/time-controls.mjs"
import { Simulation } from "../../scripts/physics/simulation.mjs";

// Collect UI elements
const demo = new Demo('canvas-dot-product')
const controls = new TimeControls('button-start','button-stop')

// Initialize Model
const simulation = new Simulation()

// Setup Event Listeners
// == demo.canvas mouseListeners
// == demo.canvas keyListeners
controls.buttonStart.onclick = (event)=>{
    
}
controls.buttonSttop.onclick = (event)=>{

}

// Start Engine
gameEngine.start()
