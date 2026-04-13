---
layout: demo

title: Digital Law Demo
description: 
date: 2026-04-12 1547 -0500
---

## Digital Law Demo

- describe laws in terms of functions and parameters/arguments
- people, property, things represented as objects
- processes represented as state-machines
  - reinforce exit-conditions (prevent legal loop-holes/pitfalls)
  - provide annotation/notation to override warnings/errors when loop-holes/pitfalls are detected during transposition of legislation to digital law

<div id='demo-container'>
</div>

<script type=module>
  import { digitalLawDemo } from './digital-law.mjs'
  window.onload = async ()=>{
    const demo = digitalLawDemo(
      'demo-container'
    )
    demo.start()
  }
</script>
