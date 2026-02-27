/*
 * Copyright (c) 2026 Taush Sampley
 * This software is released under the GPL-3.0 License.
 * See LICENSE file in the project root for full license information.
 */

import ComplexNumber from 'math/complex.mjs';
import { Power } from '/math/power.mjs';

/**
 * This Fourier class provides utility functions and objects to process signals in individual samples or continuously.
 */
export default class Fourier {

  /**
   * A Fourier value represents a single frequency component in 
   * the Fourier series, with its real and imaginary parts, 
   * as well as the corresponding frequency.
   */
  static Value = class extends ComplexNumber {
    constructor(real, imag, frequency) {
      super(real, imag);
      this.frequency = frequency;
    }

    toString() {
      return `<${this.real.toFixed(2)}, ${this.imag.toFixed(2)}i, ${this.frequency.toFixed(2)}Hz>`;
    }
  };

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
    const size = Power.greatestPowerOfTwoLessThan(data.length);
    if (size !== data.length) {
      const padded = new Float32Array(size);
      padded.set(data);
      data = padded;
    }
    const { re, im } = Fourier.fft(data);
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

  /**
   * 
   * 
   * @param {Float32Array} input real-valued signal
   */
  static async fastTransform(input) {
    // TODO: move transform logic to here
    const { re, im } = Fourier.fft(input);
    const freqs = new Float32Array(re.length);
    const amps = new Float32Array(re.length);
    const phases = new Float32Array(re.length);
    for (let k = 0; k < re.length; k++) {
      freqs[k] = k * 44100 / re.length;
      amps[k] = Math.hypot(re[k], im[k]);
      phases[k] = Math.atan2(im[k], re[k]);
    }
    return new FourierSeries(freqs, amps, phases);
  }

  /**
   * In-place radix‑2 Cooley‑Tukey FFT, returning separate real/imag arrays.
   * @param {Float32Array} input real-valued signal (length power of two)
   * @returns {{re: Float32Array,im: Float32Array}}
   * TODO: refactor to return FourierSeries instead of separate arrays.
   * @deprecated use 
   */
  static async fft(input) {
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

  /**
   * The SlidingFourier class provides a single unit of processing for a
   * series of input signal chunks. It outputs a Fourier series for each chunk,
   * maintaining an internal buffer of the most recent samples.
   * 
   * Attach to a SpectrumAnalyzer to capture and retain the output series.
   */
  static SlidingWindow = class {
    /**
     * Configure the sliding Fourier processor with the given window
     *  size and hop size.
     * A smaller hop size will produce more frequent
     * transforms with more overlap, which can be useful for smoother
     * spectrograms.
     * 
     * @param {number} windowSize The minimum number of samples to retain for
     * each Fourier transform. This should be a power of two for optimal performance.
     * @param {number} hopSize The number of samples to advance the window
     * for each new transform. The default is equal to the window size, meaning
     * no overlap between windows.
     */
    constructor(windowSize, hopSize=windowSize) {
      this.windowSize = Math.round(windowSize);
      this.hopSize = Math.round(hopSize);

      /**
       * The internal window buffer that holds the most recent 
       * samples for processing.
       */
      this.buffer = new Float32Array(this.windowSize);
      /**
       * The current position in the buffer to write the next sample.
       */
      this.bufferPosition = 0;

      /**
       * The current index of the overall signal; incremented by {hopSize}
       * for each new window.
       */
      this.signalIndex = 0;
      /**
       * 
       */
      this.onSeriesListeners = [];
    }

    /**
     * 
     * @param {(FourierSeries)=>void} listener 
     */
    addOnSeriesListener(listener) {
      this.onSeriesListeners.push(listener);
    }

    /**
     * Emit a Fourier series to all listeners.
     * @param {FourierSeries} series The latest series produced by the 
     * latest window.
     */
    #emit(index, series) {
      this.onSeriesListeners.forEach(l => l(index, series));
    }

    removeOnSeriesListener(listener) {
      this.onSeriesListeners = this.onSeriesListeners.filter(l => l !== listener);
    }

    /**
     * 
     * ## Example 1
     * given: windowSize=1024, hopSize=1024; sample=
     * 
     * @param {Float32Array} chunk The most recent chunk of audio data to process.
     */
    async push(chunk) {
      let chunkConsumed = 0;
      while (chunkConsumed < chunk.length) {
        const spaceRemaining = this.windowSize - this.bufferPosition;
        const chunkRemaining = chunk.length - chunkConsumed;
        if (chunkRemaining >= spaceRemaining) {
          // copy enough to fill the window, then process and shift
          this.buffer.set(chunk.subarray(chunkConsumed, chunkConsumed + spaceRemaining), this.bufferPosition);
          this.bufferPosition += spaceRemaining;
          chunkConsumed += spaceRemaining;

          const series = await Fourier.fastTransform(this.buffer);
          this.#emit(this.signalIndex, series);
          this.signalIndex += this.hopSize;
        } else {
          // not enough to fill the window, just copy what we can and wait for the next chunk
          this.buffer.set(chunk.subarray(chunkConsumed, chunk.length), this.bufferPosition);
          this.bufferPosition += chunkRemaining;
          chunkConsumed += chunkRemaining;
        }
        const toCopy = Math.min(spaceRemaining, chunkRemaining);

        this.buffer.set(chunk.subarray(chunkConsumed, chunkConsumed + toCopy), this.bufferPosition);
        this.bufferPosition += toCopy;
        chunkConsumed += toCopy;
      }
    }

    processSample(sample) {
      this.buffer[this.bufferPosition] = sample;
      this.bufferPosition++;
    }
  }
}

/**
 * Represents a single Fourier series, extracted from a span of signal data.
 * This is the result of a Fourier transform, and contains the amplitudes 
 * and phases as a function of frequency.
 * 
 * A Fourier series can be seen as a function of frequency, where each frequency bin has a complex value representing the amplitude and phase of that frequency component in the original signal. The FourierSeries class provides a convenient way to store and manipulate this data, as well as to slice it for analysis or visualization.
 */
export class FourierSeries {
  /**
   * @param {Float32Array} real real part of the FFT output
   * @param {Float32Array} imag imaginary part of the FFT output
   * @param {Float32Array} frequencies frequency bin for each element
   */
  constructor(real,imag,frequencies) {
    this.real = real;
    this.imag = imag;
    this.frequencies = frequencies;

    /** @type {Float32Array} magnitude of each bin */
    this.amplitudes = new Float32Array(frequencies.length);
    /** @type {Float32Array} phase in radians for each bin */
    this.phases = new Float32Array(frequencies.length);
  }

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
