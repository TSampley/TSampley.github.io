---
layout: post
title: "Incomplete Projects"
date: 2019-07-04 18:29:00 -0500
categories: update
---

The first project folder on my list is something called "3D-collisions".

It appears to be very old. The first thing I noticed was the lack of generated
comments, then I noticed that I was using a "compile.bat" file, so this was
definitely one of the projects I made on my mom's school computer.

*My mom taught at my high school, and many days I would be stuck at school
waiting to go home with her after. Before I got my laptop, I would use my mom's
school computer to program. I used notepad as my editor and would double-click
the batch file to compile everything.*

At first there were lots of errors popping up, but it turned out understandably
to be a simple configuration issue. After adding references to java3D jars
(yes, java 1.5), everything compiled, but attempting to run it produced an
error stating a lack of entry point, so I'll just get into the files.

#### The Autopsy

The project had the following files: Ball.java, CollisionGrapher.java,
Electron.java, MovingBall.java, Particle.java, RunCommand.java, and
TestDist.java. I expect this was probably one of the many times I became
interested in some kind of physics simulation.

##### Ball.java

A basic class that is exactly what it sounds like - a ball. Looks like it was
meant to be an instance of a scene object. I don't remember how java 3D works
entirely (and I don't think I ever got very far), but it seems like an odd
decision to extend a TransformGroup as a Ball. I also think the method
`createAppearance(Color,Color,Color,Color,float)` should be private static. I
want to say more but it's obvious this class was in-progress.

##### CollisionGrapher.java

Ah, here's the entry point!

... And it crashes.

```
Exception in thread "main" java.lang.NoClassDefFoundError: javax/media/opengl/GLCapabilitiesChooser
	at java.lang.Class.forName0(Native Method)
  ...
	at CollisionGrapher.main(CollisionGrapher.java:339)
Caused by: java.lang.ClassNotFoundException: javax.media.opengl.GLCapabilitiesChooser
	at java.net.URLClassLoader.findClass(URLClassLoader.java:381)
	... 20 more
```

Well, with the time I have to spend between school and work, I don't think I
want to try to get an unsupported library written in java 1.5 to work with JOGL,
but I'll consider alternatives if I decide to move on with this project.

The constructor has lots of different starting configurations for particles - I
definitely remember this project now; I had wanted to simulate charged particles
like in atoms, but I didn't do any research. I had just learned about Coulomb's
Law and decided to work off that. There are some event listeners for controlling
the sim and that's about it.

##### Electron.java

Completely empty. Totally useless.

##### MovingBall.java

This looks like where all my physics are. It uses a super naive, brute-force
method of calculating collisions. Collision detection would be a significant
area of improvement for this project.

##### Particle.java

Uh, oh. Looks like I copy-pasted code from `MovingBall` handle collisions in
this class. I remember that was a really bad habit of mine. DRY. I need to look
into my inheritance structure to fix that.

##### RunCommand.java

This looks like it belongs to a completely different project. It's another entry
point and doesn't look like it involves any other parts of the project. Looks
like I was trying to run commands through the JVM.

##### TestDist

This is another entry point, but this code actually seems relevant. Looks like
I was playing with calculating distance before getting distracted with binary
and hexcode.

#### Conclusion

This looks like what I expect to see a lot of: incomplete projects
inspired by small curiosities - often made simply to experiment with an idea. I
don't want to particularly continue this exact project, but I am still
fascinated by physics sims, so it will probably be continued at least in spirit
some time down the road. I'd like to lump all my physics curiosities together
into a single sand-box kind of project.
