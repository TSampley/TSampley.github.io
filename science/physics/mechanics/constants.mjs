
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

// #region Physical Constants

/**
 * Permitivity of vacuum in terms of coulombs
 * 
 * https://en.wikipedia.org/wiki/Vacuum_permittivity
 * 
 * @type {number} $`F * m^-1` | $`C^2 * kg^-1 * m^-3 * s^2`$
 */
export const VACUUM_PERMITIVITY_C = 8.8541878188E-12

/**
 * Permitivity of vacuum in terms of electron volts.
 * 
 * https://en.wikipedia.org/wiki/Vacuum_permittivity
 * 
 * @type {number} $`e^2 * eV^-1 * um^-1`$
 */
export const VACUUM_PERMITIVITY_EV = 55.26349406

/**
 * $`\frac{1}{4 * PI * \epsilon_0}`$
 * 
 * https://en.wikipedia.org/wiki/Coulomb%27s_law#Coulomb_constant
 * 
 * @type {number} $`N * m^2 * C^-2`$
 */
export const COULOMB_CONSTANT = 8.987551785972E9

/**
 * https://en.wikipedia.org/wiki/Gravity_of_Earth
 * 
 * @type {number} $`m * s^-2`$ | $`N * kg^-1`$
 */
export const GRAVITY_EARTH_ACCELERATION = 9.8

/**
 * $`F = G * \frac{m_1 * m_2}{r^2}`$
 * 
 * https://en.wikipedia.org/wiki/Gravitational_constant
 * 
 * @type {number} $`m^3 * kg^-1 * s^-2`$
 */
export const GRAVITY_CONSTANT = 6.6743E-11

// #endregion
