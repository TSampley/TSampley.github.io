---
layout: post

title: The Repository Pattern
subtitle: And Its Many Forms
date: 2024-09-23 0800 -0500
updated: 2026-07-19 1425 -0500
---

A Brief Speculative History
I've seen claims like "Android has popularized the repository pattern" - but that's just not true, unless you're only looking at the Android community. Disciplined engineers have been using it for decades. The great Martin Fowler has a fantastic, thorough write-up about it, which you might not immediately recognize as the repository pattern, because his experience and knowledge long predates Android's introduction of the narrow, simplified example repository in their documents. https://martinfowler.com/eaaCatalog/repository.html
Previously, the Android docs would demonstrate the use of different APIs in as simple a context as possible - many times calling some service directly from an Activity. I imagine inexperienced developers took these examples as gospel and implemented their code following these examples to the letter, i.e. without abstraction - it's what I did back in high school. Combine this with Android's lower barrier to entry for most, and you end up with a majority of code written very poorly. I think the Android team realized that their ecosystem's reputation was suffering from the number of new developers introducing poorly written code only to swarm stack overflow with the same troubles that had been answered long ago by software architects.
The Major Forms
Considering all the possible implementations of a repository, I'd like to break them down into 3 main groups according to typical data-access patterns: read-only, write-only, and read/write. The first and last are definitely the most common, but the second is worth talking about in isolation as well. All of these deal with potentially long-running operations and usually require some way to initiate work while waiting for a deferred response. As a Kotlin programmer, I'll be using suspending functions that use the Result API.
Read-Only
Examples that spring to mind are map APIs or process environment queries, like device or operating system information.
Local Store - potentially slow disk operations
Remote Service - variable latency and unreliable networks
Local Cache with a Remote Source-of-Truth - fidelity of a single source, optimized for speedy repeated queries

Write-Only
This is a rare form of data access, but it does exist! Think of a ballot box or a website form submission like a bug report or a contact request.

Read/Write
This is by far the most common - it emulates a mutable collection as a combination of the previous two forms
Asynchronous Work
Wrap calls with try-catch and return convenient API
You could also use callbacks as completion handlers or register a listener, which is simple if a single client is using a repository.
The Arrow library provides many abstractions for asynchronous work patterns. I hate the terminology, but it's derived from prior work.
GitHub - arrow-kt/arrow: Λrrow - Functional companion to Kotlin's Standard Library
Λrrow - Functional companion to Kotlin's Standard Library - arrow-kt/arrowgithub.com
