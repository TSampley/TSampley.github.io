import { Size } from "/js/common/geom.mjs";
import { scenarioFun, Scenario } from "./scenario.mjs";
import { ChemEnvironment } from "/science/chemistry/computational/chem-environment.mjs";
import { forceMatrixChemistry, forceMatrixSim } from "/science/chemistry/computational/force-matrix.mjs";


test('scenario', async ()=> {
  const scenario = scenarioFun("name","description",/** @type {(chemEnviro:ChemEnvironment)=>void} enviro */ (chemEnviro)=> {
    // chemEnviro.forceMatrix.value = forceMatrixSim(0, 0, 0, 0, 0)
    chemEnviro.hardCollisions = false
  });
  expect(scenario.name).toBe("name")
  expect(scenario.description).toBe("description")

  const matrix = forceMatrixChemistry()
  const size = new Size(800, 400)
  const enviro = new ChemEnvironment(size, matrix)
  expect(enviro.forceMatrix.value).toBe(matrix)
  expect(enviro.size.value).toBe(size)
  expect(enviro.hardCollisions).toBe(true)
  expect(enviro.height).toBe(400)
  expect(enviro.width).toBe(800)

  scenario.init(enviro)

  expect(enviro.forceMatrix.value).toBe(forceMatrixSim(0, 0, 0, 0, 0))
  expect(enviro.hardCollisions).toBe(false)
})
