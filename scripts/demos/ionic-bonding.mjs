
import { Particle } from '/scripts/physics/particle.mjs'

const canvas = document.getElementById('hydrogen-bulk');
const context = canvas.getContext('2d');

let width = canvas.width;
let height = canvas.height;

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

let lastTime = 0;
function animate(timestamp) {
    let diff = timestamp - lastTime;
    step(diff);

    context.clearRect(0, 0, canvas.width, canvas.height);

    context.beginPath();
    context.ellipse(x, y, 10, 10, 0, 0, 2*Math.PI);
    context.closePath();
    context.fillStyle = "blue";
    context.fill();
    
    lastTime = timestamp;
    
    requestAnimationFrame(animate);
}

animate(0);