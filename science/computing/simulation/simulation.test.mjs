
import { Size } from "/js/common/geom.mjs"
import { Environment } from "./environment.mjs"
import { Simulation } from "./simulation.mjs"

describe('simulation', () => {
  describe('constructor',()=> {
    const environment = new Environment(new Size(100, 100))
    const simulation = new Simulation(environment)

    test('timer is initialized', () => {
      expect(simulation.timer).toBeDefined()
    })

    test('entity list is initialized', () => {
      expect(simulation.entityList).toBeDefined()
      expect(Array.isArray(simulation.entityList)).toBe(true)
    })

    test('environment is initialized', () => {
      expect(simulation.environment).toBeDefined()
    })

    test('onDraw is initialized', () => {
      expect(simulation.onDraw).toBeDefined()
    })

    test('scenarios is initialized', () => {
      expect(simulation.scenarios).toBeDefined()
      expect(Array.isArray(simulation.scenarios)).toBe(true)
    })
  })
})

