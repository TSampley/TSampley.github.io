
import { AtomicProperties } from './atomic-properties.mjs'
import { Elements } from './element.mjs'

import { Environment, forceMatrixChemistry } from '../computing/simulation/environment.mjs';
import { Simulation } from '../computing/simulation/simulation.mjs';
import { WorldController } from '../computing/simulation/world-controller.mjs';
import { Particle } from '../physics/mechanics/particle.mjs';

import { SoundBoard } from '../../js/audio/sound-board.mjs';
import { Timer } from '../../js/common/timer.mjs';
import { Demo } from '../../js/components/demo.mjs'
import { ChemScenario } from '../computing/simulation/scenario.mjs';

// region Get Elements
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
    inputGravity: document.getElementById('input-gravity'),
    inputRunning: document.getElementById('input-running'),
    buttonReset: document.getElementById('sim-reset'),
    table: Object.values(Elements).map((value)=>{
        const element = document.getElementById(`ptable-${value.name.toLowerCase()}`)
        // TODO: style each element
    })
}
// endregion

// region Model init
let forces = forceMatrixChemistry()
forces.lennardJones.isEnabled = false
forces.drag.isEnabled = false
forces.gravity.isEnabled = false
// scaling: width=600 => width=1200E-12
const scalingFacting = 1 / 2E-11
const scaledWidth = demo.canvas.width / scalingFacting
const scaledHeight = demo.canvas.height / scalingFacting
let environment = new Environment(scaledWidth, scaledHeight, forces)
environment.onCollide = SoundBoard.playClack
environment.onBounce = SoundBoard.playWoop
let simulation = new Simulation(environment)
// endregion

// region Adapters
let timer = new Timer()
let controller = new WorldController(simulation,timer)

// Bind Adapter state to UI
// controller.element.subscribe((value)=>{
//     // TODO: update element display
// });
// controller.charge.subscribe((value)=>{
//     // TODO: update element display
// });
// controller.compound.subscribe((value)=>{
//     // TODO: update compound display (element, charge, neutron count, total mass, etc.)
// })
controller.onSetDisplay = (display)=>{
    displayParagraph.innerText = display
}
controller.onSetCharge = (charge)=>{
    displayCharge.innerText = charge
}
// Bind UI Events to Adapter functions
buttonChargeUp.onclick = (event)=> {
    controller.incrementCharge()
}
buttonChargeDown.onclick = (event)=> {
    controller.decrementCharge()
}

// Initialize Adapter state
controller.isRunning = false
controller.setElement(Elements.Hydrogen)
controller.setCharge(0)

/** @type {()=>Array<Particle>} */
const defaultScenario = new ChemScenario('default',forceMatrixChemistry(),()=>{
    // Initialize Atoms
    const protium = new AtomicProperties(Elements.Hydrogen, -1, 0)
    const leftHydrogen = new Particle(200E-12,500E-11,protium)
    const rightHydrogen = new Particle(11800E-12,500E-11,protium)

    // Direct towards each other
    const speed = 10E-7
    leftHydrogen.vx = speed
    rightHydrogen.vx = -speed

    return [leftHydrogen, rightHydrogen]
})
controller.setScenario(defaultScenario)
controller.reset()
// endregion



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
Object.values(controller.simulation.environment.forceMatrix).forEach(force => {
    const listItem = document.createElement('li')
    /** @type {HTMLInputElement} */
    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    const label = document.createElement('label')
    checkbox.id = force.id
    label.htmlFor = force.id
    label.textContent = force.name
    listItem.append(label, checkbox)
    uiElements.divForceInputs.appendChild(listItem)

    checkbox.checked = controller.simulation.environment.forceMatrix[force.id].isEnabled
    checkbox.onchange = (event)=> {
        controller.simulation.environment.forceMatrix[force.id].isEnabled = event.target.checked
    }
});
uiElements.inputRunning.checked = controller.isRunning
uiElements.inputRunning.onchange = (event)=>{
    controller.isRunning = event.target.checked
}
buttonReset.onclick = ()=>{
    controller.reset()
}
Object.values(Elements).forEach(element=>{
    const idName = element.name.toLowerCase()
    const elementSquare = document.getElementById(`ptable-${idName}`)
    if (elementSquare) {
        elementSquare.onclick = ()=>{
            controller.setElement(element)
        }
    }
});
demo.addMouseDownListener((event)=>{
    const x = event.offsetX;
    const y = event.offsetY;
    controller.spawn(x/scalingFacting,y/scalingFacting)
    SoundBoard.playPop()
})

let lastTime = 0;
function animate(timestamp) {
    let diff = timestamp - lastTime;

    if (controller.isRunning) {
        controller.simulation.step(diff)
    }

    demo.context.clearRect(0, 0, demo.canvas.width, demo.canvas.height);
    demo.context.resetTransform()
    demo.context.scale(scalingFacting,scalingFacting)
    controller.drawParticles(demo.context)
    
    lastTime = timestamp;
    
    requestAnimationFrame(animate);
}

animate(0);