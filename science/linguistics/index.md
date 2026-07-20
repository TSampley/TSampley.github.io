---
layout: wiki

title: Linguistics
description:
---

The study of language, it's origins, function, and applications.


```timeline

- event: structuralism
  when: 
  contributors:
    - name: 
- event: functionalism
  when: 
  contributors:
    - name: 
- event: generativism
  when: 
  contributors:
    - name: Noam Chomsky
- event: cognitivism
  when: 
  contributors:
    - name: 

```

[^brit-history]: https://www.britannica.com/science/linguistics
[^wiki-ling]: https://en.wikipedia.org/wiki/Linguistics
[^wiki-struct]: https://en.wikipedia.org/wiki/Structural_linguistics
[^wiki-func]: https://en.wikipedia.org/wiki/Functional_linguistics


[^bogus]: https://scitechdaily.com/have-we-been-wrong-about-language-for-70-years-new-study-challenges-long-held-theory/



## Language Comparison

1. Use POS tagging[^wals-adpos][^uni-pos]
2. Build Syntax Trees - Dependency Trees over Constituency Trees for Generality
3. Extract Conceptual Graphs in common between syntax trees[^uni-dep]
  - Agent
  - Patient
  - Instrument
  - Location

### Languages Compared

- English
  - SVO
  - rigid word order
  - highly configurational
  - spatiotemporal prepositions
- Spanish
  - SVO
  - flexible word order
  - prepositions
  - rich verbal inflection (person/number)
- Japanese
  - SOV
  - head final
  - agglutinative
  - postpositional particles
- Russian
  - SVO; functionally free order
  - highly inflectional
  - 6 case noun system
- Chinese

[^wals-adpos]: https://wals.info/chapter/85
[^uni-pos]: https://universaldependencies.org/u/pos/
[^uni-dep]: https://universaldependencies.org/u/feat/all.html

## Comparison Levels

### Level 1
- 

English: The cat chases the mouse.
- The (DET) | cat (NOUN) | chases (VERB) | the (DET) | mouse (NOUN)
Spanish:El gato persigue al ratón.
- El (DET) | gato (NOUN) | persigue (VERB) | a (ADP) | el (DET) | ratón (NOUN)
Japanese:猫が 鼠を 追いかける。
- 猫 (NOUN) | が (ADP/PART) | 鼠 (NOUN) | を (ADP/PART) | 追いかける (VERB)
Russian: Кошка гонится за мышью.
- Кошка (NOUN, Nom.) | гонится (VERB) | за (ADP) | мышью (NOUN, Instr.)


### Level 2
- 

English: The book is on the table in the kitchen.
- The (DET) | book (NOUN) | is (AUX/VERB) | on (ADP) | the (DET) | table (NOUN) | in (ADP) | the (DET) | kitchen (NOUN)
Spanish: El libro está sobre la mesa en la cocina.
- El (DET) | libro (NOUN) | está (VERB) | sobre (ADP) | la (DET) | mesa (NOUN) | en (ADP) | la (DET) | cocina (NOUN)
Japanese: 本は 台所の テーブルの上に あります。
- 本 (NOUN) | は (PART) | 台所 (NOUN) | の (PART) | テーブル (NOUN) | の (PART) | 上 (NOUN/NOUN_REL) | に (ADP) | あります (VERB)
Russian:Книга лежит на столе на кухне.
- Книга (NOUN, Nom.) | лежит (VERB) | на (ADP) | столе (NOUN, Prep. Case) | на (ADP) | кухне (NOUN, Prep. Case)

### Level 3
-

English: The teacher gave a gift to the student.
- The (DET) | teacher (NOUN) | gave (VERB) | a (DET) | gift (NOUN) | to (ADP) | the (DET) | student (NOUN)
Spanish: El profesor le dio un regalo al estudiante.
- El (DET) | profesor (NOUN) | le (PRON) | dio (VERB) | un (DET) | regalo (NOUN) | a (ADP) | el (DET) | estudiante (NOUN)
Japanese: 先生が 生徒に プレゼントを 与えた。
- 先生 (NOUN) | が (PART) | 生徒 (NOUN) | に (PART) | プレゼント (NOUN) | を (PART) | 与えた (VERB)
Russian: Учитель подарил студенту подарок.
- Учитель (NOUN, Nom.) | подарил (VERB) | студенту (NOUN, Dat.) | подарок (NOUN, Acc.)

### Level 4
- 

English: The scientist who discovered the element won the prize.
- The (DET) | scientist (NOUN) | who (PRON) | discovered (VERB) | the (DET) | element (NOUN) | won (VERB) | the (DET) | prize (NOUN)
Spanish: El científico que descubrió el elemento ganó el premio.
- El (DET) | científico (NOUN) | que (PRON) | descubrió (VERB) | el (DET) | elemento (NOUN) | ganó (VERB) | el (DET) | premio (NOUN)
Japanese:元素を 発見した 科学者が 賞を 獲得した。
- 元素 (NOUN) | を (PART) | 発見した (VERB) | 科学者 (NOUN) | が (PART) | 賞 (NOUN) | を (PART) | 獲得した (VERB)
Russian:Учёный, который открыл элемент, выиграл приз.
- Учёный (NOUN) | который (PRON) | открыл (VERB) | элемент (NOUN) | выиграл (VERB) | приз (NOUN)
