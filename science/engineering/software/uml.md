---
layout: wiki


title: Unified Modeling Language
description: 
date: 2026-06-21 0800 -0600

---

## Types of Diagrams

### Use Case

Expresses the actors within a system and how they can interact with the system.

### Activity

Expresses the steps to perform a specific activity within a system.

### State

Expresses 

### Sequence

Expresses interactions between actors and the system in a very linear way.

### Communication

Expresses interactions between actors and the system as a graph.

### Class

Expresses the types and functions within the system and their relations to one another.

### Object

Expresses the instances at a specific point in the program's execution.

## Personal Approach

1. Start with [Use Case Diagrams](#use-case), describing the types of users and high-level interactions with the system.
  1. Identify entities referenced in use cases at a high level - these will become objects but at this point are probably too abstract to commit to a concrete structure.
  - These roughly correspond to the Agile "User Story", which is a type of User Scenario, following the format: As a &lt;Actor&gt; I want &lt;Feature&gt;, so that &lt;Value&gt;.
2. Expand each Use Case into an [Activity Diagram](#activity)
  1. [State Diagrams](#state) can be used to express complex, dynamic activities or processes.
  2. 
3. Expand each Activity into a [Sequence Diagram](#sequence) or [Communication Diagram](#communication) while defining Class Diagrams to express supporting architecture.
  1. 
  2. 
4. Validate architecture by using [Object Diagrams](#object) to walk step-by-step through the model the system creates for each use case.
  1. 


[^wiki-user-story]: https://en.wikipedia.org/wiki/User_story
[^wiki-usecase]: https://en.wikipedia.org/wiki/Use_case_diagram
[^wiki-activity]: https://en.wikipedia.org/wiki/Activity_diagram
[^wiki-state]: https://en.wikipedia.org/wiki/UML_state_machine
[^wiki-sequence]: https://en.wikipedia.org/wiki/Sequence_diagram
[^wiki-communication]: https://en.wikipedia.org/wiki/Communication_diagram
[^wiki-class]: https://en.wikipedia.org/wiki/Class_diagram
[^wiki-object]: https://en.wikipedia.org/wiki/Object_diagram