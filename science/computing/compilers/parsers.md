---
layout: wiki

title: Parsers
description: 

---

A parser takes some input, usually a sequential stream of symbols, and converts it to a set of tokens.

### Context-Free Grammar
CFG [^cfg].

LR Parser 0: Left-to-Right scanning, Right-most derivation, 0 lookahead

SLR < LALR(1)
SLR < LR(1)
LR(0) < SLR


[^lr-demo]: https://lr0parser.com/
[^formal-lang]: https://en.wikipedia.org/wiki/Formal_language
[^cfg]: https://en.wikipedia.org/wiki/Context-free_grammar
[^grammar]: https://en.wikipedia.org/wiki/Ambiguous_grammar
