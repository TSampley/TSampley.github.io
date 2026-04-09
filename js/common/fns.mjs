
/**
 * A collection of no-op functions, each referenced as `f#` where `#`
 * is the number of parameters the function takes.
 */
export const NoOp = function (){}

/**
 * Sleeps for the given number of milliseconds.
 * @param {number} delay milliseconds
 * @returns A new Promise that resolves after the given delay.
 */
export const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
