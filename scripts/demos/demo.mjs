
/**
 * 
 */
export class Demo {
    /**
     * @param {String} id The HTMLElement id for the host canvas.
     */
    constructor(id) {
        this.canvas = document.getElementById(id);
        this.context = this.canvas.getContext('2d');
    }

    addEventListener(event,listener) {
        this.canvas.addEventListener(event,listener);
    }
    addMouseDownListener(listener) {
        this.canvas.addEventListener('mousedown',listener);
    }
    addMouseUpListener(listener) {
        this.canvas.addEventListener('mouseup',listener);
    }
    addMouseMoveListener(listener) {
        this.canvas.addEventListener('mousemove',listener);
    }
    addKeyDownListener(listener) {
        this.canvas.addEventListener('keydown',listener);
    }
}
