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

https://www.edmondok.gov/DocumentCenter/View/5450/Ordinance-3868-Chickens?bidId=
https://library.municode.com/ok/edmond/codes/code_of_ordinances?nodeId=COOR_TIT7AN_CH7.09AN

Comment - The changing of laws is like rewriting the source code (policies) of a program. A reliance on some organization through legislation is (usually) the most difficult to change, hence delegation of finer policies to some regulatory body which can modify its policies more frequently.

[^law-glossary]: https://www.uscourts.gov/glossary
