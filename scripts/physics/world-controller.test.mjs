
import { Particle } from './particle.mjs';
import { Simulation } from './simulation.mjs';
import { World } from './world.mjs';
import { WorldController } from './world-controller.mjs';

test('WorldController.addParticle should add the given particle', ()=>{
    const simulation = new Simulation()
    const world = new World()
    const controller = new WorldController(simulation, world)

    expect(simulation.particleList.length).toBe(0)

    controller.addParticle(new Particle(0, 0, {}))
    expect(simulation.particleList.length).toBe(1)
})
