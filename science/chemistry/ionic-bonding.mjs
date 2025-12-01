
import { AtomicProperties } from './atomic-properties.mjs'
import { Elements } from './element.mjs'
import { Timer } from '../../scripts/common/timer.mjs';

import { SoundBoard } from '../../scripts/audio/sound-board.mjs';

import { WorldController } from '../computing/simulation/world-controller.mjs';
import { Simulation } from '../computing/simulation/simulation.mjs';

import { Particle } from '../physics/mechanics/particle.mjs'

import { Demo } from '../../scripts/components/demo.mjs'

const displayParagraph = document.getElementById('sim-display')
const displayCharge = document.getElementById('sim-charge')
const buttonChargeUp = document.getElementById('sim-charge-up')
const buttonChargeDown = document.getElementById('sim-charge-down')
const inputGravity = document.getElementsByTagName('input').namedItem('input-gravity')
const buttonReset = document.getElementById('sim-reset')
const demo = new Demo('hydrogen-bulk');
const uiElements = {
    displayParagraph: document.getElementById('sim-display'),
    displayCharge: document.getElementById('sim-charge'),
    buttonChargeUp: document.getElementById('sim-charge-up'),
    buttonChargeDown: document.getElementById('sim-charge-down'),
    inputGravity: document.getElementById('input-gravity'),
    inputRunning: document.getElementById('input-running'),
    buttonReset: document.getElementById('sim-reset'),
    table: Object.values(Elements).map((value)=>{
        document.getElementById(`sim-${value.name.toLowerCase()}`)
    })
}

let simulation = new Simulation()
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
inputGravity.checked = controller.simulation.environment.forceMatrix.gravity.isEnabled
inputGravity.onchange = (event)=>{
    controller.simulation.environment.forceMatrix.gravity.isEnabled = event.target.checked
}
uiElements.inputRunning.checked = controller.isRunning
uiElements.inputRunning.onchange = (event)=>{
    controller.isRunning = event.target.checked
}
buttonReset.onclick = ()=>{
    controller.reset()
}
document.getElementById('sim-hydrogen').onclick = ()=>{
    controller.setParticle(hydrogenParticle)
}
document.getElementById('sim-helium').onclick = ()=>{
    controller.setParticle(new Particle(0,0,new AtomicProperties(Elements.Helium, 0, 2)))
}
document.getElementById('sim-lithium').onclick = ()=>{
    controller.setParticle(new Particle(0,0,new AtomicProperties(Elements.Lithium, 0, 3)))
}
document.getElementById('sim-carbon').onclick = ()=>{
    controller.setParticle(new Particle(0,0,new AtomicProperties(Elements.Carbon, 0, 6)))
}
document.getElementById('sim-nitrogen').onclick = ()=>{
    controller.setParticle(new Particle(0,0,new AtomicProperties(Elements.Nitrogen, 0, 7)))
}
document.getElementById('sim-oxygen').onclick = ()=>{
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
controller.simulation.environment.forceMatrix.charge.isEnabled = false
controller.simulation.environment.forceMatrix.drag.isEnabled = false
controller.simulation.environment.forceMatrix.gravity.isEnabled = true
controller.simulation.environment.forceMatrix.boundaries.isEnabled = true

animate(0);