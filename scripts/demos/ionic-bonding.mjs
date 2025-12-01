
import { Timer } from '../common/timer.mjs';

import { SoundBoard } from '../audio/sound-board.mjs';

import { Elements } from '../physics/element.mjs'
import { Simulation } from '../physics/simulation.mjs';
import { WorldController } from '../physics/world-controller.mjs';
import { AtomicProperties, NullProperties, Particle } from '../physics/particle.mjs'

import { Demo } from '../components/demo.mjs'

// const slider = document.getElementById('hydrogen-distance') // TODO: replace remaining references with object
const displayParagraph = document.getElementById('sim-display')
const displayCharge = document.getElementById('sim-charge')
const buttonChargeUp = document.getElementById('sim-charge-up')
const buttonChargeDown = document.getElementById('sim-charge-down')
const inputGravity = document.getElementsByTagName('input').namedItem('input-gravity')
const buttonReset = document.getElementById('sim-reset')
const demo = new Demo('hydrogen-bulk');
const uiElements = {
    slider: document.getElementById('hydrogen-distance'),
    displayParagraph: document.getElementById('sim-display'),
    displayCharge: document.getElementById('sim-charge'),
    buttonChargeUp: document.getElementById('sim-charge-up'),
    buttonChargeDown: document.getElementById('sim-charge-down'),
    inputGravity: document.getElementsByTagName('input').namedItem('input-gravity'),
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

function setHydrogenDistance(value) {
    // TODO: update simulation
}

uiElements.slider.addEventListener('input',(event => {
    setHydrogenDistance(event.target.value);
}));
buttonChargeUp.onclick = ()=>{
    controller.incrementCharge()
}
buttonChargeDown.onclick = ()=>{
    controller.decrementCharge()
}
inputGravity.value = controller.simulation.gravityOn
inputGravity.onchange = (event)=>{
    controller.setGravityOn(event.target.checked)
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
    // hydrogen.vx = Math.random() * .1
    // hydrogen.vy = Math.random() * .1
    // oxygen.vx = -hydrogen.vx
    // oxygen.vy = -hydrogen.vy
    // controller.addParticle(hydrogen)
    // controller.addParticle(oxygen)
    SoundBoard.playPop()
})

controller.simulation.environment.width = demo.canvas.width
controller.simulation.environment.height = demo.canvas.height

controller.simulation.environment.onCollide = SoundBoard.playClack
controller.simulation.environment.onBounce = SoundBoard.playWoop

function step(delta) {
    controller.simulation.step(delta)
}

let lastTime = 0;
function animate(timestamp) {
    let diff = timestamp - lastTime;
    step(diff);

    demo.context.clearRect(0, 0, demo.canvas.width, demo.canvas.height);

    controller.drawParticles(demo.context)
    
    lastTime = timestamp;
    
    requestAnimationFrame(animate);
}

controller.setParticle(hydrogenParticle)
controller.setCharge(0)
animate(0);