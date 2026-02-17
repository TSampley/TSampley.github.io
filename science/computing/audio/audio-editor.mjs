/*
 * Copyright (c) 2026 Taush Sampley
 * This software is released under the GPL-3.0 License.
 * See LICENSE file in the project root for full license information.
 */

import { single, Observable } from "../../../js/common/observables.mjs";
import Fourier from "../../../math/harmonics/fourier.mjs";

/**
 * The AudioEditorUi class is responsible for encapsulating the HTML elements
 * of the audio editor and providing methods to update presented models as
 * well as creating listeners for user interactions and passing them to the
 * presenter.
 */
class AudioEditorUi {
  constructor() {
    /**
     * The audio canvas renders the audio being edited as a spectrogram or
     * waveform, allowing the user to visualize the final result.
     */
    this.audioCanvas = document.getElementById("app-canvas");

    /**
     * Allows the user to record new audio clips directly into the editor,
     * which can then be edited and mixed with existing audio.
     */
    this.recordButton = document.getElementById("record-button");
    this.playButton = document.getElementById("play-button");
    this.stopButton = document.getElementById("stop-button");

    this.presenter = null;
    this.#initUi();
  }

  #initUi() {
    this.recordButton.addEventListener("click", async () => {
      if (this.presenter) {
        try {
          await this.presenter.onRecordButtonClick();
        } catch (error) {
          console.error('Error handling record button click:', error);
        }
      }
    });
    this.playButton.addEventListener("click", async () => {
      if (this.presenter) {
        try {
          await this.presenter.onPlayButtonClick();
        } catch (error) {
          console.error('Error handling play button click:', error);
        }
      }
    });
    this.stopButton.addEventListener("click", async () => {
      if (this.presenter) {
        try {
          await this.presenter.onStopButtonClick();
        } catch (error) {
          console.error('Error handling stop button click:', error);
        }
      }
    });
  }

  /**
   * 
   * @param {AudioEditorPresenter} presenter 
   */
  setPresenter(presenter) {
    if (this.presenter) {
      this.presenter.onReleaseUi(this);
    }
    if (presenter) {
      presenter.onRetainUi(this);
    }

    this.presenter = presenter;
  }

  drawAudioBuffer(buffer) {
    if (!buffer) return;
    const fft = new Fourier();
    fft.transform(buffer)
      .then(series => {
        const ctx = this.audioCanvas.getContext("2d");
        const w = this.audioCanvas.width;
        const h = this.audioCanvas.height;
        ctx.clearRect(0, 0, w, h);
        const len = series.length;
        // draw amplitude spectrum
        ctx.beginPath();
        for (let i = 0; i < len; i++) {
          const x = (i / len) * w;
          const y = h - (series.amplitudes[i] / Math.max(...series.amplitudes)) * h;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = "#00f";
        ctx.stroke();
      })
      .catch(err => console.error("FFT error:", err));
  }
}

/**
 * 
 */
class AudioEditorPresenter {
  /**
   * @param {AudioEditorUi} ui The user interface of the audio editor.
   * @param {AudioEditor} model The core logic of the audio editor.
   */
  constructor(ui,model) {
    this.ui = ui;
    this.model = model;

    this.selectedTrack = null;

    this.error = single(null);

    this.ui.setPresenter(this);
  }

  onRetainUi(ui) {}

  onReleaseUi(ui) {}

  async onRecordButtonClick() {
    try {
      if (!this.model.isRecording.value) {
        // start recording
        await this.model.startRecording(this.selectedTrack);
      } else {
        // stop recording and create new audio clip with recorded audio data
        const recording = await this.model.stopRecording();
        // TODO: manage track and clip state in presenter instead of model
        // this.model.addClip(recording);

        // render spectrum for the new clip
        this.ui.drawAudioBuffer(recording.buffer);
      }
    } catch (error) {
      console.error('Error handling record button click:', error);
      this.error.value = error;
    }
  }

  async onPlayButtonClick() {
    try {
      if (this.model.isPlaying) {
        this.model.pausePlayback();
      } else {
        this.model.startPlayback();
      }
    } catch (error) {
      console.error('Error handling play button click:', error);
      this.error.value = error;
    }
  }
  
  async onStopButtonClick() {
    try {
      this.model.stopPlayback();
    } catch (error) {
      console.error('Error handling stop button click:', error);
      this.error.value = error;
    }
  }
}

/**
 * The AudioEditor class is responsible for the core logic of the audio editor,
 *  including processing audio data, applying effects, and managing the state 
 * of the editor. It interacts with the presenter to receive user input and 
 * update the UI accordingly.
 * 
 * The AudioEditor consists of 1 or more AudioTrack objects, which are
 * containers for AudioClip objects, which in turn contain raw audio data.
 * 
 */
class AudioEditor {
  /**
   * 
   * @param {AudioRecorder} recorder 
   */
  constructor(recorder) {
    this.recorder = recorder;

    /**
     * The audio buffer is a data structure that holds the raw audio data that is being edited. It is typically an array of audio samples, which are numerical representations of the sound wave. The audio buffer allows the editor to manipulate the audio data, apply effects, and play back the edited audio.
     */
    this.buffer = null;

    /**
     * A single 
     * @type {AudioTrack[]}
     */
    this.tracks = [];

    /** @type {Observable<boolean>} */
    this.isRecording = single(false);
  }

