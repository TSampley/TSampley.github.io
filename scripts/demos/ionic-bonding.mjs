
import { WorldController } from '../physics/world-controller.mjs';
import { Particle } from '../physics/particle.mjs'

import { Demo } from './demo.mjs'

const slider = document.getElementById('hydrogen-distance')

const demo = new Demo('hydrogen-bulk');

let controller = new WorldController()

function setHydrogenDistance(value) {
    alert(`Hydrogen Distance set to ${value}`)
}

slider.addEventListener('input',(event => {
    setHydrogenDistance(event.target.value);
}));
demo.addMouseDownListener((event)=>{
    const x = event.x
    const y = event.y
    controller.addParticle(new Particle(x, y))
})

let width = demo.canvas.width;
let height = demo.canvas.height;

let x = 10;
let y = 50;
let vx = Math.random() * .1
let vy = Math.random() * .1

function step(delta) {
    x += vx * delta;
    y += vy * delta;

    if (x > width) {
        vx *= -1;
        x = 2*width - x;
    } else if (x < 0) {
        vx *= -1;
        x = -x;
    }

    if (y > height) {
        vy *= -1;
        y = 2*height - y;
    } else if (y < 0) {
        vy *= -1;
        y = -y;
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