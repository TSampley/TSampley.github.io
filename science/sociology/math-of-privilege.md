---
layout: article

title: The Math of Privilege
description: 

---

When people talk about privilege, they often refer to it unqualified, relying on context to make it clear what problem they're referring to, which is usually white privilege, cis-het male privilege, or generational wealth. Privilege comes in many forms. We need to also look at the scope and scale of the power granted by a specific form of privilege across contexts. Privilege, as a neutral, formal term, can refer to anything that one person or group can do or has access to which others do not.

If we imagine a vector of dimension N, representing all possible attributes of privilege that any given human can have, together with a matrix with M rows and N columns

```
N: number of attributes
M: number of contexts
A: attributes = <a_0, a_1, ..., a_n>
E: environment/context = [e_m,n]
P: power in particular context = E*A
```

Further, the power granted in each context allows extraction of some resource. For some resource R, there is an M-dimension vector describing how much of that resource can be extracted from some context as a function of power. The hypothetical total can be given by the simple dot product of the power vector and the extraction vector. Since no human can be totally involved in all possible contexts, it's more realistic to represent an individual with a masking vector of values from 0 to 1 representing how engaged the individual is in the extraction of some resource or value using their power granted by privilege in a particular context.

```
R: resource extraction = <r_0, r_1, ..., r_m>
K: masking vector = <k_0, k_1, ..., k_m>

```


