


window.onload = async () => {
  processSitemapQueue();
}

class Entity {
  constructor(position={x:0,y:0}) {
    this.position = position
  }
}

class PageNodeEntity extends Entity {
  constructor(path,title,url,position) {
    super()
    this.path = path
    this.title = title
    this.url = url
    this.position = position
  }
}

class Sitemap {
  constructor(hostId,root) {
    this.hostId = hostId
    this.root = root

    this.isRunning = false
    /**
     * @type {Array<PageNodeEntity>}
     */
    this.nodes = []

    /**
     * Minimum distance between nodes for calculations.
     * @type {number}
     */
    this.minDistance = 20
    // We will allow different methods of determining length beteween nodes later
    this.idealDistance = 200 // All nodes repel each other to this distance
    this.repelStrength = 0.1
    // Repulsion strength; TODO: experiment with other force functions

    this.canvas = document.getElementById(this.hostId)
    if(!this.canvas) {
      throw `Sitemap: No canvas found with id:${this.hostId}`
    }
    this.context = this.canvas.getContext('2d')

    this.canvas.onclick = (event) => {
      console.log(`Sitemap canvas clicked at (${event.offsetX},${event.offsetY})`)
      // TODO: move running control to button
      this.isRunning = !this.isRunning
      if (this.isRunning) {
        requestAnimationFrame((tsl) => this.animate(tsl))
      }
      // TODO: setup click to select nodes for editing
    }
    // TODO: setup click and drag to move nodes

  }

  /**
   * 
   * @param {number} dt Delta Time
   */
  step(dt) {
    const limit = this.nodes.length
    const forces = []
    for (let index = 0; index < limit; index++) {
      const alpha = this.nodes[index]
      const alphaPos = alpha.position
      const alphaForce = forces[index] || {fx:0,fy:0}
      for (let otherIndex = index + 1; otherIndex < limit; otherIndex++) {
        const beta = this.nodes[otherIndex]
        const betaPos = beta.position
        const betaForce = forces[otherIndex] || {fx:0,fy:0}
        // Calculate forces between alpha and beta nodes here

        // Calculate vector between particles for relative forces
        const dx = betaPos.x - alphaPos.x
        const dy = betaPos.y - alphaPos.y
        const distanceSq = dx * dx + dy * dy
        const distance = Math.sqrt(distanceSq)

        const maxForce = this.minDistance * this.repelStrength
        if (distance < this.minDistance) { // soft-core to avoid singularity
          // displace randomly to avoid zero-distance
          const angle = Math.random() * 2 * Math.PI
          const fx = Math.cos(angle) * maxForce
          const fy = Math.sin(angle) * maxForce
          // Repel alpha from beta
          alphaForce.fx -= fx
          alphaForce.fy -= fy
          // Repel beta from alpha
          betaForce.fx += fx
          betaForce.fy += fy
        } else {
          // Calculate force towards ideal distance
          const forceMagnitude = (this.idealDistance - distance) * this.repelStrength
          const fx = (dx / distance) * forceMagnitude
          const fy = (dy / distance) * forceMagnitude
          // Attract alpha towards beta
          alphaForce.fx += fx
          alphaForce.fy += fy
          // Attract beta towards alpha
          betaForce.fx -= fx
          betaForce.fy -= fy
        }
      }
      // Attract all towards center (0,0) to keep graph together
      // TODO: implement center of mass calculation

      // Update node positions or other properties here; after all forces calculated
      alphaPos.x += alphaForce.fx * dt
      alphaPos.y += alphaForce.fy * dt
    }
  }

  #lastTsl = 0
  /** @param {number} tsl Time Since Load */
  animate(tsl) {
    console.log(`Sitemap animate tsl:${tsl} from ${this}`)
    const dt = (tsl - this.#lastTsl) / 1000.0
    this.#lastTsl = tsl

    this.step(dt)
    drawSitemap(this)

    // Loop
    if(this.isRunning) {
      requestAnimationFrame((newTsl) => this.animate(newTsl))
    }
  }
}

/**
 * @type {Array<Sitemap>}
 */
const sitemap_list = []

/**
 * 
 * @param {Sitemap} sitemap 
 */
function drawSitemap(sitemap) {
  const ctx = sitemap.context
  const width = sitemap.canvas.width
  const height = sitemap.canvas.height
  
  // clear canvas
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0,0,width,height)

  // draw border
  ctx.strokeStyle = '#000000'
  ctx.lineWidth = 2
  ctx.strokeRect(0,0,width,height)

  // draw text
  ctx.fillStyle = '#000000'
  ctx.font = '16px Arial'
  ctx.fillText(`Sitemap for: ${sitemap.root}`,10,30)
  ctx.fillText(`Running: ${sitemap.isRunning}`,10,60)
}

function drawAllSitemaps() {
  for(const sitemap of sitemap_list) {
    drawSitemap(sitemap)
  }
}

function processSitemapQueue() {
  const sitemap_queue = window.sitemap_queue || []
  console.log(`Processing canvases, count:${sitemap_queue.length}`)
  for(const canvas_id of sitemap_queue) {
    console.log(`Processing canvas id:${canvas_id}`)
    try {
      const newSitemap = new Sitemap(canvas_id,'/')

      // initialize sitemap
      drawSitemap(newSitemap)
      sitemap_list.push(newSitemap)
    } catch (err) {
      console.error(`Error processing canvas id:${canvas_id}`,err)
    }
  }
  sitemap_queue.length = 0
}

console.log('Sitemap data load initiated');
const sitemap_data_promise = async function() {
  try {
    const response = await fetch('/assets/branches.json')
    if (!response.ok) {
      throw `HTTP error! status: ${response.status}`
    }
    const data = await response.json()
    return data
  } catch (err) {
    console.error('Sitemap: Error fetching branches.json',err)
    return []
  }
};
const sitemap_data = await sitemap_data_promise();

console.log('Sitemap data loaded:' + sitemap_data.branches.length + ' branches');