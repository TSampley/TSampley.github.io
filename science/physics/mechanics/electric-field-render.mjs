import { Render3D } from "science/computing/simulation/render.mjs";

/**
 * @typedef { import('./particle.mjs').Particle } Particle
 */
/**
 * Renders a field of electric charges with a test charge
 * to determine strength and direction of the field at all
 * points.
 * @extends {Render3D<Particle[]>}
 */
export class ElectricFieldRender extends Render3D {

  /**
   * 
   * @param {WebGL2RenderingContext} context 
   * @param {Particle[]} subject 
   * @param {number} offset 
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render(context, subject, offset) {
    // TODO: render field
  }
}
