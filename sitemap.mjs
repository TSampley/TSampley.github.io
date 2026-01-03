


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
    this.minDistance = 1
    // We will allow different methods of determining length beteween nodes later
    this.idealDistance = 50 // Node spring ideal distance
    this.repelStrength = 1E-1
    this.centerForce = 1E-1

    this.canvas = document.getElementById(this.hostId)
    if(!this.canvas) {
      throw `Sitemap: No canvas found with id:${this.hostId}`
    }
    /** @type {CanvasRenderingContext2D} */
    this.context = this.canvas.getContext('2d')

    this.canvas.onclick = (event) => {
      console.log(`Sitemap canvas clicked at (${event.offsetX},${event.offsetY})`)
      // TODO: move running control to button
      this.isRunning = !this.isRunning
      if (this.isRunning) {
        this.#lastTsl = 0 // avoid accumulating paused time
        requestAnimationFrame((tsl) => this.animate(tsl))
      }
      // TODO: setup click to select nodes for editing
    }
    // TODO: setup click and drag to move nodes
    this.canvas.onmousedown = (event) => {
      console.log(`Sitemap canvas mouse down at (${event.offsetX},${event.offsetY})`)
    }
    this.canvas.onmouseup = (event) => {
      console.log(`Sitemap canvas mouse up at (${event.offsetX},${event.offsetY})`)
    }
    this.canvas.onmousemove = (event) => {
      console.log(`Sitemap canvas mouse move at (${event.offsetX},${event.offsetY})`)
    }
  }

  /**
   * 
   * @param {number} dt Delta Time
   */
  step(dt) {
    const limit = this.nodes.length
    const forces = []
    const maxForce = this.minDistance * this.repelStrength
    const width = this.canvas.width
    const height = this.canvas.height
    const center = {x: width / 2, y: height / 2}
    for (let index = 0; index < limit; index++) {
      const alpha = this.nodes[index]
      const alphaPos = alpha.position
      const alphaForce = (forces[index] = forces[index] || {fx:0,fy:0})
      for (let otherIndex = index + 1; otherIndex < limit; otherIndex++) {
        const beta = this.nodes[otherIndex]
        const betaPos = beta.position
        const betaForce = (forces[index] = forces[otherIndex] || {fx:0,fy:0})
        // Calculate forces between alpha and beta nodes here

        // Calculate vector between particles for relative forces
        const dx = betaPos.x - alphaPos.x
        const dy = betaPos.y - alphaPos.y
        const distanceSq = dx * dx + dy * dy
        const distance = Math.sqrt(distanceSq)
        if (distance == 0) { // soft-core to avoid singularity
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
          const forceDistance = Math.max(this.idealDistance - distance, this.minDistance)
          const forceMagnitude = forceDistance * this.repelStrength
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
      // Keep Nodes in bounds
      const boundaryMargin = 50
      const boundaryForce = 1E-1
      if (alphaPos.x < boundaryMargin) {
        alphaForce.fx += (boundaryMargin - alphaPos.x) * boundaryForce
      } else if (alphaPos.x > width - boundaryMargin) {
        alphaForce.fx -= (alphaPos.x - (width - boundaryMargin)) * boundaryForce
      }
      if (alphaPos.y < boundaryMargin) {
        alphaForce.fy += (boundaryMargin - alphaPos.y) * boundaryForce
      } else if (alphaPos.y > height - boundaryMargin) {
        alphaForce.fy -= (alphaPos.y - (height - boundaryMargin)) * boundaryForce
      }

      // Attract all towards center (0,0) to keep graph together
      const centerDx = center.x - alphaPos.x
      const centerDy = center.y - alphaPos.y
      const centerOffsetSqr = Math.max(centerDx * centerDx + centerDy * centerDy, this.minDistance)
      const centerOffset = Math.sqrt(centerOffsetSqr)
      const centerForce = this.centerForce / centerOffsetSqr
      const centerForceX = centerForce * -alphaPos.x / centerOffset
      const centerForceY = centerForce * -alphaPos.y / centerOffset
      alphaForce.fx += centerForceX
      alphaForce.fy += centerForceY

      // Update node positions or other properties here; after all forces calculated
      alphaPos.x += alphaForce.fx * dt
      alphaPos.y += alphaForce.fy * dt

      alpha.force = alphaForce
    }
  }

  #lastTsl = 0
  /** @param {number} tsl Time Since Load */
  animate(tsl) {
    if (this.#lastTsl === 0) {
      this.#lastTsl = tsl
      console.log("Time reset")
    }

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

  // draw nodes
  for(const node of sitemap.nodes) {
    const pos = node.position
    // draw node circle
    ctx.fillStyle = '#0077cc'
    ctx.beginPath()
    ctx.arc(pos.x, pos.y, 10, 0, 2 * Math.PI)
    ctx.fill()
    // draw node text
    ctx.fillStyle = '#000000'
    ctx.font = '12px Arial'
    ctx.fillText(node.title, pos.x + 15, pos.y + 5)

    // draw force vector for debugging
    if (node.force) {
      ctx.strokeStyle = '#ff0000'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(pos.x, pos.y)
      ctx.lineTo(pos.x + node.force.fx, pos.y + node.force.fy)
      ctx.stroke()
    }
  }
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
sitemap_list.forEach((sitemap) => {
  const nodeEntities = sitemap_data.branches.map((branch) => {
    // TODO: branch.path split / into hierarchy levels
    // 
    return new PageNodeEntity(
      branch.path,
      branch.title,
      branch.url,
      {x: Math.random() * sitemap.canvas.width, y: Math.random() * sitemap.canvas.height}
    )
  });
  sitemap.nodes = nodeEntities
});

// TODO: process data and node dependencies based on hierarchies
// TODO: 