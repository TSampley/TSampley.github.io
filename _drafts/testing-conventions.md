---
layout: post

title: Testing Conventions
date: 2024-03-28 0800 -0500
updated: 2026-07-19 1539 -0500
---

Testing terminology is fairly consistent, but it does differ across environments enough to be confusing. I think that has something to do with teams preferring different levels of test rigor, which leads them to different test methodologies, which means the same terms can be used to communicate slightly different ideas, while each team feels their use is reasonable and consistent (and arguably is - as long as everyone can remember they've created a subjective framework).
I've found when describing testing to some of my coworkers that the terminology can feel a little redundant. 
While I understand the merits of Descriptivism, I will never relent on the value of Prescriptivism (they don't need to be mutually exclusively, people). Microsoft's resource is a fantastic overview of testing terminology as it used today by some of the most rigorous engineering disciplinarians.
has naturally developed over time and are used 
I prefer to separate tests based on what is being tested and how (the depth)
<Subject><Test-Depth>
SomeServiceAdapterUnitTest
FooViewIntegrationTest
FooViewSystemTest

Unit Test
Integration Test
System Test
UI Test - unit test on UI
UX Test - integration test on UI
End-To-End Test - system test on UI

Visual Example of typical Android App implemented with full Clean Architecture, including interfaces and implementations (both production and testing)
Depict connections

I cannot recommend this open resource from Microsoft enough - it's unusually coherent documentation for Microsoft that comprehensively covers most of my views on testing: https://microsoft.github.io/code-with-engineering-playbook/automated-testing/
There are obvious divergences in our modeling of testing, but hopefully you understand why I prefer my model over the more traditional model that Microsoft uses above.