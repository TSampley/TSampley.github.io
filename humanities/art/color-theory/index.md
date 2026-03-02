---
layout: wiki

title: Color Theory
description:
date: 2025-12-29 09:39 -0600
updated: 2025-12-29 09:39 -0600
---

## Demo 1 - Color Quiz

Try to match the color shown.
Move the sliders to adjust each red, green, or blue component.
When you're ready, hit "Submit" to see how close you were.

Click "Start" to Begin

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
<div id='controls' class='container'>
  <input id='slider1' class='item' type='range' min=0 max=255 step=1>
  <input id='slider2' class='item' type='range' min=0 max=255 step=1>
  <input id='slider3' class='item' type='range' min=0 max=255 step=1>
  <input id='slider4' class='item' type='range' min=0 max=255 step=1>
  <input id='toggle' class='item' type='checkbox'>
  <button>Submit</button>
  <button>Start</button>
</div>

## Demo 2 - 

<canvas id='demo-color-theory'>Your browswer does not support Canvas.</canvas>

<script type="module" src="/humanities/art/color-theory/demo-color-theory.mjs"></script>
{% include code/no-script.html %}

## Site Theme

The divs below are styled using the site's theme colors for light and dark. Toggle the
checkbox to see dark mode.

<label for='theme-toggle'>Theme: Light/Dark</label>
<input id='theme-toggle' type='checkbox'>

<div id='theme-root' style='color-scheme: light; background-color: var(--surface); padding: 10px;'>
  <p style='color: var(--on-surface);'>Primary Color</p>
  <div style='background-color: var(--primary); padding: 10px;'>
    <div style='background-color: var(--primary-light); padding: 10px;'>
    </div>
    <div style='background-color: var(--primary-dark); padding: 10px;'>
    </div>
  </div>

  <p style='color: var(--on-surface);'>Secondary Color</p>
  <div style='background-color: var(--secondary); padding: 10px;'>
    <div style='background-color: var(--secondary-light); padding: 10px;'>
    </div>
    <div style='background-color: var(--secondary-dark); padding: 10px;'>
    </div>
  </div>

  <p style='color: var(--on-surface);'>Tertiary Color</p>
  <div style='background-color: var(--tertiary); padding: 10px;'>
    <div style='background-color: var(--tertiary-light); padding: 10px;'>
    </div>
    <div style='background-color: var(--tertiary-dark); padding: 10px;'>
    </div>
  </div>
</div>

<script>
  const root = document.getElementById('theme-root');
  const toggle = document.getElementById('theme-toggle');
  toggle.addEventListener('change',(event)=>{
    if (event.target.checked) {
      root.style['color-scheme']='dark'
    } else {
      root.style['color-scheme']='light'
    }
  });
</script>
