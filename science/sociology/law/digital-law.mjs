import { Simulation } from "/science/computing/simulation/simulation.mjs";

/**
 * Facade 
 */
export class DigitalLawDemo {
  /**
   * 
   * @param {DigitalLawPresenter} presenter 
   */
  constructor(presenter) {
    this.presenter = presenter
  }

  async start() {
    this.presenter.model.startSimulation()
  }
}

export function digitalLawDemo(demoContainerId) {
  const ui = new DigitalLawUi(demoContainerId)
  const model = demoModel()
  const presenter = new DigitalLawPresenter(model, ui)
  return new DigitalLawDemo(presenter)
}

// MARK: Model

class DigitalLawSimulation extends Simulation {

}

class DigitalLawModel {

  /**
   * 
   */
  constructor(simulation) {
    this.simulation = simulation
  }

  startSimulation() {

  }
  stopSimulation() {

  }
}
function demoModel() {
  const sim = new DigitalLawSimulation()
  const model = new DigitalLawModel(
    sim
  )
  return model
}

// MARK: Ui

class DigitalLawUi {
  /**
   * @param {string} demoContainerId HTML id of the div containing demo content.
   */
  constructor(demoContainerId) {
    this.demoContainer = document.getElementById(demoContainerId)
    this.start = document.getElementById('start')
    this.stop = document.getElementById('stop')
  }

  /**
   * Add event listeners to UI components and invoke given {intents}.
   * 
   * @param {DigitalLawIntent} intents 
   */
  bindEventsAndIntents(intents) {
    this.start.onclick = ()=>{
      intents.start()
    }
    this.stop.onClick = ()=>{
      intents.stop()
    }
  }
}
/**
 * Callback object to convey intents to the model.
 */
class DigitalLawIntent {
  start() {}
  stop() {}
}

// MARK: Presenter

class DigitalLawPresenter {
  /**
   * 
   * @param {DigitalLawModel} model 
   * @param {DigitalLawUi} ui 
   */
  constructor(model,ui) {
    this.model = model
    this.ui = ui
  }

  bindViewAndModel() {
    this.ui.bindEventsAndIntents(new class extends DigitalLawIntent {
      start() {
        this.model.startSimulation()
      }
      stop() {
        this.model.stopSimulation()
      }
    })
    this.model.addEventListener('state', (event) => {
      const detail = event.detail
      // TODO: update UI
      console.info("State Updated: ", detail)
    })
  }
}
