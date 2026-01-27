---
layout: app

title: SVG Editor
stylesheet: /assets/css/app.css
module: ./svg-editor.mjs
---

<div id='app-host' class='container'>
  <noscript>Please Enable Javascript to use the applet</noscript>
  <canvas id='canvas' class='demo-canvas' style='width: 100%; height: 100%; background: radial-gradient(#fff,#000);'>Your browser does not support canvas.</canvas>
  <div id='controls' class=''>
    <div id='toolbar'></div>
  </div>
</div>
<script src='./svg-editor.mjs' type=module></script>
