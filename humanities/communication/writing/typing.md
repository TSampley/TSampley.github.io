---
layout: wiki

title: Typing
description: 

---

Here you can do some typing practice!

<p id='typing-copy' class=''></p>
<div id='typing-input' class=''>
  <!-- Words Here -->
</div>

<script src='./typing.mjs' type='module' async></script>

Features:
- Type from excerpts
- Save performance
- View performance over time


```mermaid

classDiagram
  class WebApp {

  }
  class TypingApp {

  }
  WebApp <|-- TypingApp
  class TypingUi {
    bind(callbacks)
  }
  class TypingPresenter {
    bind()
  }
  class TypingModel {
    insert(char)
    delete()
  }

  TypingPresenter *--> TypingModel
  TypingPresenter *--> TypingUi

  TypingApp *--> TypingPresenter

```

{% include code/mermaid-script.html %}