
import { lazy } from '../common/lazy.mjs'

const clack = lazy(()=>{return new Audio('/assets/audio/mouth-pop-short.wav')})
const pop = lazy(()=>{return new Audio('/assets/audio/mouth-pop-short.wav')})

export const SoundBoard = {

    /**
     * 
     * @param {LazyValue<Audio>} sound 
     */
    quickPlay: function (sound) {
        const clip = sound.value
        clip.pause()
        clip.fastSeek(0)
        clip.play()
    },

    playClack: function() {
        this.quickPlay(clack)
    },
    playPop: function() {
        this.quickPlay(pop)
    }
}
