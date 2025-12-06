
import { METERS_PER_PICOMETER } from "../../metrics.mjs"
import { InterparticleForce } from "./force.mjs"

const ELECTRONS_PER_COULOMB = 6.241509E18

/**
 * 
 * $`F_c = \frac{1}{4*\pi*\epsilon_0} * c_a * c_b / d^2`$
 * 
 * https://en.wikipedia.org/wiki/Coulomb
 */
export class CoulombForce extends InterparticleForce {
    /**
     * 
     * @param {number} value $`N * m^2 * C^-2`$
     */
    constructor(value) {
        super(value)
    }

    get id() {
        return "charge"
    }

    get name() {
        return "Coulomb"
    }

    applyForce(dt,alpha,beta) {
        // Calculate vector between particles for relative forces
        const deltaX = (beta.x - alpha.x) / METERS_PER_PICOMETER
        const deltaY = (beta.y - alpha.y) / METERS_PER_PICOMETER
        // TODO: explore soft-core potentials
        //   https://pmc.ncbi.nlm.nih.gov/articles/PMC3187911/;
        //   https://www.sciencedirect.com/science/article/abs/pii/S1093326303001967 
        const deltaSqr = deltaX*deltaX + deltaY*deltaY;
        const deltaMag = Math.sqrt(deltaSqr)

        // Coulomb Force/Potential
        const alphaCharge = alpha.props.charge / ELECTRONS_PER_COULOMB
        const betaCharge = beta.props.charge / ELECTRONS_PER_COULOMB
        if (alphaCharge != 0 && betaCharge != 0 && deltaSqr != 0) {
            const rawForce = -this.value*alphaCharge*betaCharge/deltaSqr
            console.log(`coulomb force: ${rawForce}`)
            const force = Math.min(rawForce, 2)
            const forceX = force * deltaX / deltaMag
            const forceY = force * deltaY / deltaMag

            alpha.fx += forceX
            alpha.fy += forceY
            beta.fx -= forceX
            beta.fy -= forceY
        }
    }
}
