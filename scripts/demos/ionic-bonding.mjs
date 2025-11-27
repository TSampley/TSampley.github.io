
import { Timer } from '../common/timer.mjs';

import { SoundBoard } from '../audio/sound-board.mjs';

import { Elements } from '../physics/element.mjs'
import { Simulation } from '../physics/simulation.mjs';
import { WorldController } from '../physics/world-controller.mjs';
import { AtomicProperties, NullProperties, Particle } from '../physics/particle.mjs'

import { Demo } from '../components/demo.mjs'

const slider = document.getElementById('hydrogen-distance')
const buttonReset = document.getElementById('sim-reset')
const demo = new Demo('hydrogen-bulk');

let simulation = new Simulation()
let timer = new Timer()
let controller = new WorldController(simulation,timer)

function setHydrogenDistance(value) {
    // TODO: update simulation
}

slider.addEventListener('input',(event => {
    setHydrogenDistance(event.target.value);
}));
buttonReset.onclick = ()=>{
    controller.reset()
}
demo.addMouseDownListener((event)=>{
    const x = event.offsetX;
    const y = event.offsetY;
    const hydrogen = new Particle(x, y, new AtomicProperties(Elements.Hydrogen,0,1));
    const oxygen = new Particle(x, y, new AtomicProperties(Elements.Oxygen,0,8));
    hydrogen.vx = Math.random() * .1
    hydrogen.vy = Math.random() * .1
    oxygen.vx = -hydrogen.vx
    oxygen.vy = -hydrogen.vy
    controller.addParticle(hydrogen)
    controller.addParticle(oxygen)
    SoundBoard.playPop()
})

let width = demo.canvas.width;
let height = demo.canvas.height;

const onCollide = ()=>{ SoundBoard.playClack() }
const onBounce = ()=>{ SoundBoard.playWoop() }

function step(delta) {
    controller.simulation.step(delta,width,height,onCollide,onBounce)
}

const context = demo.context;

let lastTime = 0;
function animate(timestamp) {
    let diff = timestamp - lastTime;
    step(diff);

    context.clearRect(0, 0, demo.canvas.width, demo.canvas.height);

    controller.drawParticles(demo.context)
    
    lastTime = timestamp;
    
    requestAnimationFrame(animate);
}

animate(0);