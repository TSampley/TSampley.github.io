---
layout: demo

title: Ionic Bonding
description: A demonstration of ioninc particle interactions
date: 2025-12-10 08:00 -0600
---

One atom completely loses one or more electrons, donating them to another atom, causing the two to become attracted through electrostatic force.

{% include periodic-table.html %}
<!-- TODO: move periodic table to drop down selector -->
<!-- TODO: add element/charge/neutrons selector -->


<canvas class="demo-box" id="hydrogen-bulk" width=600 height=500 style='background-color: black'></canvas>
<div id='sim-controls'>

<p id='sim-display'></p>

<p>Charge: <span id='sim-charge'></span><button id='sim-charge-up'>Up</button><button id='sim-charge-down'>Down</button></p>

<br/>
<button id="sim-reset">Reset</button>
<br/>

<fieldset>
<legend>Choose a Scenario:</legend>
<input type='radio' id='scenario-0'>
<label for='scenario-0'>Empty</label>
<input type='radio' id='scenario-1'>
<label for='scenario-1'>Sodium and Chlorine Pair</label>
<input type='radio' id='scenario-2'>
<label for='scenario-2'>Sodium and Chlorine Gas 🚧</label>
<input type='radio' id='scenario-3'>
<label for='scenario-3'>Sodium Bulk and Chlorine Gas 🚧</label>
<input type='radio' id='scenario-4'>
<label for='scenario-4'>Calcium and Chlorine Gas 🚧</label>
</fieldset>

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
