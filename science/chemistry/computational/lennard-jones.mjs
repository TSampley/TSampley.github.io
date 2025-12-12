
import { InterparticleForce } from "../../physics/mechanics/force.mjs"


const SOFT_CAP_SQR = 120E-12 ** 2
const JOULES_PER_EV = 1.602176634E-19
const MOLE = 6.022E23 // particles/mol
const MOLES_PER_PARTICLE = 1 / MOLE // mol/particle

/**
 * 
 * 
 * https://en.wikipedia.org/wiki/Lennard-Jones_potential
 */
export class LennardJonesPotential extends InterparticleForce {
    constructor(value) {
        super(value)
    }

    get id() {
        return "lennardJones"
    }

    get name() {
        return "Lennard-Jones"
    }

    applyForce(dt,alpha,beta) {
        // Calculate vector between particles for relative forces
        const deltaX = beta.x - alpha.x
        const deltaY = beta.y - alpha.y
        // TODO: explore soft-core potentials
        //   https://pmc.ncbi.nlm.nih.gov/articles/PMC3187911/;
        //   https://www.sciencedirect.com/science/article/abs/pii/S1093326303001967 
        const sigma = (alpha.props.atomicRadius + beta.props.atomicRadius) // PM
        const deltaSqr = Math.max(deltaX*deltaX + deltaY*deltaY, sigma*sigma)
        const deltaMag = Math.sqrt(deltaSqr)

        // Lennard-Jones Potential
        // epsilon: depth of potential well // TODO: determine depth of well
        const epsilon = -500 // J / mol
        const energyPerParticle = epsilon // * MOLES_PER_PARTICLE
        // sigma: finite distance where potential is zero, i.e., atoms "collide"
        const sigmaOverDistance = sigma / deltaMag
        console.log(`${sigma} / ${deltaMag} = ${sigmaOverDistance}`)
        const s6 = sigmaOverDistance**6
        const s12 = s6*s6
        const total = 24 * energyPerParticle / deltaMag * (2*s12 - s6)
        console.log(`lennard jones: ${total}`)
        const forceX = total * deltaX / deltaMag
        const forceY = total * deltaY / deltaMag

        // TODO: convert eV to newtons or fxy always means eV for atoms?
        alpha.fx += forceX
        alpha.fy += forceY
        beta.fx -= forceX
        beta.fy -= forceY
    }
}
