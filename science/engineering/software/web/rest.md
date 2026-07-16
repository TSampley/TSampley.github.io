---
layout: wiki

title: REST
description:  Representational State Transfer, an API design paradigm where the modified state resulting from each request is returned with the corresponding response.
date: 2026-07-14 0930 -0500
updated: 2026-07-16 1818 -0500
---

Representational State Transfer (ReST) is an API design pattern that abstracts a system behind an API, returning any mutated state in each request response.

### Theory

RESTful APIs are meant to represent resources and their manipulation
A fundamental decision in the manipulation of different properties is their data type, or structure.

Since POST, GET, PUT/PATCH, DELETE correspond to Create, Read, Update, Delete, I think it makes sense to design an API by thinking about each endpoint like a resource and trying to assign a type that gives better semantic reasoning to each of the HTTP methods.

```mermaid
classDiagram

  class RootObject {
    memberA: MemberAObject
    memberB: MemberBObject
  }
  RootObject *--> MemberAObject
  RootObject *--> MemberBObject
  class MemberAObject {

  }
  class MemberBObject {

  }
  class MemberCObject {

  }
  MemberBObject o--> MemberCObject

```
