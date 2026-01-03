---
layout: page
title: "Statistics"
date: 2019-07-09 20:51:00 -0500
categories: snippet fun
permalink: /updates/stat/
---

I'm taking Engineering Statistics over the summer along with two other courses:
Organization of Programming Languages and Social Issues in Computing. Today was
the day of my second stat exam, which I ended up feeling good about.

Leading up to the exam, I became interested in creating a little conceptual demo
to play with, as I often did in high school. Some of the exam material was going
to cover joint probability density functions, so that's what I wanted to focus
on. Unfortunately, I didn't know any symbolic manipulation libraries that would
allow me to define functions and find integrals in javascript, so demonstrating
joint continuous PDF's was probably impractical for this small project, but I'd
still like to do that another time; continuous PDF's are more fun in general.

2019-07-11 Edit: The exam was going to cover joint probability **distribution** functions. "Continuous" is redundant since PDF's (probability **density** functions) describe continuous functions, while this looks at probability **mass** functions.

This could be a bit more polished, but it does its jobs. Just click to create a
data point. Click-and-drag to move a data point. Saving and clearing points
uses your cookies.

<canvas id="chalkboard" width="600" height="400"></canvas>
<button type="button" onclick="savePoints()">Save Points</button>
<button type="button" onclick="clearPoints()">Clear Points</button>
<input id="slider_scale" type="range" min="5" max="20" value="1" step="any" />
<br/>
<p id="label_count"></p>
<p id="label_meanx"></p>
<p id="label_meany"></p>
<p id="label_varX"></p>
<p id="label_varY"></p>
<p id="label_covar"></p>
<p id="label_corr"></p>

<script src="/math/statistics/DiscretePDF.js"></script>
<script src="/math/statistics/Graph.js"></script>
<script src="/math/statistics/main.js"></script>
