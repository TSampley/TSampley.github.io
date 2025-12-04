
import { InterparticleForce } from "./force.mjs"

/**
 * 
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
        const deltaX = beta.x - alpha.x
        const deltaY = beta.y - alpha.y
        // TODO: explore soft-core potentials
        //   https://pmc.ncbi.nlm.nih.gov/articles/PMC3187911/;
        //   https://www.sciencedirect.com/science/article/abs/pii/S1093326303001967 
        const deltaSqr = deltaX*deltaX + deltaY*deltaY;
        const deltaMag = Math.sqrt(deltaSqr)

        // Coulomb Force/Potential
        const alphaCharge = alpha.props.charge
        const betaCharge = beta.props.charge
        if (alphaCharge != 0 && betaCharge != 0) {
            const force = -this.value*alphaCharge*betaCharge/deltaSqr
            console.log(`coulomb force: ${force}`)
            const forceX = force * deltaX / deltaMag
            const forceY = force * deltaY / deltaMag

            alpha.fx += forceX
            alpha.fy += forceY
            beta.fx -= forceX
            beta.fy -= forceY
        }
    }
}
