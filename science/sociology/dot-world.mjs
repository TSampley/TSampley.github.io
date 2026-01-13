import { BaseEnvironment } from "../computing/simulation/environment.mjs";

/**
 * A world full of dots, interacting in social (or ecological) simulations.
 */
export class DotWorld extends Environment {

  /**
   * @param {number} width
   * @param {number} height
   */
  constructor(width,height) {
    super(width,height)

  }

  step(delta) {
    // determine day/night cycle

    // determine weather conditions

    // determine energy contributed to environment

    // 
  }

  draw(context,offset) {
    // clear area

  }
}
// TODO: create aggression page for simulation demo
    /*
    draw entities in z-order
    - food
    - plants
    - animals
      - bunny dot 
      - wolf dot
    */
