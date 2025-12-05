
import { InterparticleForce } from "../../physics/mechanics/force.mjs"

import { METERS_PER_PICOMETER } from "../../metrics.mjs"


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
        const deltaX = (beta.x - alpha.x) / METERS_PER_PICOMETER
        const deltaY = (beta.y - alpha.y) / METERS_PER_PICOMETER
        // TODO: explore soft-core potentials
        //   https://pmc.ncbi.nlm.nih.gov/articles/PMC3187911/;
        //   https://www.sciencedirect.com/science/article/abs/pii/S1093326303001967 
        const deltaSqr = Math.max(deltaX*deltaX + deltaY*deltaY, 100) // minimum distance 100pm
        const deltaMag = Math.sqrt(deltaSqr)

        // Lennard-Jones Potential
        // epsilon: depth of potential well
        const epsilon = 1 // eV
        // sigma: finite distance where potential is zero, i.e., atoms "collide"
        const sigma = (alpha.props.atomicRadius + beta.props.atomicRadius) // PM
        const sigmaOverDistance = sigma / deltaMag
        const attraction = -(sigmaOverDistance ** 6)
        const repulsion = sigmaOverDistance ** 12
        const total = 4*epsilon*(repulsion + attraction)
        console.log(`lennard jones: ${total}`)
        const forceX = total * deltaX / deltaMag
        const forceY = total * deltaY / deltaMag

        alpha.fx += forceX
        alpha.fy += forceY
        beta.fx -= forceX
        beta.fy -= forceY
    }
}
