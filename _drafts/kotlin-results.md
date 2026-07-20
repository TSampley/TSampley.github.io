---
layout: post

title: Kotlin Results and Rich Errors
date: 2025-06-06 0800 -0500
updated: 2026-07-19 1858 -0500
---

This is a micro article written in response to this article by [Darren Le](https://medium.com/@xuanlocle?source=user_popover). His article covers java-style try-catch usage, but skips the Result API (which has become common for many) straight to Rich Results. I wanted to explore a little bit more of its motivation through a Result example, but neglected that Medium comments don't support markdown - understandable.
In both cases, assume we have the following Exception hierarchy:
sealed class StringParseException(val msg: String): IllegalArgumentException(msg)
class StringParseException(val token: String): StringParseException("Bad token '$token'.")
class EmptyStringException: StringParseException("String cannot be empty")
We then use these in some function to report potential errors through a Result of type String; however, if you want to map the result to a type without propagating the exception, then we have to add some noise to get the Kotlin compiler to report the behavior we expect since it can't detect across the two inline functions `onSuccess` and `onFailure` that the function will have already terminated. Add on-top that we can't define the base Exception type for Result, which requires an additional `when` condition: either `else ->` or `Exception ->`, which is again more required noise.
fun stuff(): Result<String> {
  // try to do some stuff and return a String Result with possible StringParseException
}

fun clientCode(): Int {
  return stuff()
    .onSuccess { value -> /* convert String value to Int */}
    .onFailure { error ->
      when (error) {
        is StringParseException -> { /* handle error and provide appropriate fallback Int */ }
        is EmptyStringException -> { /* handle error and provide appropriate fallback Int */ }
        else -> throw IllegalStateException("How'd you get here?")
      }
    }
  throw IllegalStateException("You shouldn't be here!")
}
With Rich Errors, this becomes:
fun stuff(): String | StringParseException {
  // try to do some stuff and return a String Result with possible Exception
}

fun clientCode(): Int {
  return when (stuff()) {
    is String -> { /* convert String value to Int */ }
    is StringLengthException -> { /* handle error and provide appropriate fallback Int */ }
    is EmptyStringException -> { /* handle error and provide appropriate fallback Int */ }
  }
}
Much easier to read! 👏👏👏
