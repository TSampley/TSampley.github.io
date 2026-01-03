
function processSitemapQueue() {
  const sitemap_queue = window.sitemap_queue || []
  for(const canvas_id of sitemap_queue) {
    try {
      const newSitemap = new Sitemap(canvas_id,'/')

      // initialize sitemap
      drawSitemap(newSitemap)
      sitemap_list.push(newSitemap)
    } catch (err) {
      console.error(`Sitemap: Error processing canvas id:${canvas_id}`,err)
    }
  }
  sitemap_queue.length = 0
}

window.onload = async () => {
  processSitemapQueue();
}

class Sitemap {
  constructor(hostId,root) {
    this.hostId = hostId
    this.root = root

    this.canvas = document.getElementById(this.hostId)
    if(!this.canvas) {
      throw `Sitemap: No canvas found with id:${this.hostId}`
    }
    this.context = this.canvas.getContext('2d')
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
  
}
