---
layout: post

title: Associating Behavior without Breaking Equality
date: 2025-06-12 0800 -0500
updated: 2026-07-19 1559 -0500
---

I've just read this article by [Anatolii Frolov](https://medium.com/@af2905g) about lambdas breaking behaviors we often take for granted in data classes: copy, hashCode, equals. As he points out at the end, this doesn't usually cause problems, but it could, so I wanted to talk about one solution that allows us to keep those lambdas associated (if you really need to use such a pattern). Fair warning: stream of consciousness.
Lambdas are Closures
These terms come from slightly different areas of study. A lambda, from lambda calculus, in general is just a function treated like a value itself that can be passed around like any other value. A closure in programming is a bit more distant from its mathematical origin than lambdas, but you just need to know that a closure "closes" its surrounding context where it was declared, making it available at a later time. So for us this means the following convenient code is compiled under the hood to something like this:
fun main() {
  val countries: Map<String, String> = mapOf()
  val greeting = { println("Hey there from ${countries["US"]}!") }
  greeting()
}

// ==== under the hood ====
class GreetingLambda(
  countries: Map<String, String>
): Function0 {
  override operator fun invoke() {
    println("Hey there from ${countries["US"]}!")
  }
}
val countries: Map<String, String>
val greeting = GreetingLambda(countries)
greeting()
You might think that the closure would evaluate and capture the current value returned by countries["US"] at the time the lambda was created, but it actually captures the map variable. You can check the bytecode (in Android Studio: Tools->Kotlin->Show Kotlin ByteCode), and you'll see an entry with the heading private final static main$lambda$0(Ljava/util/Map;)Lkotlin/Unit; - this is the beginning of the lambda code, and a little lower, you can see that the map is actually referenced with the given key.
ALOAD 0
LDC "US"
INVOKEINTERFACE java/util/Map.get (Ljava/lang/Object;)Ljava/lang/Object; (itf)
CHECKCAST java/lang/String
So whatever variables you reference in a lambda will be closed and carried around with the lambda instance (sidenote: this is an easy way to subtly introduce memory leaks).
Data Classes to the Rescue
If our lambdas are already carrying around these variables, and we want to implement equality, the obvious choice in Kotlin is a Data Class.
data class GreetingLambda(
  countries: Map<String, String>
) {
  operator fun invoke() {
    println("Hey there from ${countries["US"]}!")
  }
}
This is nearly indistinguishable from the generated version, except as a data class, we get all that good bean-y behavior.
Unfortunately, this has a trade-off of reducing readability since the old code becomes
fun main() {
  val countries: Map<String, String> = mapOf()
  val greeting = GreetingLambda(countries)
  greeting()
}
and we often like to use lambdas (especially trailing) to explicitly associate readable behavior, so I can only recommend this if detecting equality by value rather than by reference is more important to you than reading the behavior inline.
The original author mentioned Compose, and in that context, the only issue with checking equality by reference is that it may cause unnecessary recompositions. If you're displaying the same object with associated lambda changing, then it's likely the recomposition is necessary. If the compose-bound lambda is changing because the containing instance is changing, then it's possible that those individual lambda instances actually have the same closed values and recomposition can be skipped. But without a concrete example I can only speculate wildly without covering every possible theoretical case, so I'll just stop here. 🤷🏻
Extensions to the Rescue?
Another thing! If you want to retain readability, you could instead use an extension lambda that uses the containing class as the extension receiver in some situations
val lambda: Action.()->Unit = { action ->
  println("I'm trying to ${action.verb} here!")
}

data class Action(
  val verb: String,
  val action: Action.()->Unit
)
but in the original example, this gets us back to the original problem if used in a data class where the lambda is compared by reference, breaking equality, unless you re-implement your own equals function. So it does remove the implicitly retained references characteristic of closures, allowing you to express logic inline, but you still need to re-implement equals. However, there is a benefit in the original example: using copy on a data class could introduce subtle bugs if some values are replaced and the lambda depending on those values isn't updated. Ok, I'm done speculating, for real now.
