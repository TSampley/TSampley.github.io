---
layout: wiki

title: Video
description: 
date: 
---



<div style='flex-box:center'>
  <button id='start'>Start</button>
  <button id='stop'>Stop</button>
</div>

<video width=500 height=300 id='display'>Your Browser Does Not Support Video</video>

<script type='module'>
  import { ScreenRecorder } from '/js/components/screen-recorder.mjs'
  const recorder = new ScreenRecorder()
  const start = document.getElementById('start')
  const stop = document.getElementById('stop')
  const video = document.getElementById('display')
  start.onclick = async () => {
    const feed = await recorder.start()
    video.srcObject = feed
  }
  stop.onclick = async () => {
    await recorder.stop()
  }
</script>
