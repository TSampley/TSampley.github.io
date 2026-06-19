---
layout: wiki

title: Software Engineering
description: The disciplined application of computer science 
date: 2025-12-04 03:46 -0600
updated: 2026-03-29 1528 -0500
---

Software engineering is the disciplined application of computer science to plan, build, and analyze software systems.

## Software Development
Software development is both a subfield of software engineering and a separate practice on its own. There is often a distinction made between software developers and software engineers, with the engineering title conveying special esteem. In short, software development is generally more relaxed than true engineering.

## Disciplines

Software engineering encompasses many subdisciplines that are each themselves expansive enough for many people to work their entire career within one.

### Front-End

### Back-End

### Web

### Mobile

### Full Stack

### 

### Platform Engineering

A subdiscipline of software engineering, focused on providing infrastructure for use by a team or enterprise, to fascilitate other work – often called DevOps.

#### Github Actions

GitHub Actions organizes all platform logic into the top-level entity, **workflows**. Workflows are composed of jobs, each of which runs as a separate process. Each job can either invoke another workflow or specify its logic in a sequence of steps. Steps can either invoke **actions** or run terminal scripts. Actions are themselves reusable units of logic, composed of a sequence of steps. All steps within a job and any reusable actions run in the same process.

[^pe]: https://platformengineering.org/
[^wiki-pe]: https://en.wikipedia.org/wiki/Platform_engineering
[^micro-pe]: https://learn.microsoft.com/en-us/platform-engineering/what-is-platform-engineering

### Quality Engineering

### Test Engineering

#### Validation vs Verification

Validation is a process where specifications are checked to ensure they match customer expectations.
Verification is the process of ensuring some product matches that specification.
They are often conflated because they go hand-in-hand: validation is important, but meaningless without verification, and verification is equally critical, and equally meaningless without a valid specification. Ultimately, end-users will verify a published product through use; however, discovery of an issue earlier in the pipeline is always cheaper. The art of specification is providing enough detail to remove ambiguities for an implementer, while not wasting time overspecifying or overcomplicating a feature. The science of verification is choosing the critical elements to cover with automated testing – the elements to "pin-down".

### Games

Video game development is a beast of its own, with many of the practices that have come to be considered good practice in mobile development being frequently ridiculed as unnecessary or even anti-patterns. Development is usually less focused on long-term maintenance and more on getting a product out quickly, which shifts the criteria for development. The culture is very similar to web development in the extent of business culture's influence on priorities.

## Best Practices

See [patterns](./patterns/) and [principles](./principles).

[^wiki-hof]: https://en.wikipedia.org/wiki/Douglas_Hofstadter
