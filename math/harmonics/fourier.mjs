/*
 * Copyright (c) 2026 Taush Sampley
 * This software is released under the GPL-3.0 License.
 * See LICENSE file in the project root for full license information.
 */

/**
 * This Fourier class provides utility functions and objects to process signals in individual samples or continuously.
 */
export default class Fourier {
  /**
   * Decode an audio blob or buffer and produce a Fourier series.
   * @param {Blob|AudioBuffer} signal audio input to transform
   * @returns {Promise<FourierSeries>} resolved FourierSeries
   */
  async transform(signal) {
    let audioBuffer;
    if (signal instanceof AudioBuffer) {
      audioBuffer = signal;
    } else {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const arrayBuffer = await signal.arrayBuffer();
      audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    }
    // use first channel for now
    let data = audioBuffer.getChannelData(0);
    // pad to power of two
    const size = Fourier._nextPowerOfTwo(data.length);
    if (size !== data.length) {
      const padded = new Float32Array(size);
      padded.set(data);
      data = padded;
    }
    const { re, im } = Fourier._fft(data);
    const sampleRate = audioBuffer.sampleRate;
    const freqs = new Float32Array(re.length);
    const amps = new Float32Array(re.length);
    const phases = new Float32Array(re.length);
    for (let k = 0; k < re.length; k++) {
      freqs[k] = k * sampleRate / re.length;
      amps[k] = Math.hypot(re[k], im[k]);
      phases[k] = Math.atan2(im[k], re[k]);
    }
    return new FourierSeries(freqs, amps, phases);
  }

  // helpers -------------------------------------------------------------
  static _nextPowerOfTwo(v) {
    let p = 1;
    while (p < v) p <<= 1;
    return p;
  }

  /**
   * In-place radix‑2 Cooley‑Tukey FFT, returning separate real/imag arrays.
   * @param {Float32Array} input real-valued signal (length power of two)
   * @returns {{re: Float32Array,im: Float32Array}}
   */
  static _fft(input) {
    const n = input.length;
    const re = new Float32Array(n);
    const im = new Float32Array(n);
    re.set(input);
    // bit reversal
    let j = 0;
    for (let i = 1; i < n; i++) {
      let bit = n >> 1;
      while (j & bit) {
        j ^= bit;
        bit >>= 1;
      }
      j ^= bit;
      if (i < j) {
        [re[i], re[j]] = [re[j], re[i]];
        [im[i], im[j]] = [im[j], im[i]];
      }
    }
    // FFT
    for (let len = 2; len <= n; len <<= 1) {
      const ang = -2 * Math.PI / len;
      const wlenRe = Math.cos(ang);
      const wlenIm = Math.sin(ang);
      for (let i = 0; i < n; i += len) {
        let wRe = 1;
        let wIm = 0;
        for (let k = 0; k < len / 2; k++) {
          const uRe = re[i + k];
          const uIm = im[i + k];
          const vRe = re[i + k + len / 2] * wRe - im[i + k + len / 2] * wIm;
          const vIm = re[i + k + len / 2] * wIm + im[i + k + len / 2] * wRe;
          re[i + k] = uRe + vRe;
          im[i + k] = uIm + vIm;
          re[i + k + len / 2] = uRe - vRe;
          im[i + k + len / 2] = uIm - vIm;
          const tmpRe = wRe * wlenRe - wIm * wlenIm;
          wIm = wRe * wlenIm + wIm * wlenRe;
          wRe = tmpRe;
        }
      }
    }
    return { re, im };
  }
}


/**
 * Represents a single Fourier series, extracted from a span of signal data.
 * This is the result of a Fourier transform, and contains the amplitudes 
 * and phases as a function of frequency.
 */
export class FourierSeries {
  /**
   * @param {Float32Array} frequencies frequency bin for each element
   * @param {Float32Array} amplitudes magnitude of each bin
   * @param {Float32Array} phases phase in radians for each bin
   */
  constructor(frequencies, amplitudes, phases) {
    this.frequencies = frequencies;
    this.amplitudes = amplitudes;
    this.phases = phases;
  }

  /**
   * return number of bins in the series
   */
  get length() {
    return this.frequencies.length;
  }

  /**
   * slice the series (useful for zooming into a subset of spectrum)
   * @param {number} start
   * @param {number} end
   * @returns {FourierSeries}
   */
  slice(start, end) {
    return new FourierSeries(
      this.frequencies.slice(start, end),
      this.amplitudes.slice(start, end),
      this.phases.slice(start, end)
    );
  }
}
