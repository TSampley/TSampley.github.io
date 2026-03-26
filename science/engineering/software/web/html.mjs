import { Demo } from "js/components/demo.mjs";


const inputs = document.getElementsByTagName('input')

export class HtmlUi {
  constructor() {
    this.inputButton = document.getElementsByTagName('input-button')
    this.inputCheckbox = document.getElementsByTagName('input-checkbox')
  }
}

export default class HtmlPresenter {
  /**
   * 
   * @param {HtmlUi} ui 
   */
  constructor(ui,model) {
    this.ui = ui || new HtmlUi()

    this.model = model || new HtmlModel()
  }

  init() {
    
  }

}

export class HtmlModel {

}
