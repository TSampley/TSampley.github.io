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

async function processWindow(data) {
  const series = await Fourier.fastTransform(data.payload);
  self.postMessage(
    {
      type: 'spectrum',
      amps: series.amps, imag: series.imag, real: series.real,
      index: data.index
    },
    [series.amps.buffer, series.imag.buffer, series.real.buffer]
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
