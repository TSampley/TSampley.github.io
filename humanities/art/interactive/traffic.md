---
layout: art

title: Traffic
description: An Interactive Digital Art
---

I enjoy the visual aesthetic of traffic 

<canvas id='art-canvas' width="100%" height="50%">Your browser does not support the canvas tag.</canvas>
<button id='button-fullscreen' onclick='enterFullscreen()'>Fullscreen</button>
<script type='module'>
  import { TrafficController } from './traffic.mjs';
  const trafficController = new TrafficController();
  trafficController.bind('art-canvas');
</script>
