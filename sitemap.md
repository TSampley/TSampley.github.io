---
layout: default
---

<div style='display: flex;'>
  <canvas id='sitemap-canvas' width=400 height=400>
  </canvas>
  <button id='button-time-control'>Start/Stop</button>
</div>

<script async src='./sitemap.mjs' type="module"></script>
<script>
  console.log('Pushing Canvas Id: sitemap-canvas');
  (sitemap_queue = window.sitemap_queue || []).push('sitemap-canvas');
</script>