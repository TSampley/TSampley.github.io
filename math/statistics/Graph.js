
const RADIUS = 5;
const DIAMETER = RADIUS*2;

const FLAG_DX = 1 << 0;
const FLAG_DY = 1 << 1;
const FLAG_ALL = 0x7fffffff;

class Graph {
  // see CalculationData fields for commenting reason
  // // canvas and context
  // canvas;
  // context;
  // // translation. starts with (0, 0) at center
  // tx;
  // ty;
  // // scale. default 1
  // sx;
  // sy;
  // // tick interval
  // ix;
  // iy;
  //
  // // render flags
  // flags;
  // // colors
  // colors;
  constructor(canvas, context, tx, ty, sx, sy, ix, iy) {
    this.canvas = canvas;
    this.context = context;
    this.tx = tx;
    this.ty = ty;
    this.sx = sx;
    this.sy = sy;
    this.ix = ix;
    this.iy = iy;
    this.flags = FLAG_ALL;
    this.colors = [];
  }

  /* Takes an x in canvas coordinates and returns the corresponding graph
  coordinate */
  mapX(xc) {
    return (xc - this.canvas.width/2 + this.tx) / this.sx;
  }
  /* Takes a y in canvas coordinates and returns the corresponding graph
  coordinate */
  mapY(yc) {
    return (this.canvas.height/2 - yc + this.ty) / this.sy;
  }
  /* Takes an x in graph coordinates and returns the corresponding canvas
  coordinate */
  unmapX(xg) {
    return xg * this.sx - this.tx + this.canvas.width/2;
  }
  /* Takes a y in graph coordinates and returns the corresponding canvas
  coodindate */
  unmapY(yg) {
    return this.canvas.height/2 - yg * this.sy + this.ty;
  }

  enabled(flag) {
    return this.flags & flag > 0;
  }

  drawAxes(data) {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.context.beginPath();
    // draw x-axis
    let originY = this.unmapY(0); // canvas y location of graph's y=0
    if (originY > 0 && originY < this.canvas.height) {
      this.context.moveTo(0, originY);
      this.context.lineTo(this.canvas.width, originY);
    }
    // draw x-axis ticks
    let startX = this.mapX(0);
    let endX = this.mapX(this.canvas.width);
    startX = Math.ceil(startX / this.ix);
    endX = Math.floor(endX / this.ix);
    for (let i = startX; i <= endX; i++) {
      let x = this.unmapX(i*this.ix);
      this.context.moveTo(x, originY);
      this.context.lineTo(x, originY-3);
    }

    // draw y-axis
    let originX = graph.unmapX(0);
    if (originX > 0 && originX < this.canvas.width) {
      this.context.moveTo(originX, 0);
      this.context.lineTo(originX, this.canvas.height);
    }
    // draw y-axis ticks
    let startY = this.mapY(this.canvas.height);
    let endY = this.mapY(0);
    startY = Math.ceil(startY / this.iy);
    endY = Math.floor(endY / this.iy);
    for (let i = startY; i <= endY; i++) {
      let y = this.unmapY(i*this.iy);
      this.context.moveTo(originX, y);
      this.context.lineTo(originX+3, y);
    }
    this.context.strokeStyle = "#000000";
    this.context.stroke();
  }

  drawMeans(data) {
    this.context.beginPath();
    let meanX = this.unmapX(data.meanX);
    let meanY = this.unmapY(data.meanY);
    if (meanX > 0 && meanX < this.canvas.width) {
      this.context.moveTo(meanX, 0);
      this.context.lineTo(meanX, this.canvas.height);
    }
    if (meanY > 0 && meanY < this.canvas.height) {
      this.context.moveTo(0, meanY);
      this.context.lineTo(this.canvas.width, meanY);
    }
    this.context.strokeStyle = "#ff0000";
    this.context.stroke();
  }

  drawPoints(data) {
    let drawX = this.enabled(FLAG_DX);
    let drawY = this.enabled(FLAG_DY);

    let meanX = this.unmapX(data.meanX);
    let meanY = this.unmapY(data.meanY);

    for (let i = 0, end = data.size; i < end; i++) {
      let x = data.xs[i];
      let y = data.ys[i];
      let location = `(${x}, ${y})`; // get graph coords

      x = this.unmapX(x);
      y = this.unmapY(y);
      // draw
      // draw point
      this.context.fillRect(x-RADIUS, y-RADIUS, DIAMETER, DIAMETER);
      this.context.fillText(location, x+10, y);

      if (drawX || drawY) {
        this.context.beginPath();
        // draw dx
        if (drawX) {
          this.context.moveTo(x, y);
          this.context.lineTo(meanX, y);
        }
        // draw dy
        if (drawY) {
          this.context.moveTo(x, y);
          this.context.lineTo(x, meanY);
        }
        this.context.strokeStyle = this.colors[i];
        this.context.stroke();
      }
    }
  }

  draw(data) {
    while (this.colors.length < data.size) {
      // generate new color
      let color = "#";
      for (let i = 0; i < 6; i++) {
        color += "0123456789ABCDEF".charAt(Math.floor(Math.random()*16));
      }

      this.colors[this.colors.length] = color;
    }

    this.drawAxes(data);

    this.drawMeans(data);

    this.drawPoints(data);
  }

  drawInfo(info) {
    this.context.clearRect(0, 0, 200, 25);
    this.context.fillText(info, 10, 20);
  }
}
