# Taush Sampley - Personal Static Site

This project consists of a Jekyll Site (_config.yml) using Ruby (Gemfile) as well as a Node project (package.json).

## Site Layouts

```mermaid

graph

%% root level
x --> home
x --> homepage
x --> default
%% level 1
default -.-> propStylesheet
default --> page
default --> post
default --> recipe
default --> wiki
default --> wiki-branch
%% level 2
post --> art
post --> demo
%% level 3
demo -.-> propModule

```

## Building

To build and serve locally with drafts: `bundle exec jekyll serve --trace --drafts`.

To deploy to GitHub Pages simply push to the main branch.
