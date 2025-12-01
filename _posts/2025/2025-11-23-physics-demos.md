---
title: Particle Collisions
layout: post
tags: physics, particles, charges
---


## Two Particles

Adjust the slider to change the distance between the two hydrogen atoms and observe how the force changes.

<canvas class="demo-box" id="canvas-hydrogen" style='background-color: black'></canvas>
<div>
<input type="range" name="distance" id="hydrogen-distance" min="0" max="100"/>
<label for="distance">Distance</label>
</div>

## Bulk

When a bunch of atoms are moving about freely in a space, these forces work in aggregate to create the basic properties of matter we can observe in the lab, like gas pressure.


<canvas class="demo-box" id="hydrogen-bulk" width=500 height=500 style='background-color: black'></canvas>
<div id='sim-controls'>
<p id='sim-display'></p>
<p>Charge: <span id='sim-charge'></span><button id='sim-charge-up'>Up</button><button id='sim-charge-down'>Down</button></p>
<button id="sim-hydrogen">Hydrogen</button>
<button id="sim-helium">Helium</button>
<br/>
<button id="sim-lithium">Lithium</button>
<button id="sim-carbon">Carbon</button>
<button id="sim-nitrogen">Nitrogen</button>
<button id="sim-oxygen">Oxygen</button>
<br/>
<button id="sim-reset">Reset</button>
</div>
<label for='input-gravity'>Gravity</label>
<input type='checkbox' id='input-gravity'/>
<label for='input-running'>Running</label>
<input type='checkbox' id='input-running'/>

<script type="module" src="/science/chemistry/ionic-bonding.mjs"></script>
<noscript>
<p>Please Enable Javascript to Use Interactive Demos</p>
</noscript>
