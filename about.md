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

<!-- 
```timeline

- event: Birth
  date: 1990-01-01

- section: Gestation
  date: 1990
  end: 2007

- section: Freshman Year
  start: 2007
  end: 2008

- section: Sophomore Year
  start: 2008
  end: 2009

- section: Junior Year
  start: 2009
  end: 2010

- section: Senior Year
  start: 2010
  end: 2011

- section: OU Freshman
  start: 2011
  end: 2015

- section: Legal Trouble
  start: 2015
  end: 2016

- section: Homeless 1 - Stillwater
  start: 2016
  end: 2018

- section: Homeless 2 - Kentucky
  start: 2018
  end: 2019

- section: Housed - Kentucky
  start: 2020
  end: 2021

- section: Housed - Stillwater
  start: 2021
  end: 2023

- section: Homeless 3 - Stillwater Streets
  start: 2023
  end: 2023

- section: Homeless 4 - Stillwater Shelter 1
  start: 2023
  end: 2023

- section: Homeless 5 - Stillwater Streets
  start: 2023
  end: 2024

- section: Homeless 6 - Stillwater Shelter 2
  start: 2024
  end: 2025

- section: Homeless 7 - Stillwater Streets
  start: 2025
  end: 2025

- section: Homeless 8 - Leninist Schizo
  start: 2025-08
  end: 2025-10

- section: Homeless 9 - Parents
  start: 2025-11

- event: Homeless 10 - Colorado
  date: 2026-01

- date: 2027
- date: 2028
- date: 2030
- date: 2040
- date: 2050
- date: 2060
- date: 2070
- date: 2080
- date: 2090
- date: 2100
- date: 3000
- date: 5000

```

 -->
 