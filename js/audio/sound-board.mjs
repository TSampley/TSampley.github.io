
import { lazy } from '/js/common/lazy.mjs'

const clack = lazy(()=>{return new Audio('/assets/audio/glass-tap-dull.wav')})
const pop = lazy(()=>{return new Audio('/assets/audio/mouth-pop-short.wav')})
const woop = lazy(()=>{return new Audio('/assets/audio/mouth-woop-small.wav')})

export const SoundBoard = {

    /**
     * 
     * @param {LazyValue<Audio>} sound 
     */
    quickPlay: function (sound) {
        const clip = sound.value
        clip.pause()
        clip.currentTime = 0
        clip.play()
    },

    playClack: ()=>{
        SoundBoard.quickPlay(clack)
    },
    playPop: ()=>{
        SoundBoard.quickPlay(pop)
    },
    playWoop: ()=>{
        SoundBoard.quickPlay(woop)
    },
}
