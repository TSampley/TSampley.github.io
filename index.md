---
# TODO: rename home layout; move posts list to "/blog/" path

layout: home
---

{%- for otherPage in site.pages | where -%}
  {%- assign excluded = 'about,feed.xml,404.html' | split: ',' -%}
  {%- assign segments = otherPage.url | split: '/' -%}

  {%- unless segments[2] or excluded contains segments[1] -%}
    {%- if segments[1] -%}
      {% include components/topic.html topic=otherPage.title url=otherPage.url %}
    {%- endif -%}

  {%- endunless -%}

{%- endfor -%}
