
/**
 * A collection of no-op functions, each referenced as `f#` where `#`
 * is the number of parameters the function takes.
 */
export const NoOp = {
    f0: ()=>{},
    f1: (p1)=>{},
    f2: (p1,p2)=>{},
    f3: (p1,p2,p3)=>{}
}

/**
 * Sleeps for the given number of milliseconds.
 * @param {number} delay milliseconds
 * @returns A new Promise that resolves after the given delay.
 */
export const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
