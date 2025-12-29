
import { Simulation } from "../physics/simulation.mjs";
import { Demo } from "../../js/components/demo.mjs";

const uiElements = {
    slider: document.getElementById('hydrogen-distance'),
}

const demo = new Demo('canvas-hydrogen')
const overlay = new Overlay('canvas-hydrogen-attraction') // TODO: create overlay type with WebGL canvas

function setHydrogenDistance(value) {
    // TODO: update simulation
}

uiElements.slider.addEventListener('input',(event => {
    setHydrogenDistance(event.target.value);
}));

