---
layout: demo

title: Digital Law Demo
description: 
date: 2026-04-12 1547 -0500
---

## Digital Law Demo

- describe laws in terms of functions and parameters/arguments
- 
- 


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
