
// #region Math Constants

/**
 * https://en.wikipedia.org/wiki/Pi
 */
export const PI = 3.1415926535
/**
 * https://en.wikipedia.org/wiki/E_(mathematical_constant)
 */
export const E = 2.71828

// #endregion

// #region Time Constants

export const MILLIS_PER_SECOND = 1000;
export const SECONDS_PER_MINUTE = 60;
export const MINUTES_PER_HOUR = 60;
export const HOURS_PER_DAY = 24;

/**
 * Milliseconds per day.
 * {@link MILLIS_PER_SECOND} * {@link SECONDS_PER_MINUTE} * 
 * {@link MINUTES_PER_HOUR} * {@link HOURS_PER_DAY}
 */
export const MILLIS_PER_DAY = 
    MILLIS_PER_SECOND * SECONDS_PER_MINUTE * 
    MINUTES_PER_HOUR * HOURS_PER_DAY;

// #endregion
