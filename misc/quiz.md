---
layout: demo

title: Quiz
date: 2026-03-26 1621 -0500
updated: 2026-04-04 0150 -0500
---

<!-- 
QUIZ UI:
  prompt:
  answers:
-->

Question:

<p id='question'></p>

Answer:

<div id='answer-list'>
  <button id='answer-a'>A</button>
  <button id='answer-b'>B</button>
  <button id='answer-c'>C</button>
  <button id='answer-d'>D</button>
</div>

<!-- 
QUIZ MODEL:
  pull from _assets/subjects.json
  map: title, description => prompt, answer
  map: description, title => prompt, answer
-->

<script type=module>
import { Quiz, Card } from './quiz.mjs'
const quiz = new Quiz()
quiz.bind(
  'question',
  'answer-list',
  'answer-a',
  'answer-b',
  'answer-c',
  'answer-d'
)
await quiz.populate(
  '/assets/data/quiz.json',
  (card)=>{
    return new Card(
      card.question,
      card.answer
    )
  }
)
quiz.start()
</script>
