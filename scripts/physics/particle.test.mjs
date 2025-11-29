
import { Particle, Properties } from './particle.mjs'

test("x coordinate should be first constructor arg", () => {
    let testPart = new Particle(0, 5, {})

    expect(testPart.x).toBe(0);
    expect(testPart.y).toBe(5);
});

test('Properties.clone is abstract', ()=>{
    let prop = new Properties()

    expect(()=>{
        prop.clone()
    }).toThrow()
})
