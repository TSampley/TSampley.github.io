---
layout: wiki

title: Color Theory
description:
date: 2025-12-29 09:39 -0600
updated: 2025-12-29 09:39 -0600
---

<style>
  .container {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    width: 20vw;
  }

  .item {
    padding: 5px;
    background-color: #0000007f
  }
</style>

## Demo 1 - Color Quiz

Try to match the color shown.
Move the sliders to adjust each red, green, or blue component.
When you're ready, hit "Submit" to see how close you were.

Click "Start" to Begin

<div id='controls' class='container'>
  <input id='slider1' class='item' type='range' min=0 max=255 step=1>
  <input id='slider2' class='item' type='range' min=0 max=255 step=1>
  <input id='slider3' class='item' type='range' min=0 max=255 step=1>
  <input id='slider4' class='item' type='range' min=0 max=255 step=1>
  <button>Submit</button>
  <button>Start</button>
</div>

## Demo 2 - 

<canvas id='demo-color-theory' width=800 height=600></canvas>

<script type="module" src="/humanities/art/color-theory/demo-color-theory.mjs"></script>
<noscript>
<p>Please Enable Javascript to Use Interactive Demos</p>
</noscript>
