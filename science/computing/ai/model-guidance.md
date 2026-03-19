---
layout: wiki

title: Model Guidance
description:
date: 2026-03-19 1733 -0500
---



### Website Page Review

Variables are listed below with descriptions of their contents and use.

- `const page: File`: The website page to review.
- `const critera: List<Criterion>`: The criteria to check each page against.
- `const

Tools:
`function(arg1, arg2, ...): Type {}`

- `ls(dir): List<String>`: List contents of `dir`.


Task:
I'm going to give you a list of website URLs with the command `REVIEW(<URL>)`.
The given `URL` should return a `page` for you to review against the following `criteria`:
- The page title should describe the contents of the page.
- The contents of the page should:
  - be relevant to the subject indicated by the title of the page
  - have enough detail for a user to roughly understand the subject

For each `URL` you are given to review, do the following:
- note deviations from `criteria` and advise:
  - expand `criteria` to include deviation
  - suggest modifications to `page` contents to conform to `criteria`

If you do not understand the instructions, you may ask questions now. If you understand the instructions, respond with 'confirmed'.

### Development Environment Setup



- You have access to a Standard Agent Toolset
- Review your environment


#### Standard Agent Toolset
The standard set of tools provided to agents working in a container environment.

Each agent should be familiar with toolsets specific to an environment, like the standard Unix commands, so the SAT focuses on tools that fascilitate agents investigating and acting in new environments.

- case_study: Deployed to New Linux Environment
  environment:
  agent: 
    model: GPT-5o
    instructions: |-
      You are a development agent

  steps:
    - 