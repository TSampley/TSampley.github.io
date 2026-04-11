---
layout: wiki

title: Software Principles
description: 
date: 2026-04-11 0106 -0500
---



## Delegation over Conditions
An object-oriented principle that suggests wherever you have conditions in your code, you could instead be using delegation. This is particularly applicable not only if you have conditions *at all* but if you are conditioning on the same data in multiple places. You would instead delegate those cases with an interface providing methods for each use-case

1. Identify the conditional code
2. Define common interface with methods to cover all use sites
3. When conditional value changes, reassign delegate with appropriate instance
4. (bonus) provide instances with Factory

https://www.youtube.com/watch?v=ZPcgaZIWwqk

```kotlin

interface Format {
  fun export(obj:Any): String
}
class Xml: Format {
  override fun export(obj:Any): String { ... }
}
class Json: Format {
  override fun export(obj:Any): String { ... }
}
class Yaml: Format {
  override fun export(obj:Any): String { ... }
}

```

## Composition over Inheritance
As object-oriented became more popular, many teams found that they had created incredibly fragile systems built on 

## Convention over Configuration


## Seperation of Concerns
Generalization of the [single responsibility principle](#single-responsibility)

## Interfaces over Implementation


## SOLID

### Single Responsibility


### Open to Extension Closed to Modification


### Liskov Substitution


### Interface Segregation


### Dependency Inversion

