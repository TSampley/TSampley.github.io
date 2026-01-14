---
layout: wiki

title: Compilers
description:

---


The demos on this site will focus on explaining how compilers and interpretters work, but as a consequence of end-to-end demonstrations, we will likely produce at least one, complete working compiler.

## Modern Three Stage Compilers

### Front End
Lexing - converts some input character sequence into a token sequence.
Parsing - converts a token sequence into an intermediate representation (IR), usually an abstract syntax tree (AST).
Semantic Analysis - validates the IR.

### Middle End
Transformations/Optimization - as optimizations come with trade-offs, the specific transformation needs some context to inform

### Back End
Generation - The IR is converted to the final output, usually a machine language for bare metal execution, intermediate instruction set for platform-independent bytecode execution

```mermaid

graph
  In[Input]
  subgraph front [Front End]
    Lexer[Lexer]
    Parsing[Parsing]
    SA[Semantic Analysis]
  end
  Lexer --> Parsing
  Parsing --> SA

  subgraph middle [Middle End]
    GOp[General Optimization]
  end
  SA --> GOp

  subgraph back [Back End]
    TOp[Target-Specific Optimization]
    Gen[Generation]
  end
  GOp --> TOp
  TOp --> Gen

  Out[Output]

  front --> middle
  middle --> back

  In --> Lexer
  Gen --> Out

```

{%- include code/mermaid-script.html -%}
