
import { Particle } from '/science/physics/mechanics/particle.mjs';
import { Simulation } from './simulation.mjs';
import { Timer } from '/js/common/timer.mjs';
import { WorldController } from './world-controller.mjs';
import { Environment } from './environment.mjs';
import { Size } from '/js/common/geom.mjs';

test('WorldController.addParticle should add the given particle', ()=>{
    const environment = new Environment(new Size(100, 100))
    const simulation = new Simulation(environment)
    const timer = new Timer()
    const controller = new WorldController(simulation, timer)

    expect(simulation.entityList.length).toBe(0)

    controller.addParticle(new Particle(0, 0, {}))
    expect(simulation.entityList.length).toBe(1)
})
