---
layout: wiki

title: Math
description:
---


## Stochastic Processes

### Bead Simulation

<canvas id='bead-demo'>Your browser does not support canvas.</canvas>

Game with beads traveling along edges of graph based on transition probabilities:
- nodes, edges, and beads can all have properties
  - nodes might have color or size; edges thickness, material; beads color and speed
- transition probabilities are a function of a given bead at a node, the current node, and the neighbors of the current node
- probabilities need not sum to 1; they will be summed and normalized for selection
- transition categories depend on which properties are the primary influence on probabilities:
  - node-based transitions
  - edge-based transitions
  - bead-based transitions
  - mixture - based on multiple in some combination
