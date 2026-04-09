
/**
 * 
 */
export class ScreenRecorder {

  constructor() {
    // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getDisplayMedia#options
    this.options = {
      video: true, // allow all possible video options
      audio: {
        suppressLocalAudioPlayback: false
      },
      // monitorTypeSurfaces: "include",
      preferCurrentTab: false,
      selfBrowserSurface: "exclude",
      surfaceSwitching: "include",
      systemAudio: "include",
      windowAudio: true
    }
  }

  async start() {
    if (this.capture) {
      // TODO: stop current recording
      console.warn('Capture in progress')
    }
    let capture = null;
    try {
      capture = await navigator.mediaDevices.getDisplayMedia(this.options)
    } catch (error) {
      console.error('Error while startin capture: ', error)
    }
    this.capture = capture
  }

  async stop() {
    if (this.capture) {
      this.capture.getTracks().forEach((track)=>{
        track.stop()
      })
      this.capture = null;
    } else {
      console.warn('Capture not in progress')
    }
  }
}
