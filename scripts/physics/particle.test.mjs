
// const library = require('./particle')

import something from '../physics.js'

test("x coordinate should be first constructor arg", () => {
    let testPart = new Particle(0, 5, {})

    expect(testPart.x).toBe(0);
    expect(testPart.y).toBe(5);
});
