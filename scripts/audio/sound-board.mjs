
import { lazy } from '../common/lazy.mjs'

export const SoundBoard = {
    clack: lazy(()=>{return new Audio('/assets/audio/billiard-ball-clack.wav')}),
    pop: lazy(()=>{return new Audio('/assets/audio/mouth-pop-short.wav')}),

    quickPlay: function (sound) {
        const clip = sound.value
        clip.pause()
        clip.fastSeek(0)
        clip.play()
    }
}
