---
layout: demo

title: Ionic Bonding
description: A demonstration of ioninc particle interactions
---


One of the two in a pair attracts the electron strongly enough that it spends the majority of the time

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
