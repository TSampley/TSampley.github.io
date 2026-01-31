


/**
 * Food Planner Application
 */
export class FoodPlannerApp {
  constructor(canvasId,debugId) {
    this.canvas = document.getElementById(canvasId);
    this.context = this.canvas.getContext('2d');

    this.debugElement = document.getElementById(debugId);
    this.debugText = document.createTextNode('');
    this.debugElement.appendChild(this.debugText);
  }

  setDebug(text) {
    this.debugText.nodeValue = text;
  }

  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  start() {

  }
}


const app = new FoodPlannerApp('app-canvas','p-debug')
window.app = app
app.start()