  get duration() {
    if (this.tracks.length === 0) {
      return 0;
    }
    return Math.max(...this.tracks.map(track => track.end));
  }

  #recordingTrack = null;
  #recordingClip = null;
  /**
   * 
   * @param {AudioTrack?} track An optional track to record the new sample
   * into. If not provided, a new track will be created for the sample.
   */
  async startRecording(track) {
    try {
      this.isRecording.value = true;

      if (track) {
        this.#recordingTrack = track;
      } else {
        const newTrack = new AudioTrack();
        this.tracks.push(newTrack);
        this.#recordingTrack = newTrack;
      }

      this.#recordingClip = new AudioClip();
      
      // Start recording via the AudioRecorder
      await this.recorder.startRecording();
    } catch (error) {
      this.isRecording.value = false;
      this.#recordingTrack = null;
      this.#recordingClip = null;
      console.error('Failed to start recording:', error);
      throw error;
    }
  }

  /**
   * Stop the current recording and return the new audio clip
   * @returns {Promise<AudioClip>} A promise that resolves to the new audio clip
   */
  async stopRecording() {
    try {
      this.isRecording.value = false;
      
      // Stop recording and get the audio blob
      const audioBlob = await this.recorder.stopRecording();
      
      // Convert blob to ArrayBuffer for the clip
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const arrayBuffer = await audioBlob.arrayBuffer();
      this.#recordingClip.buffer = await audioContext.decodeAudioData(arrayBuffer);
      
      // Set clip timing based on track position
      if (this.#recordingTrack) {
        this.#recordingClip.startTime = this.#recordingTrack.end;
        this.#recordingClip.endTime = this.#recordingTrack.end + (this.#recordingClip.buffer.duration || 0);
        this.#recordingTrack.clips.push(this.#recordingClip);
      }
      
      const clip = this.#recordingClip;
      this.#recordingTrack = null;
      this.#recordingClip = null;
      
      return clip;
    } catch (error) {
      this.#recordingTrack = null;
      this.#recordingClip = null;
      console.error('Failed to stop recording:', error);
      throw error;
    }
  }

  async startPlayback() {

  }

  async pausePlayback() {

  }

  async stopPlayback() {

  }
}

class AudioTrack {
  constructor() {
    /**
     * @type {AudioClip[]}
     */
    this.clips = [];
  }

  get start() {
    if (this.clips.length === 0) {
      return 0;
    }
    return Math.min(...this.clips.map(clip => clip.startTime));
  }

  get end() {
    if (this.clips.length === 0) {
      return 0;
    }
    return Math.max(...this.clips.map(clip => clip.endTime));
  }

  get duration() {
    return this.end - this.start;
  }
}

class AudioClip {
  constructor() {
    /**
     * The audio data for this clip, which may be a portion of the original audio buffer or a separate recording.
     */
    this.buffer = null;
    /**
     * The start time of the clip within the track, in seconds.
     */
    this.startTime = 0;
    /**
     * The end time of the clip within the track, in seconds.
     */
    this.endTime = 0;
  }
}

/**
 * The AudioRecorder class is an adapter for the Web Audio API's MediaRecorder, which provides a simple interface for recording audio from the user's microphone. It handles the complexities of setting up the audio context, managing the recording state, and providing the recorded audio data to the AudioEditor for further processing and editing.
 */
class AudioRecorder {
  constructor() {
    /** @type {MediaRecorder} */
    this.mediaRecorder = null;
    
    /** @type {Blob[]} */
    this.audioChunks = [];
    
    /** @type {MediaStream} */
    this.mediaStream = null;
  }

  /**
   * Start recording audio from the user's microphone.
   * @returns {Promise<void>}
   */
  async startRecording() {
    try {
      // Request access to the user's microphone
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ 
        audio: true 
      });
      
      // Create a MediaRecorder instance with the audio stream
      this.mediaRecorder = new MediaRecorder(this.mediaStream);
      this.audioChunks = [];
      
      // Collect audio data chunks
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };
      
      // Start recording
      this.mediaRecorder.start();
    } catch (error) {
      console.error('Failed to start recording:', error);
      throw error;
    }
  }

  /**
   * Stop recording and return the recorded audio data as a Blob.
   * @returns {Promise<Blob>} A promise that resolves to the recorded audio data
   */
  stopRecording() {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('Recording has not been started'));
        return;
      }

      this.mediaRecorder.onstop = () => {
        // Combine all audio chunks into a single Blob
        const audioBlob = new Blob(this.audioChunks, { 
          type: this.mediaRecorder.mimeType 
        });
        
        // Stop all audio tracks from the media stream
        if (this.mediaStream) {
          this.mediaStream.getTracks().forEach(track => track.stop());
        }
        
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.mediaStream = null;
        
        resolve(audioBlob);
      };
      
      // Stop recording
      this.mediaRecorder.stop();
    });
  }
}

// Program Begin

const ui = new AudioEditorUi();
const model = new AudioEditor(new AudioRecorder());
const presenter = new AudioEditorPresenter(ui, model);
