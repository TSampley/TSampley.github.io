
import { Particle } from '../../physics/mechanics/particle.mjs';
import { Simulation } from './simulation.mjs';
import { Timer } from '../../../js/common/timer.mjs';
import { WorldController } from './world-controller.mjs';

test('WorldController.addParticle should add the given particle', ()=>{
    const simulation = new Simulation()
    const timer = new Timer()
    const controller = new WorldController(simulation, timer)

    expect(simulation.particleList.length).toBe(0)

    controller.addParticle(new Particle(0, 0, {}))
    expect(simulation.particleList.length).toBe(1)
})
