---
layout: post
title: "Group Project"
date: 2019-07-05 17:02:00 -0500
categories: update
permalink: /updates/amulet-android/
---

The next project folder is called "Amulet". This was a personal android port of
a group project I lead in high school.

*If I recall correctly, I took "AP Computer Science 1" my junior year of high school and enrolled the next year in "AP Computer Science 2". Unfortunately, College Board decided to discontinue the "AP Computer Science 2" exam, which meant my whole class was suddenly pointless. Ms. St. Clair, my favorite teacher, still had us learn the material, but we still ended up with lots of free time, so I asked her if we could work on a class project. She allowed us to use an empty class-room to discuss design and class time to work on it. We dreamed a bit too big and spent a bit too much time talking about what we wanted to make. In retrospect, we should have than started with a small goal, completed it, then thought how we could expand it if we had enough time.*

#### Review

This project has a few too many files to go into individually. I seem to remember porting files selectively - there are authorship tags from other people, so I know some of these were copied directly, but I also know some were generated for the android port - so I think there may still be more files in the original project.

All code files are in "acggames.amulet" or below, so I will use ~ for the "home package".

##### "assets" folder

Wow, I remember painstakingly making these by hand in Microsoft Paint.

In high school, we had two students who were awesome artists actually making assets for us. These are not those assets.

##### "~" package

It looks like I decided to rely on a singleton of my main activity to expose the asset manager to load files in various classes and I also decided to create my own window-management-ish system on top of Android's. Those are both decisions I'm glad I would not make now.

`AmuletActivity` holds as its main view a single `AmuletView` wherein I created 2 anonymous `Thread` instances: one to advance logic, one to render. Why I decided they needed to be on separate threads -- I don't know.
`AmuletView` holds swappable instances of `Screen` which has a `drawCurrentFrame(Canvas)` method and some input methods. `AmuletView` would hold a single screen at a time and was responsible for drawing the current screen and passing it input events, so really it was just a very poor replacement for the existing Android or Java SE windowing systems.

##### "~.animations" package

If I were going to port this to Android, I would definitely get rid of this package entirely. There's nothing it does that can't be done with any standard animation API.

##### "~.behaviors" package

I'm seeing more instances of weird static access. I guess I decided there would never be more than a single `WorldScreen`. There isn't much to this package, but it was meant to house all AI code.

##### "~.effects" package

An `Effect` was a very broad idea. It was a templated class that had `affect(E)` and `removeEffect(E)` for some `Effect<E>`. It was what we intended to use to alter actor states - like damage and status effects - and alter the field. Items would have an `Effect` which would be applied based on the item's target type. All of our effects in the original project had either `Stack` or `Actor` type parameters.

##### "~.clumps" package

These were a bunch of "clumps", which were just different ways of selecting groups of tiles. A weapon or spell would have a specific "clump" that determined the shape of the attack.

##### "~.processors" package

I don't think any of us had a concrete idea of how these were going to work. Most of the classes are fairly empty. The general idea was that it's how the modular logic of the game would be implemented, but it look like we never made it very far on fleshing that out.

##### Unmentioned packages

I didn't think the following packages were worth mentioning: conditions, display, items, test, triggers, useables.

#### Conclusion

This project isn't much to look at, but it reminds me how I've grown as a programmer. I was praised then for my prowess, but I cringe now, looking at the code I produced. I may not finish this Android port, but I would like to finish the original project in some form eventually. Stephen Sanders, a high school friend and CS class peer, had created a script for the plot we had all come up with together. Alex Symczak, my sole programming equal at the time, had composed an awesome midi song and was going to play guitar for some battle music. Even though we didn't actually get very far, I remember having a lot of fun working on it with all of them.
