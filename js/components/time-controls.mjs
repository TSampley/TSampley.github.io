
/**
 * 
 */
export class TimeControls {
    /**
     * 
     * @param {string} buttonStartId Id of button to start time.
     * @param {string} buttonStopId Id of button to stop time.
     */
    constructor(buttonStartId,buttonStopId) {
        this.buttonStart = document.getElementById(buttonStartId)
        this.buttonSttop = document.getElementById(buttonStopId)
    }
}
