
import { Render2D } from 'science/computing/simulation/render.mjs';
import { Point, Size } from '/js/common/geom.mjs'
import { Entity } from '/science/computing/simulation/entity.mjs'
import { Environment } from 'science/computing/simulation/environment.mjs';

window.onload = async () => {
  processSitemapQueue();
}

/**
 * Binder between the UI and Model (Sitemap). Responsible for forwarding UI
 * events to the model and notifying the UI of state changes.
 */
class SitemapPresenter {
  /**
   * 
   * @param {Sitemap} sitemap Business model
   * @param {SitemapUi} ui User interface for rendering and event capture
   */
  constructor(
    sitemap,
    ui
  ) {
    this.sitemap = sitemap
    this.ui = ui
  }
}

/**
 * Used by the SitemapUi to render the model Sitemap.
 */
class SitemapRender extends Render2D {
  /**
   * 
   * @param {*} context 
   * @param {Sitemap} subject 
   */
  render(context,subject) {
    const width = subject.width
    const height = subject.height
    
    // clear canvas
    context.fillStyle = '#ffffff'
    context.fillRect(0,0,width,height)

    // draw nodes
    for(const node of subject.nodes) {
      const pos = node.position
      // draw node circle
      context.fillStyle = '#0077cc'
      context.beginPath()
      context.arc(pos.x, pos.y, subject.nodeRadius, 0, 2 * Math.PI)
      context.fill()

      // draw node text
      if (subject.hoverPoint) {
        const offsetX = subject.hoverPoint.x - pos.x
        const offsetY = subject.hoverPoint.y - pos.y
        const radius = 100.0
        const opacity = 1 - Math.min(1.0, Math.max(Math.abs(offsetX), Math.abs(offsetY))/radius)
        if (opacity > 0.1) {
          context.fillStyle = `rgba(0, 0, 0, ${opacity})`
          context.font = '12px Arial'
          context.fillText(node.title, pos.x + 15, pos.y + 5)
        }
      }

      if (subject.debug) {
        // draw force vector for debugging
        if (node.force) {
          context.strokeStyle = '#ff0000'
          context.lineWidth = 1
          context.beginPath()
          context.moveTo(pos.x, pos.y)
          context.lineTo(pos.x + node.force.fx, pos.y + node.force.fy)
          context.stroke()
        }

        // draw velocity vector for debugging
        if (node.velocity) {
          context.strokeStyle = '#00ff00'
          context.lineWidth = 1
          context.beginPath()
          context.moveTo(pos.x, pos.y)
          context.lineTo(pos.x + node.velocity.x, pos.y + node.velocity.y)
          context.stroke()
        }
      }
    }
  }
}

/**
 * Resonposible for rendering the sitemap and capturing HTMLElements that
 * compose the UI. Will bind event listeners to the UI and notify the presenter
 * of interactions.
 */
class SitemapUi {
  /**
   * @param {SitemapPresenter} presenter The presenter object that notifies of 
   * state changes and receives events.
   */
  constructor(
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
    this.canvas = document.getElementById(canvasId)
    this.displaySelectedNode = document.getElementById(spanSelectedNodeId)
    this.buttonTimeControl = document.getElementById(buttonTimeControlId)
    this.rangeRepulsionForce = document.getElementById(rangeRepulsionForceId)
    this.rangeCenterForce = document.getElementById(rangeCenterForceId)
    this.rangeSpringForce = document.getElementById(rangeSpringForceId)
    this.rangeSpringLength = document.getElementById(rangeSpringLengthId)
    this.rangeDragRestitution = document.getElementById(rangeDragRestitutionId)
    this.checkboxDebug = document.getElementById(checkboxDebugId)

    this.render = new SitemapRender()

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
      this.hoverPoint.x = event.offsetX
      this.hoverPoint.y = event.offsetY
    }

