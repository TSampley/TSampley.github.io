---
layout: wiki

title: Software Patterns
description: The application of predefined methods to solve regularly occuring 
  problems across domains.
date: 2026-04-10 0307 -0500
---

Software patterns are ways of organizing code that have been rediscovered countless times and found to have utility (or problems for "anti-patterns") across a broad range of contexts.
They capture generalized solutions to problems prevalent across domains and provide us with a language to discuss them.

## History

```timeline

System
Embedded
WebDev
Mobile Android
Mobile iOS

Direct, Imperative Control
MVC
MVP
Indirect, Reactive
MVVM
MVI
MVVM+

```
<!-- TODO: software patterns history -->

[^wiki]: https://en.wikipedia.org/wiki/Design_Patterns

## Procedural

## Structured

## Funtional

## Object Oriented

The most popular software patterns in the object-oriented world were established by the Gang of Four in their book with 23 patterns; however, even the authors criticized the inclusion of the interpreter pattern as a sort of practical joke, so only 22 are considered useful patterns, and even amongst those, most professional developers don't seem to be aware of more than maybe 4: factory, builder, iterator, and observer

### Structural

- Adapter[^guru][^gang]
- Bridge[^guru][^gang]
- Composite[^guru][^gang]
- Decorator[^guru][^gang]
- Facade[^guru][^gang]
- Flyweight[^guru][^gang]
- Proxy[^guru][^gang]

### Creational

- Singleton[^guru][^gang]
- Factory[^guru][^gang]
- AbstractFactory[^guru][^gang]
- Builder[^guru][^gang]
- Prototype[^guru][^gang]

### Behavioral

- Chain of Responsibility[^guru][^gang]
- Command[^guru][^gang]
- Interpreter[^gang] *Excluded from refactoring.guru[^guru-blog][^guru-reason]*
- Iterator[^guru][^gang]
- Mediator[^guru][^gang]
- Memento[^guru][^gang]
- Observer[^guru][^gang]
- State[^guru][^gang]
- Strategy[^guru][^gang]
- Template Method[^guru][^gang]
- Visitor[^guru][^gang]

[^guru-blog]: https://feedback.refactoring.guru/en/knowledge-bases/5/articles/1878-why-dont-the-book-include-the-interpreter-pattern
[^guru-reason]: https://blogs.perl.org/users/jeffrey_kegler/2013/03/the-interpreter-design-pattern.html

[^gang]: https://springframework.guru/gang-of-four-design-patterns/
[^martin]: https://martinfowler.com/
[^guru]: https://refactoring.guru/design-patterns/catalog

### Power Patterns

Power patterns are arrangements of patterns that are found together frequently because of the way they compliment each other, often specific to a platform.

#### Pipeline, Decorator, and Factory
The core of your logic is implemented as a more-or-less static pipeline with points of abstraction to implement each stage of the pipeline, using a series of factories or abstract factory to decorate the pipeline.

##### Comparison with Strategy Pattern



## Enterprise

The following is a more complete list of patterns from Martin Fowler's Enterprise Application book[^martin], which Martin Fowler points out includes many patterns now commonly implemented by frameworks or libraries; although he also points out that knowledge of these patterns aids understanding of the frameworks that use them, even if you never implement them yourself.

- Active Record
- Application Controller
- Association Table Mapping
- Class Table Inheritance
- Client Session State
- Coarse-Grained Lock
- Concrete Table Inhereitance
- Data Mapper
- Data Transfer Object
- Database Session State
- Dependent Mapping
- Domain Model
- Embedded Value
- Foreign Key Mapping
- Front Controller
- Gateway
- Identify Field
- Identify map
- Implicit Lock
- Inheritance Mappers
- Layer Supertype
- Lazy Load
- Mapper
- Metadata Mapping
- Model View Controller
- Money
- Optimistic Offline Lock
- Page Controller
- Pessimistic Offline Lock
- Plugin
- Query Object
- Record Set
- Registyr
- Remote Facade
- Repository
- Row Data Gateway
- Seperated Interface
- Serialized LOB
- Server Session State
- Service Layer
- Service Stub
- Single Table Inheritance
- Special Case
- Table Data Gateway
- Table Module
- Template View
- Transaction Script
- Transform View
- Two Step View
- Unit of Work
- Value Object

[^martin]: https://martinfowler.com/books/eaa.html
