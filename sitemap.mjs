


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

/**
 * Responsible for capturing all UI widgets to add
 * event listeners and bind model updates.
 */
class SitemapPresenter {
  /**
   * 
   * @param {Sitemap} sitemap Business model
   */
  constructor(
    sitemap,
    canvasId='canvas',
    spanSelectedNodeId='display-selected-node',
    buttonTimeControlId='button-time-control',
    rangeRepulsionForceId='range-repulsion-force',
    rangeSpringForceId='range-spring-force',
    rangeSpringLengthId='range-spring-length',
    rangeCenterForceId='range-center-force',
    rangeDragRestitutionId='range-drag-restitution',
    checkboxDebugId='checkbox-debug'
  ) {
    this.sitemap = sitemap
    this.canvas = document.getElementById(canvasId)
    this.displaySelectedNode = document.getElementById(spanSelectedNodeId)
    this.buttonTimeControl = document.getElementById(buttonTimeControlId)
    this.rangeRepulsionForce = document.getElementById(rangeRepulsionForceId)
    this.rangeCenterForce = document.getElementById(rangeCenterForceId)
    this.rangeSpringForce = document.getElementById(rangeSpringForceId)
    this.rangeSpringLength = document.getElementById(rangeSpringLengthId)
    this.rangeDragRestitution = document.getElementById(rangeDragRestitutionId)
    this.checkboxDebug = document.getElementById(checkboxDebugId)

    this.rangeRepulsionForce.oninput = (event) => {
      sitemap.repelForce = event.target.value
    }
    this.rangeCenterForce.oninput = (event) => {
      sitemap.centerForceConstant = event.target.value
    }
    this.rangeSpringForce.oninput = (event) => {
      sitemap.springConstant = event.target.value
    }
    this.rangeSpringLength.oninput = (event) => {
      sitemap.springDistance = event.target.value
    }
    this.rangeDragRestitution.oninput = (event) => {
      sitemap.dragRestitution = 1 - event.target.value
    }
    this.checkboxDebug.onchange = (event) => {
      sitemap.debug = event.target.checked == true
    }
  }
}

class Sitemap {
  /**
   * 
   * @param {string} hostId 
   * @param {string} root 
   */
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
    this.springConstant = 0 //1E-5
    /**
     * Repel force between nodes. $`F=k/d^2`$
     * @type {number}
     */
    this.repelForce = 1E5
    /**
     * Center force on all nodes. $`F=k*d^2`$
     * @type {number}
     */
    this.centerForceConstant = 1E-1
    this.centerForceMax = 500
    this.dragRestitution = 0.99
    this.boundaryMargin = this.nodeRadius
    this.debug = false

    this.canvas = document.getElementById(this.hostId)
    if(!this.canvas) {
      throw `Sitemap: No canvas found with id:${this.hostId}`
    }
    /** @type {CanvasRenderingContext2D} */
    this.context = this.canvas.getContext('2d')

    this.nodeDisplay = document.getElementById('display-node')

    this.selectedNode = null
    this.canvas.onclick = (event) => {
      this.onSelectNode(event.offsetX, event.offsetY)
    }

    this.hoverPoint = null
    this.canvas.onmousedown = (event) => {
      console.log(`Sitemap canvas mouse down at (${event.offsetX},${event.offsetY})`)
    }
    this.canvas.onmouseup = (event) => {
      console.log(`Sitemap canvas mouse up at (${event.offsetX},${event.offsetY})`)
    }
    this.canvas.onmousemove = (event) => {
      if (!this.hoverPoint) this.hoverPoint = new Point();
      this.hoverPoint.x = event.offsetX
      this.hoverPoint.y = event.offsetY
    }
    this.canvas.onmouseleave = (event) => {
      this.hoverPoint = null
    }

