
// #region Math Constants

/**
 * https://en.wikipedia.org/wiki/Pi
 */
const PI = 3.1415926535
/**
 * https://en.wikipedia.org/wiki/E_(mathematical_constant)
 */
const E = 2.71828

// #endregion

// #region Time Constants

const MILLIS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;

/**
 * Milliseconds per day.
 * {@link MILLIS_PER_SECOND} * {@link SECONDS_PER_MINUTE} * 
 * {@link MINUTES_PER_HOUR} * {@link HOURS_PER_DAY}
 */
const MILLIS_PER_DAY = 
    MILLIS_PER_SECOND * SECONDS_PER_MINUTE * 
    MINUTES_PER_HOUR * HOURS_PER_DAY;

// #endregion

export {
    MILLIS_PER_DAY, 
    MILLIS_PER_SECOND, SECONDS_PER_MINUTE, MINUTES_PER_HOUR, HOURS_PER_DAY,
    E, PI
};