    const timeControlButton = document.getElementById('button-time-control')
    timeControlButton.onclick = () => {
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

  /**
   * 
   * @param {SitemapPresenter} presenter 
   */
  bind(presenter) {
    this.presenter = presenter

    this.rangeRepulsionForce.value = presenter.sitemap.repelForce
    this.rangeRepulsionForce.oninput = (event) => {
      presenter.sitemap.repelForce = event.target.value
    }
    this.rangeCenterForce.value = presenter.sitemap.centerForceConstant
    this.rangeCenterForce.oninput = (event) => {
      presenter.sitemap.centerForceConstant = event.target.value
    }
    this.rangeSpringForce.value = presenter.sitemap.springConstant
    this.rangeSpringForce.oninput = (event) => {
      presenter.sitemap.springConstant = event.target.value
    }
    this.rangeSpringLength.value = presenter.sitemap.springDistance
    this.rangeSpringLength.oninput = (event) => {
      presenter.sitemap.springDistance = event.target.value
    }
    this.rangeDragRestitution.value = 1 - presenter.sitemap.dragRestitution
    this.rangeDragRestitution.oninput = (event) => {
      presenter.sitemap.dragRestitution = 1 - event.target.value
    }
    this.checkboxDebug.checked = presenter.sitemap.debug
    this.checkboxDebug.onchange = (event) => {
      presenter.sitemap.debug = event.target.checked == true
    }
  }
}

class PageNodeEntity extends Entity {
  constructor(path,title,url,position) {
    super(new Point(),new Point())
    this.path = path
    this.title = title
    this.url = url
    this.position = position
  }
}

class Sitemap extends Environment {
  /**
   *  
   * @param {string} root The point in the hierarchy to start from. For example, "/" for the entire wiki, or "/science" for the science branch.
   */
  constructor(root) {
    super(new Size(800, 600))

    this.root = root

    this.isRunning = false
    /**
     * @type {PageNodeEntity[]}
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
    this.springConstant = 1E-5
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
    this.debug = true
  }

  /**
   * 
   * TODO: move to Presenter and replace with query and mutator methods on Sitemap for selection and other interactions
   * @param {number} x 
   * @param {number} y 
   */
  onSelectNode(x,y) {
    const selectionDistance = 50
    const minDistSqr = selectionDistance**2
    const closest = this.nodes.reduce((closest, current) => {
      const dx = x - current.node.position.x
      const dy = y - current.node.position.y
      const distanceSqr = dx*dx + dy*dy
      if (distanceSqr <= minDistSqr) {
        const distance = Math.sqrt(distanceSqr)
        if (!closest.dist || distance < closest.dist) {
          return {node: current.node, dist: distance}
        }
      }
      return closest
    }, /** @type {{closest: PageNodeEntity|null, closestDistance: number|null}} */ { node: null, dist: null})

    this.selectedNode = closest.node
    if (closest.node) {
      this.nodeDisplay.innerHTML = closest.node.title
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
    // TODO: allow Simulation to handle this and move drawing to render

    // Loop
    if(this.isRunning) {
      requestAnimationFrame((newTsl) => this.animate(newTsl))
    }
  }
}

/**
 * @type {SitemapPresenter[]}
 */
const sitemap_list = []

function drawAllSitemaps() {
  for(const presenter of sitemap_list) {
    // TODO: list presenters instead to capture UI elemnts
    presenter.ui.render.render(presenter.ui.context, presenter.sitemap, 0)
  }
}

function processSitemapQueue() {
  const sitemap_queue = window.sitemap_queue || []
  console.log(`Processing canvases, count:${sitemap_queue.length}`)
  for(const canvas_id of sitemap_queue) {
    console.log(`Processing canvas id:${canvas_id}`)
    try {
      const ui = new SitemapUi(canvas_id)
      const newSitemap = new Sitemap('/')
      const presenter = new SitemapPresenter(newSitemap, ui)
      ui.bind(presenter)

      // initialize sitemap
      ui.render.render(ui.context, newSitemap, 0)
      sitemap_list.push(presenter)
    } catch (err) {
      console.error(`Error processing canvas id:${canvas_id}`,err)
    }
  }
  sitemap_queue.length = 0
  bindSitemaps()
}

console.log('Sitemap data load initiated');
/** @type {{branches: WikiIndex[]}} */
let sitemap_data = {branches:[new WikiIndex('/','Loading...','#')]} // default data while loading
sitemap_data = await async function() {
  try {
    const response = await fetch('/assets/branches.json')
    if (!response.ok) {
      throw `HTTP error! status: ${response.status}`
    }
    /** @type {{branches: WikiIndex[]}} */
    const data = await response.json()
    return data
  } catch (err) {
    console.error('Sitemap: Error fetching branches.json',err)
    return {branches:[new WikiIndex('/','Error loading data','#')]}
  }
}();

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
  sitemap_list.forEach((presenter) => {
    processSiteData(presenter.sitemap,sitemap_data)
  });
  drawAllSitemaps()
}

/**
 * @param {Sitemap} sitemap 
 * @param {WikiIndex} data 
 */
function processSiteData(sitemap,data) {
  const duplicatedBranches = [...data.branches]
  // duplicatedBranches.push(...duplicatedBranches)
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