
import { InterparticleForce } from "../../physics/mechanics/force.mjs"


const SOFT_CAP_SQR = 100E-12 ** 2
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
        const deltaSqr = Math.max(deltaX*deltaX + deltaY*deltaY, SOFT_CAP_SQR)
        const deltaMag = Math.sqrt(deltaSqr)

        // Lennard-Jones Potential
        // epsilon: depth of potential well // TODO: determine depth of well
        const epsilon = 1E-12 // eV
        // sigma: finite distance where potential is zero, i.e., atoms "collide"
        const sigma = (alpha.props.atomicRadius + beta.props.atomicRadius) // PM
        const sigmaOverDistance = sigma / deltaMag
        console.log(`${sigma} / ${deltaMag} = ${sigmaOverDistance}`)
        const s6 = sigmaOverDistance**6
        const s12 = s6*s6
        const total = 24 * epsilon / deltaMag * (2*s12 - s6)
        console.log(`lennard jones: ${total}`)
        const forceX = - total * deltaX / deltaMag
        const forceY = - total * deltaY / deltaMag

        // TODO: convert eV to newtons or fxy always means eV for atoms?
        alpha.fx += forceX
        alpha.fy += forceY
        beta.fx -= forceX
        beta.fy -= forceY
    }
}
