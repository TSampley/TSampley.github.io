---
layout: wiki

title: Simulation
description: 
---

```mermaid

classDiagram

  class Entity {
    position: Point
    step(delta:number)
  }

  class Simulation~Environment~{
    step(delta:number)
    draw(context:Canvas2DContext)
  }

  class Environment~Entity~{
    step(delta:number)
    draw(context:Canvas2DContext)
  }

  class ChemEnvironment

  Simulation --> Environment

  Environment *--> Entity

```
{% include code/mermaid-script.html %}
