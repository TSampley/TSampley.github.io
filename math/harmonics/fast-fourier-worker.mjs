/*
 * Copyright (c) 2026 Taush Sampley
 * This software is released under the GPL-3.0 License.
 * See LICENSE file in the project root for full license information.
 *
 * # Fast Fourier Worker
 * 
 * This is a web worker that performs the Fast Fourier Transform (FFT) on a given input signal.
 * It listens for messages containing the signal data, computes the FFT, and posts back the spectrum.
 * 
 * For information on efficiently transferring memory between worker
 * and the host: https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Transferable_objects
 */

import { Fourier } from './fourier.mjs';

function processWindow(data) {
  const { real, imag } = Fourier.fft(data.payload);
  const amps = new Float32Array(real.length);
  for (let i = 0; i < real.length; i++) {
    amps[i] = Math.hypot(real[i], imag[i]);
  }
  self.postMessage(
    { type: 'spectrum', amps, index: data.index }, 
    [amps.buffer]
  );
}

self.onmessage = async ({ data }) => {
  console.info('worker received', JSON.stringify(data));
  switch (data.type) {
    case 'window':
      processWindow(data);
      break;
    default:
      console.warn('unknown message type', data.type);
      return;
  }
}
