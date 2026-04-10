---
layout: wiki

title: Vector
description:
date: 2025-11-30 03:34:14 -0600
updated: 2025-11-30 05:53:33 -0600
---


<canvas class="demo-box" id='canvas-vector' width=500 height=500></canvas>

https://en.wikipedia.org/wiki/Vector_(mathematics_and_physics)

<!-- TODO: Add vector demo -->

<script type='module'>
  import * as V from './vector-demo.mjs'
  const ui = new V.VectorDemoUi('canvas-vector')
  const model = new V.VectorDemoModel()
  const presenter = new V.VectorDemoPresenter(model,ui)
  presenter.bind()
</script>