    const timeControlButton = document.getElementById('button-time-control')
    timeControlButton.onclick = (event) => {
      this.isRunning = !this.isRunning
      if (this.isRunning) {
        timeControlButton.innerHTML = "Stop"
        this.#lastTsl = 0 // avoid accumulating paused time
        requestAnimationFrame((tsl) => this.animate(tsl))
      } else {
        timeControlButton.innerHTML = "Start"
      }
    }
  }

  onSelectNode(x,y) {
    const selectionDistance = 50
    const minDistSqr = selectionDistance**2
    let closest = null
    let closestDistance = null
    for (const node of this.nodes) {
      const dx = x - node.position.x
      const dy = y - node.position.y
      const distanceSqr = dx*dx + dy*dy
      if (distanceSqr <= minDistSqr) {
        const distance = Math.sqrt(distanceSqr)
        if (!closestDistance || distance < closestDistance) {
          closest = node
          closestDistance = distance
        }
      }
    }
    this.selectedNode = closest
    if (closest) {
      this.nodeDisplay.innerHTML = closest.title
    } else {
      this.nodeDisplay.innerHTML = ""
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
        if (distance == 0) {
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
          // Calculate spring force
          const springDisplacement = this.springDistance - distance
           // soft-core to avoid singularity
          const springForce = Math.max(
            -maxForce,
            Math.min(maxForce, 
              -springDisplacement * this.springConstant
            )
          )
          // Calculate repulsion force
          const repelForce = - this.repelForce / distanceSq
          // Sum all forces
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

      // Calculate drag
      alpha.velocity.x *= this.dragRestitution
      alpha.velocity.y *= this.dragRestitution

      // Keep Nodes in bounds
      if (alphaPos.x < this.boundaryMargin) {
        if (alpha.velocity.x < 0) alphaPos.x += width
        // alpha.velocity.x = 0
      } else if (alphaPos.x > maxX) {
        if (alpha.velocity.x > 0) alphaPos.x -= width
        // alpha.velocity.x = 0
      }
      if (alphaPos.y < this.boundaryMargin) {
        if (alpha.velocity.y < 0) alphaPos.y += height;
        // alpha.velocity.y = 0
      } else if (alphaPos.y > maxY) {
        if (alpha.velocity.y > 0) alphaPos.y -= height
        // alpha.velocity.y = 0
      }

      alpha.force = alphaForce
    }
  }

  #lastTsl = 0
  /** @param {number} tsl Time Since Load */
  animate(tsl) {
    if (this.#lastTsl === 0) {
      this.#lastTsl = tsl
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

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

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

  // draw nodes
  for(const node of sitemap.nodes) {
    const pos = node.position
    // draw node circle
    ctx.fillStyle = '#0077cc'
    ctx.beginPath()
    ctx.arc(pos.x, pos.y, sitemap.nodeRadius, 0, 2 * Math.PI)
    ctx.fill()

    // draw node text
    if (sitemap.hoverPoint) {
      const offsetX = sitemap.hoverPoint.x - pos.x
      const offsetY = sitemap.hoverPoint.y - pos.y
      const radius = 100.0
      const opacity = 1 - Math.min(1.0, Math.max(Math.abs(offsetX), Math.abs(offsetY))/radius)
      if (opacity > 0.1) {
        ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`
        ctx.font = '12px Arial'
        ctx.fillText(node.title, pos.x + 15, pos.y + 5)
      }
    }

    if (sitemap.debug) {
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
      const presenter = new SitemapPresenter(newSitemap)

      // initialize sitemap
      drawSitemap(newSitemap)
      sitemap_list.push(newSitemap)
    } catch (err) {
      console.error(`Error processing canvas id:${canvas_id}`,err)
    }
  }
  sitemap_queue.length = 0
  bindSitemaps()
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
let sitemap_data = {branches:[]}
sitemap_data = await sitemap_data_promise();

class WikiIndex {
  constructor(path,title,url) {
    this.path = path
    this.title = title
    this.url = url
  }
}

console.log('Sitemap data loaded:' + sitemap_data.branches.length + ' branches');
bindSitemaps()

function bindSitemaps() {
  console.log(`binding site maps: ${sitemap_list.length}`)
  sitemap_list.forEach((sitemap) => {
    processSiteData(sitemap,sitemap_data)
  });
  drawAllSitemaps()
}

/**
 * 
 * @param {Sitemap} sitemap 
 * @param {WikiIndex} data 
 */
function processSiteData(sitemap,data) {
  const duplicatedBranches = [...data.branches]
  duplicatedBranches.push(...duplicatedBranches)
  const nodeEntities = duplicatedBranches.map((branch) => {
    // TODO: branch.path split / into hierarchy levels
    // 
    return new PageNodeEntity(
      branch.path,
      branch.title,
      branch.url,
      {x: Math.random() * sitemap.canvas.width, y: Math.random() * sitemap.canvas.height}
    )
  });

  sitemap.nodes.push(...nodeEntities)
}

// TODO: process data and node dependencies based on hierarchies


// Construct UI Elements - done by HTML

// Construct Business Model
// const sitemap = new Sitemap()

// Pair through presenter
// const presenter = new SitemapPresenter(sitemap)