---
layout: default
---

<div style='position: relative;'>
  <canvas id='sitemap-canvas' width=400 height=400 style='border: 2px solid black;'></canvas>
  <div id='controls' style='position: absolute; top: 0px; left: 0px; display: flex; flex-direction: column; opacity: 0.60'>
    <span id='display-node'> </span>
    <button id='button-time-control'>Start</button>
    <button id='button-save'>Save</button>
  </div>
</div>

<script async src='./sitemap.mjs' type="module"></script>
<script>
  console.log('Pushing Canvas Id: sitemap-canvas');
  (sitemap_queue = window.sitemap_queue || []).push('sitemap-canvas');
</script>