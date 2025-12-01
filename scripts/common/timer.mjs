


/**
 * The 
 */
export class Timer {

    constructor() {
        this.milliseconds = 0;
        this.seconds = 0;
        this.minutes = 0;
        this.hours = 0;
        this.days = 0;
        this.years = 0;
    }

    /**
     * 
     * @param {number} delta milliseconds elapsed in this frame
     */
    step(delta) {
        if (!(delta instanceof Number)) {
            console.error(`delta is not a Number: ${delta}`);
            return;
        }

        this.milliseconds += delta;
        if (this.milliseconds > constants.MILLIS_PER_SECOND) {
            extraSeconds = this.milliseconds / constants.MILLIS_PER_SECOND;
            this.milliseconds %= constants.MILLIS_PER_SECOND;

            this.seconds += extraSeconds 
            if (this.seconds > constants.SECONDS_PER_MINUTE) {
                extraMinutes = this.seconds / constants.SECONDS_PER_MINUTE;
                this.seconds %= constants.SECONDS_PER_MINUTE;

                this.minutes += extraMinutes;
                if (this.minutes > constants.MINUTES_PER_HOUR) {
                    extraHours = this.minutes / constants.MINUTES_PER_HOUR;
                    this.minutes %= constants.MINUTES_PER_HOUR;

                    this.hours += extraHours;
                    if (this.hours > constants.HOURS_PER_DAY) {
                        extraDays = this.hours / constants.HOURS_PER_DAY;
                        this.hours %= constants.HOURS_PER_DAY;

                        if (this.days > constants.DAYS_PER_YEAR) {
                            extraYears = this.days / constants.DAYS_PER_YEAR;
                            this.days %= constants.DAYS_PER_YEAR;
                            
                            this.years += extraYears;
                        }
                    }
                }
            }
        }
    }
}
