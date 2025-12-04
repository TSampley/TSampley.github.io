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

{% include periodic-table.html %}

<canvas class="demo-box" id="hydrogen-bulk" width=500 height=500 style='background-color: black'></canvas>
<div id='sim-controls'>

<p id='sim-display'></p>

<p>Charge: <span id='sim-charge'></span><button id='sim-charge-up'>Up</button><button id='sim-charge-down'>Down</button></p>

<br/>
<button id="sim-reset">Reset</button>
</div>
<ul id='sim-force-inputs'><!--  --></ul>
<li>
<label for='sim-force-boundary'>Boundary</label>
<input type='checkbox' id='sim-force-boundary'>
</li>
<li>
<label for='sim-force-drag'>Drag</label>
<input type='checkbox' id='sim-force-drag'/>
</li>
<li>
<label for='sim-force-gravity'>Gravity</label>
<input type='checkbox' id='sim-force-gravity'/>
</li>
<li>
<label for='sim-force-coulomb'>Coulomb</label>
<input type='checkbox' id='sim-force-coulomb'/>
</li>
<li>
<label for='sim-force-lennard-jones'>Lennard-Jones</label>
<input type='checkbox' id='sim-force-lennard-jones'/>
</li>
<li>
<label for='input-running'>Running</label>
<input type='checkbox' id='input-running'/>
</li>

<script type="module" src="/science/chemistry/demo-ionic-bonding.mjs"></script>
<noscript>
<p>Please Enable Javascript to Use Interactive Demos</p>
</noscript>
