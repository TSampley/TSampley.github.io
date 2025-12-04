
import { AtomicProperties } from './atomic-properties.mjs'
import { Elements } from './element.mjs'
import { Timer } from '../../scripts/common/timer.mjs';

import { SoundBoard } from '../../scripts/audio/sound-board.mjs';

import { WorldController } from '../computing/simulation/world-controller.mjs';
import { Simulation } from '../computing/simulation/simulation.mjs';

import { Particle } from '../physics/mechanics/particle.mjs'

import { Demo } from '../../scripts/components/demo.mjs'
import { Environment, forceMatricChemistry as forceMatrixChemistry } from '../computing/simulation/environment.mjs';

const displayParagraph = document.getElementById('sim-display')
const displayCharge = document.getElementById('sim-charge')
const buttonChargeUp = document.getElementById('sim-charge-up')
const buttonChargeDown = document.getElementById('sim-charge-down')
const buttonReset = document.getElementById('sim-reset')
const demo = new Demo('hydrogen-bulk');
const uiElements = {
    displayParagraph: document.getElementById('sim-display'),
    displayCharge: document.getElementById('sim-charge'),
    buttonChargeUp: document.getElementById('sim-charge-up'),
    buttonChargeDown: document.getElementById('sim-charge-down'),
    divForceInputs: document.getElementById('sim-force-inputs'),
    forceBoundary: document.getElementById('sim-force-boundary'),
    forceDrag: document.getElementById('sim-force-drag'),
    forceGravity: document.getElementById('sim-force-gravity'),
    forceCoulomb: document.getElementById('sim-force-coulomb'),
    forceLennardJones: document.getElementById('sim-force-lennard-jones'),
    inputGravity: document.getElementById('input-gravity'),
    inputRunning: document.getElementById('input-running'),
    buttonReset: document.getElementById('sim-reset'),
    table: Object.values(Elements).map((value)=>{
        console.log(`retrieved: ${value.name}`)
        document.getElementById(`ptable-${value.name.toLowerCase()}`)
    })
}

let forces = forceMatrixChemistry()
let environment = new Environment(500, 500, forces)
let simulation = new Simulation(environment)
let timer = new Timer()
let controller = new WorldController(simulation,timer)

const hydrogenParticle = new Particle(0,0,new AtomicProperties(Elements.Hydrogen, 0, 1))
controller.onSetDisplay = (display)=>{
    displayParagraph.innerText = display
}
controller.onSetCharge = (charge)=>{
    displayCharge.innerText = charge
}

buttonChargeUp.onclick = ()=>{
    controller.incrementCharge()
}
buttonChargeDown.onclick = ()=>{
    controller.decrementCharge()
}

// Object.values(controller.simulation.environment.forceMatrix).forEach(force => {
//     uiElements.divForceInputs.innerHTML += 
//         `<li><label for='${force.id}'>${force.name}</label><input type='checkbox' id='${force.id}'></li>`
//     const element = document.getElementById(force.id)
//     uiElements[force.id] = element

//     console.log(`${force.id} returned element: ${element.id}`)

//     element.checked = true
//         // controller.simulation.environment.forceMatrix[force.id].isEnabled
//         element.onclick = (event)=>{
//             console.log('click')
//         }
//     element.onchange = (event)=>{
//         console.log(`${force.id} checked ${event.target.checked}`)
//         controller.simulation.environment.forceMatrix[force.id].isEnabled = event.target.checked
//     }
// });
uiElements.forceBoundary.checked = controller.simulation.environment.forceMatrix.boundaries.isEnabled
uiElements.forceBoundary.onchange = (event)=>{
    controller.simulation.environment.forceMatrix.boundaries.isEnabled = event.target.checked
}
uiElements.forceDrag.checked = controller.simulation.environment.forceMatrix.drag.isEnabled
uiElements.forceDrag.onchange = (event)=>{
    controller.simulation.environment.forceMatrix.drag.isEnabled = event.target.checked
}
uiElements.forceGravity.checked = controller.simulation.environment.forceMatrix.gravity.isEnabled
uiElements.forceGravity.onchange = (event)=>{
    controller.simulation.environment.forceMatrix.gravity.isEnabled = event.target.checked
}
uiElements.forceCoulomb.checked = controller.simulation.environment.forceMatrix.charge.isEnabled
uiElements.forceCoulomb.onchange = (event)=>{
    controller.simulation.environment.forceMatrix.charge.isEnabled = event.target.checked
}
uiElements.forceLennardJones.checked = controller.simulation.environment.forceMatrix.lennardJones.isEnabled
uiElements.forceLennardJones.onchange = (event)=>{
    controller.simulation.environment.forceMatrix.lennardJones.isEnabled = event.target.checked
}
uiElements.inputRunning.checked = controller.isRunning
uiElements.inputRunning.onchange = (event)=>{
    controller.isRunning = event.target.checked
}
buttonReset.onclick = ()=>{
    controller.reset()
}
document.getElementById('ptable-hydrogen').onclick = ()=>{
    controller.setParticle(hydrogenParticle)
}
document.getElementById('ptable-helium').onclick = ()=>{
    controller.setParticle(new Particle(0,0,new AtomicProperties(Elements.Helium, 0, 2)))
}
document.getElementById('ptable-lithium').onclick = ()=>{
    controller.setParticle(new Particle(0,0,new AtomicProperties(Elements.Lithium, 0, 3)))
}
document.getElementById('ptable-carbon').onclick = ()=>{
    controller.setParticle(new Particle(0,0,new AtomicProperties(Elements.Carbon, 0, 6)))
}
document.getElementById('ptable-nitrogen').onclick = ()=>{
    controller.setParticle(new Particle(0,0,new AtomicProperties(Elements.Nitrogen, 0, 7)))
}
document.getElementById('ptable-oxygen').onclick = ()=>{
    controller.setParticle(new Particle(0,0,new AtomicProperties(Elements.Oxygen, 0, 8)))
}
demo.addMouseDownListener((event)=>{
    const x = event.offsetX;
    const y = event.offsetY;
    controller.spawn(x,y)
    SoundBoard.playPop()
})

controller.simulation.environment.width = demo.canvas.width
controller.simulation.environment.height = demo.canvas.height

controller.simulation.environment.onCollide = SoundBoard.playClack
controller.simulation.environment.onBounce = SoundBoard.playWoop

let lastTime = 0;
function animate(timestamp) {
    let diff = timestamp - lastTime;

    if (controller.isRunning) {
        controller.simulation.step(diff)
    }

    demo.context.clearRect(0, 0, demo.canvas.width, demo.canvas.height);

    controller.drawParticles(demo.context)
    
    lastTime = timestamp;
    
    requestAnimationFrame(animate);
}

controller.setParticle(hydrogenParticle)
controller.setCharge(0)

controller.simulation.environment.forceMatrix.lennardJones.isEnabled = false
// controller.simulation.environment.forceMatrix.charge.isEnabled = false
controller.simulation.environment.forceMatrix.drag.isEnabled = false
// controller.simulation.environment.forceMatrix.gravity.isEnabled = true
// controller.simulation.environment.forceMatrix.boundaries.isEnabled = true

animate(0);