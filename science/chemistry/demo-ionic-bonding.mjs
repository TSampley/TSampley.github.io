
import { AtomicProperties } from './atomic-properties.mjs'
import { Elements } from './element.mjs'

import { Environment, forceMatricChemistry as forceMatrixChemistry } from '../computing/simulation/environment.mjs';
import { Simulation } from '../computing/simulation/simulation.mjs';
import { WorldController } from '../computing/simulation/world-controller.mjs';
import { Particle } from '../physics/mechanics/particle.mjs';

import { SoundBoard } from '../../scripts/audio/sound-board.mjs';
import { Timer } from '../../scripts/common/timer.mjs';
import { Demo } from '../../scripts/components/demo.mjs'

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
forces.lennardJones.isEnabled = false
forces.drag.isEnabled = false
let environment = new Environment(500, 500, forces)
let simulation = new Simulation(environment)
let timer = new Timer()
let controller = new WorldController(simulation,timer)
controller.setElement(Elements.Hydrogen)
controller.setCharge(0)

/** @type {()=>Array<Particle>} */
const scenario = ()=>{
    // Initialize Atoms
    const protium = new AtomicProperties(Elements.Hydrogen, 0, 0)
    const leftHydrogen = new Particle(10E-18,50E-18,protium)
    const rightHydrogen = new Particle(490E-18,50E-18,protium)

    // Direct towards each other
    leftHydrogen.vx = 10E-18
    rightHydrogen.vy = -10E-18

    return [leftHydrogen, rightHydrogen]
}
controller.simulation.particleList.push(...scenario())

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

buttonChargeUp.onclick = (event)=> {
    controller.incrementCharge()
}
buttonChargeDown.onclick = (event)=> {
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
uiElements.forceCoulomb.checked = controller.simulation.environment.forceMatrix.coulomb.isEnabled
uiElements.forceCoulomb.onchange = (event)=>{
    controller.simulation.environment.forceMatrix.coulomb.isEnabled = event.target.checked
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

animate(0);