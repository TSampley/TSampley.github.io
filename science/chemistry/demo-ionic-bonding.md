---
layout: demo

title: Ionic Bonding
description: A demonstration of ioninc particle interactions
date: 2025-12-10 08:00 -0600
updated: 2025-12-25 08:00 -0600
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
<label for='input-running'>Running</label>
<input type='checkbox' id='input-running'/>
<br/>

<fieldset>
<legend>Choose a Scenario:</legend>
<input type='radio' id='scenario-0' name='scenario'>
<label for='scenario-0'>Empty</label>
<input type='radio' id='scenario-1' name='scenario'>
<label for='scenario-1'>Sodium and Chlorine Pair</label>
<input type='radio' id='scenario-2' name='scenario'>
<label for='scenario-2'>Sodium and Chlorine Gas 🚧</label>
<input type='radio' id='scenario-3' name='scenario'>
<label for='scenario-3'>Sodium Bulk and Chlorine Gas 🚧</label>
<input type='radio' id='scenario-4' name='scenario'>
<label for='scenario-4'>Calcium and Chlorine Gas 🚧</label>
</fieldset>

</div>
<ul id='sim-force-inputs'><!--  --></ul>

<script type="module" src="/science/chemistry/demo-ionic-bonding.mjs"></script>
<noscript>
<p>Please Enable Javascript to Use Interactive Demos</p>
</noscript>
