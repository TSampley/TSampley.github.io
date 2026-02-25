
import './fourier.mjs';

self.onmessage = async ({ data }) => {
  console.info('worker received', JSON.stringify(data));
  if (data.type === 'window') {
    const { real, imag } = Fourier._fft(data.payload);
    const amps = new Float32Array(real.length);
    for (let i = 0; i < real.length; i++) {
      amps[i] = Math.hypot(real[i], imag[i]);
    }
    self.postMessage({ type: 'spectrum', amps, index: data.index }, [amps.buffer]);
  }
}
