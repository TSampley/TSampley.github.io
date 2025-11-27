---
title: Particle Collisions
layout: post
tags: physics, particles, charges
---


## Two Particles

Adjust the slider to change the distance between the two hydrogen atoms and observe how the force changes.

<canvas class="demo-box" id="force-between-hydrogens" style='background-color: black'></canvas>
<div>
<input type="range" name="distance" id="hydrogen-distance" min="0" max="100"/>
<label for="distance">Distance</label>
</div>

## Bulk

When a bunch of atoms are moving about freely in a space, these forces work in aggregate to create the basic properties of matter we can observe in the lab, like gas pressure.


<canvas class="demo-box" id="hydrogen-bulk" style='width:200; height:500; background-color: black'></canvas>
<p id='sim-display'></p>
<button id="sim-hydrogen">Hydrogen</button>
<button id="sim-helium">Helium</button>
<br/>
<button id="sim-lithium">Lithium</button>
<button id="sim-carbon">Carbon</button>
<button id="sim-nitrogen">Nitrogen</button>
<button id="sim-oxygen">Oxygen</button>
<br/>
<button id="sim-reset">Reset</button>

<script type="module" src="/scripts/demos/ionic-bonding.mjs"></script>
<noscript>
<p>Please Enable Javascript to Use Interactive Demos</p>
</noscript>
