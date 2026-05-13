---
layout: post

title: Corrupted Comparisons
date: 2026-03-30 2247 -0500
---


As someone who can't help but recontextualize things in the bigger picture, I've always been drawn to architecture since I started learning about it.

and I must say I am very troubled by the incredible number of very poor – and often plain wrong – tutorials and explanations.

## MVC

```mermaid
%% Model View Controller
classDiagram
  class Model {
    noteList
  }
  class View {
    noteList: ListWidget
    bind(notes: List~Note~)
  }
  class Controller {
    selectNote
    deleteNote
  }
  View --> Controller
  Controller --> Model
```

## MVP

```mermaid
%% Model View Presenter
classDiagram
  class Model {

  }
  class View {

  }
  class Presenter {

  }
  View --> Presenter
  Presenter --> Model
  Presenter <-- Model
  View <-- Presenter
```

## MVVM

```mermaid
%% Model View ViewModel
classDiagram
  class Model {

  }
  class View {

  }
  class ViewModel {

  }
  View --> ViewModel
  ViewModel --> Model
  ViewModel <.. Model
  View <.. ViewModel
```

### MVVM+

```mermaid
%% Model View ViewModel Plus
classDiagram
  class Model {

  }
  class View {

  }
  class ViewModel {

  }
  View --> ViewModel
  ViewModel --> Model
  ViewModel <.. Model
  View <.. ViewModel
```

## MVI
MVI is just MVVM without a hundred callbacks.

```mermaid
%% Model View Intent
classDiagram
  class Model {
    datumA
    datumB
  }
  class View {
    componentA
  }
  class ViewModel {
    stateA
    onEvent
  }
  class Intent {
    %% Often called Actions
    ActionA
    ActionB
  }
  View --> ViewModel
  ViewModel --> Model
  ViewModel <.. Model
  View <.. ViewModel
```

{%- include code/mermaid-script.html -%}
