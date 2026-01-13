---
layout: page
title: About
permalink: /about/
---

## Site Layout

This site hosts all the original, unobfuscated source files alongside the pages that use them. The source-code is organized in a way that is atypical for most software development projects. Since all the code on this site serves to power interactive demonstrations, while serving as demonstrations itself, each implementation exists in the domain it is most relevant to, with abstractions existing where they are most generally relevant without specific application. A "simulation" without qualification only exists as an abstract computing concept, and so is implemented in the abstract directly within that domain. A chemistry or molecular dynamics simulation might exist in the computation chemistry domain, but it can be implemented in many ways, one of which is a particle simulation, in general applicable to mechanics, so the implementation it borrows resides in that domain.

In the below example, ParticleSimulation is the main class used to control a chemistry simulation, whose behavior is dictated by a ChemEnvironment. ParticleSimulation is in the `/science/physics/mechanics` path, implementing Simulation – itself on the `/science/computing/simulation` path – while ChemEnvironment is on the `/science/chemistry/computational` path.

- science
  - chemistry
    - computational
      - chem-environment.mjs
{%- include code/snippet-js.html url="/science/chemistry/computational/chem-environment.mjs" %}
  - computing
    - simulation
      - environment.mjs
{%- include code/snippet-js.html url="/science/computing/simulation/environment.mjs" %}
      - simulation.mjs
{%- include code/snippet-js.html url="/science/computing/simulation/simulation.mjs" %}
  - physics
    - mechanics
      - particle-simulation.mjs
{%- include code/snippet-js.html url="/science/physics/mechanics/particle-simulation.mjs" %}

## The Author

My name is Taush Sampley. I took my first programming class freshman year of high school and have been programming ever since. If you don't consider visual scripting languages practical or "real", Visual Basic would be the first language I learned; if you're insane, then Alice might be my first, but then I would argue you should include my friend from 8th grade, the Logo turtle.

I have a wide range of interests and find it difficult to study just one thing at a time. I like information rich subjects and environments where criticism is expected and encouraged. My primary interests are AI (whose isn't), mycology, languages, and people.
