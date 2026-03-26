---
layout: wiki

title: HTML
description: A markup language used since the early internet to layout webpages.
date: 2025-12-04 03:46:52 -0600
updated: 2026-03-25 1953 -0500
---

Hyper-Text Markup Language (HTML) was the first format used to draft the first web pages of the early internet.

During the Object-Oriented Era

## Input Types

### Button

<div>
<label for='input-button'>input-button</label>
    <input type='button' name='input-button' value='some value'/>
</div>

#### Submit

<div>
    <label for='input-submit'>input-submit</label>
    <input type='submit' name='input-submit' />
</div>

#### Reset

<div>
    <label for='input-reset'>input-reset</label>
    <input type='reset' name='input-reset' />
</div>

### Checkbox

<div>
    <label for='input-checkbox'>input-checkbox</label>
    <input type='checkbox' name='input-checkbox' />
</div>

### Color

<div>
    <label for='input-color'>input-color</label>
    <input type='color' name='input-color' />
</div>

### File

<div>
    <label for='input-file'>input-file</label>
    <input type='file' name='input-file' />
</div>

### Hidden

<div>
    <label for='input-hidden'>input-hidden</label>
    <input type='hidden' name='input-hidden' />
</div>

### Image

<div>
    <label for='input-image'>input-image</label>
    <input type='image' name='input-image' />
</div>

### Radio

<div>
    <label for='input-radio'>input-radio</label>
    <input type='radio' name='input-radio' />
</div>

### Range

<div>
    <label for='input-range'>input-range</label>
    <input type='range' name='input-range' />
</div>

### Text


#### Email

<div>
    <label for='input-email'>input-email</label>
    <input type='email' name='input-email' />
</div>

#### Number

<div>
    <label for='input-number'>input-number</label>
    <input type='number' name='input-number' />
</div>

#### Password

<div>
    <label for='input-password'>input-password</label>
    <input type='password' name='input-password' />
</div>

#### Search

<div>
    <label for='input-search'>input-search</label>
    <input type='search' name='input-search' />
</div>

#### Simple

<div>
    <label for='input-text'>input-text</label>
    <input type='text' name='input-text' />
</div>

### Telephone Number

<div>
    <label for='input-tel'>input-tel</label>
    <input type='tel' name='input-tel' />
</div>

#### URL

<div>
    <label for='input-url'>input-url</label>
    <input type='url' name='input-url' />
</div>

### Date Time

#### Date Time Local

<div>
    <label for='input-datetime-local'>input-datetime-local</label>
    <input type='datetime-local' name='input-datetime-local' />
</div>

#### Date

<div>
    <label for='input-date'>input-date</label>
    <input type='date' name='input-date' />
</div>

#### Month

<div>
    <label for='input-month'>input-month</label>
    <input type='month' name='input-month' min="2018-03" value="2018-03"/>
</div>

#### Time 

<div>
    <label for='input-time'>input-time</label>
    <input type='time' name='input-time' />
</div>

#### Week

<div>
    <label for='input-week'>input-week</label>
    <input type='week' name='input-week' />
</div>

## Human Readable Formats

JSON

YAML

TOML

[^toml]: https://toml.io/en/

<script type=module>
  import { HtmlPresenter } from './html.mjs'
  const presenter = new HtmlPresenter()
  presenter.init()
</script>
