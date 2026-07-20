---
layout: post

title: Accessibility vs Appeal
date: 2025-06-23 0800 -0500
updated: 2026-07-19 1414 -0500
---

<!-- Image: https://cdn-images-1.medium.com/v2/resize:fit:800/1*YmCPhXulIUV950fw0FV7tw.jpeg-->
<!-- Caption: UI Noise Apparent Only in Aggregate -->

Accessibility vs Appeal
Accessibility is something I have a passion for as someone with my own disabilities. Mine aren't too bad to cope with compared to others, but it's enough to make it clear how much even minor barriers that present constant friction in daily activities quickly leads to mental or even physical exhaustion.

The right option only shows the removal option when the component has focus (with touchscreen this mean it has been tapped once and selected; with pointers this can mean on hover)
Starting with the single item component, we want to add an "x" button to allow the user to remove a specific entry, but then when laying out many instances of the component in a column, that "x" button becomes noisy.
On top of this, deletion is a destructive action and usually infrequent, so placing a barrier is actually not a burden and to the contrary can be seen as a benefit to safety by avoiding accidental deletions (although most deletion features will ask to confirm before destroying the resource).