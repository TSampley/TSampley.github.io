
import { Simulation } from '../physics/simulation.mjs';
import { World } from '../physics/world.mjs';
import { WorldController } from '../physics/world-controller.mjs';
import { NullProperties, Particle } from '../physics/particle.mjs'

import { SoundBoard } from '../audio/sound-board.mjs';

import { Demo } from '../components/demo.mjs'

const slider = document.getElementById('hydrogen-distance')

const demo = new Demo('hydrogen-bulk');

let simulation = new Simulation()
let world = new World()
let controller = new WorldController(simulation,world)

function setHydrogenDistance(value) {
    alert(`Hydrogen Distance set to ${value}`)
}

slider.addEventListener('input',(event => {
    setHydrogenDistance(event.target.value);
}));
demo.addMouseDownListener((event)=>{
    const x = event.offsetX;
    const y = event.offsetY;
    const particle = new Particle(x, y, NullProperties);
    particle.vx = Math.random() * .1
    particle.vy = Math.random() * .1
    controller.addParticle(particle)
    SoundBoard.quickPlay(SoundBoard.pop)
})

let width = demo.canvas.width;
let height = demo.canvas.height;

function step(delta) {
    for (const key in controller.simulation.particleList) {
        const particle = controller.simulation.particleList[key]
        particle.step(delta,width,height,
            ()=>{ SoundBoard.quickPlay(SoundBoard.clack) }
        )
    }
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