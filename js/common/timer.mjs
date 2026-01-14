


/**
 * The 
 */
export class Timer {

    constructor() {
        this.seconds = 0;
        this.minutes = 0;
        this.hours = 0;
        this.days = 0;
        this.years = 0;
    }

    /**
     * 
     * @param {number} delta seconds elapsed in this frame
     */
    step(delta) {
        if (!(delta instanceof Number)) {
            console.error(`delta is not a Number: ${delta}`);
            return;
        }

        this.seconds += delta
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

    timeString() {
        return `${this.years}y${this.days}d${this.hours}h${this.minutes}m${this.seconds}`
    }
}
