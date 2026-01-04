


window.onload = async () => {
  processSitemapQueue();
}

class Point {
  constructor(x=0,y=0){this.x=x;this.y=y;}
}

class Entity {
  constructor(position=new Point(),velocity=new Point()) {
    this.position = position
    this.velocity = velocity
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
    this.nodeRadius = 10

    /**
     * Minimum distance between nodes for calculations.
     * @type {number}
     */
    this.minDistance = 1
    // We will allow different methods of determining length beteween nodes later
    this.springDistance = 50 // Node spring ideal distance
    /**
     * Spring force between nodes. $`F=k*d`$
     * @type {number}
     */
    this.springConstant = 0
    /**
     * Repel force between nodes. $`F=k/d^2`$
     * @type {number}
     */
    this.repelForce = 1E3
    /**
     * Center force on all nodes. $`F=k*d^2`$
     * @type {number}
     */
    this.centerForceConstant = 1E-3
    this.centerForceMax = 5
    this.boundaryMargin = this.nodeRadius

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
    const maxForce = this.minDistance * this.springConstant
    const width = this.canvas.width
    const height = this.canvas.height
    const maxX = width - this.boundaryMargin
    const maxY = height - this.boundaryMargin
    const center = {x: width / 2, y: height / 2}
    for (let index = 0; index < limit; index++) {
      const alpha = this.nodes[index]
      const alphaPos = alpha.position
      if (forces[index] === undefined) {
        forces[index] = {fx:0,fy:0}
      }
      const alphaForce = forces[index]
      for (let otherIndex = index + 1; otherIndex < limit; otherIndex++) {
        const beta = this.nodes[otherIndex]
        const betaPos = beta.position
        if (forces[otherIndex] === undefined) {
          forces[otherIndex] = {fx:0,fy:0}
        }
        const betaForce = forces[otherIndex]
        // ==Calculate forces between alpha and beta nodes here==

        // Calculate vector between particles for relative forces
        const dx = betaPos.x - alphaPos.x
        const dy = betaPos.y - alphaPos.y
        const distanceSq = dx * dx + dy * dy
        const distance = Math.sqrt(distanceSq)

        // Calculate universal repelling force and spring force
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
          const springDisplacement = this.springDistance - distance
          const springForce = springDisplacement * this.springConstant
          const repelForce = this.repelForce / distanceSq
          const total = springForce + repelForce
          const fx = (dx / distance) * total
          const fy = (dy / distance) * total
          // Attract alpha towards beta
          alphaForce.fx += fx
          alphaForce.fy += fy
          // Attract beta towards alpha
          betaForce.fx -= fx
          betaForce.fy -= fy
        }
      }
      // Calculate independent forces
      const centerDx = center.x - alphaPos.x
      const centerDy = center.y - alphaPos.y
      const centerDistSqr = centerDx * centerDx + centerDy * centerDy
      const centerDist = Math.sqrt(centerDistSqr)

      if (centerDist != 0) {
        // Attract all towards center (0,0) to keep graph together
        const centerForce = Math.min(this.centerForceConstant * centerDistSqr, this.centerForceMax)
        const centerForceX = centerForce * centerDx / centerDist
        const centerForceY = centerForce * centerDy / centerDist

        alphaForce.fx += centerForceX
        alphaForce.fy += centerForceY
      }

      // Update node positions or other properties here; after all forces calculated
      alpha.velocity.x += alphaForce.fx * dt
      alpha.velocity.y += alphaForce.fy * dt
      alphaPos.x += alpha.velocity.x * dt
      alphaPos.y += alpha.velocity.y * dt

      // Keep Nodes in bounds
      if (alphaPos.x < this.boundaryMargin) {
        alphaPos.x = this.boundaryMargin
        alpha.velocity.x = 0
      } else if (alphaPos.x > maxX) {
        alphaPos.x = maxX
        alpha.velocity.x = 0
      }
      if (alphaPos.y < this.boundaryMargin) {
        alphaPos.y = this.boundaryMargin
        alpha.velocity.y = 0
      } else if (alphaPos.y > maxY) {
        alphaPos.y = maxY
        alpha.velocity.y = 0
      }

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
    ctx.arc(pos.x, pos.y, sitemap.nodeRadius, 0, 2 * Math.PI)
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

    // draw velocity vector for debugging
    if (node.velocity) {
      ctx.strokeStyle = '#00ff00'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(pos.x, pos.y)
      ctx.lineTo(pos.x + node.velocity.x, pos.y + node.velocity.y)
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