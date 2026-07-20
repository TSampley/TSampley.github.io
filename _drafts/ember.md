---
layout: post

title: A New Ember of Intelligence
date: 2025-06-25 0800 -0500
updated: 2026-07-19 1411 -0500
---

A New Ember of Intelligence
Earlier this week, I kicked off my latest AI project, Ember. It's based on some ideas I've had kicking around in my head for a few years about the development of AI, and it's the basis for a research paper I wrote on the topic (yet to be published).
Most of these ideas , but I was annoyed by a video put out by the Center for Humane Technology where a speaker makes a strong claim about the predictability of emergence of intelligence and skills: "". I can't say for certain how popular this view is, but it seems to be dominant.
Emergent Abilities of Large Language Models by Jason Wei et al. was a significant paper and the foundation of the conversation around "emergent" abilities. The paper makes some more nuanced statements: "", "", "".
First, let's get these terms straights, because in the CHT video I referenced earlier, both speakers use the term "emergent" to describe both emergent skills and breakthrough performance.
Emergent abilities or skills refers to tasks that a model can complete competently but was not specifically trained to perform. Emergent performance refers to a sudden increase in performance above random, which is also known as a breakthrough.
I feel I can provide an explanation for all of these "emergent" traits.
Task complexity

I believe the required scale of a given network increases with increasing task complexity, so the sudden increase in performance for specific tasks as a function of model size shouldn't be surprising. It's been widely observed that network capacity increases with network size. The apparent "breakthrough" is just the point at which the capacity of the network is able to resolve the complexity of the problem.
I like to use  the topological intuition of matching a rope or rubber band to some specific knot in space. Starting from the observation that classification problems reduce to the task of drawing a curve, or in higher dimensions folding a manifold, I keep in mind that 
I think of the data sets as points on a band and the initial random configuration of weights and biases is like starting with the band in a completely random configuration spread all across a table.

While reading "Emergent Abilities of Large Language Models" by Wei et al., one of the examples that struck me was the 8-digit summation test. The performance not only increased dramatically with the "scratchpad" method, but completely saturated as well. This was a problem that seemed ideal for demonstrating the smooth scaling curve I imagined, starting with single digits corresponding to simple association and working up through progressively more complex problems to the original 8 digits. The BIG-bench dataset includes arithmetic for digits 1 through 5, but I didn't like the format they were given in for my specific use-case - in my mind, every non-numeric character in the sequence would be a waste that would require the network to implement a state machine to handle even the trivial extra complexity of the exact same pattern every time - a purely performative overhead. Testing my hypothesis requires paring down each problem as much as possible.
Methods

Results

Conclusion

Thanks
I'm looking for an arXiv endorsement so I can publish the full paper in Neural and Evolutionary Computation (cs.NE), so if you're willing and able to provide one for the Computer Science category, please send me a message and I will forward the endorsement code!
