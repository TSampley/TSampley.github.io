
class DiscretePDF {
  // apparently this syntax isn't widely supported
  // xs;
  // ys;
  // fs;
  //
  // xsum;
  // ysum;
  // fsum;
  //
  // meanX;
  // meanY;
  //
  // dxs;
  // dys;
  //
  // varX;
  // varY;
  // covar;
  // corr;

  constructor(xs, ys, fs) {
    // Points
    this.xs = xs;
    this.ys = ys;
    this.fs = fs;

    this.xsum = 0;
    this.ysum = 0;
    this.fsum = 0;
    for (var i = 0; i < xs.length; i++) {
      var f = fs[i];
      this.xsum += xs[i]*f;
      this.ysum += ys[i]*f;
      this.fsum += f;
    }

    // Intermediate values
    this.meanX = this.xsum / this.fsum;
    this.meanY = this.ysum / this.fsum;
    // Differences from Mean
    this.dxs = [];
    this.dys = [];
    // Variance
    this.varX = 0;
    this.varY = 0;
    this.covar = 0;
    this.corr = 0;
  }

  get size() {
    return this.xs.length;
  }

  get stdX() {
    return Math.sqrt(this.varX);
  }

  get stdY() {
    return Math.sqrt(this.varY);
  }

  pushVal(x, y, f) {
    // console.log("push: " + `${x}, ${y}`);
    let n = this.size;
    this.xs[n] = x;
    this.ys[n] = y;
    this.fs[n] = f;

    this.xsum += x*f;
    this.ysum += y*f;
    this.fsum += f;

    this.meanX = this.xsum / this.fsum;
    this.meanY = this.ysum / this.fsum;

    this.recalculate();
  }

  setVal(i, x, y, f) {
    // remove old values from sum
    let oldF = this.fs[i];
    this.xsum -= this.xs[i]*oldF;
    this.ysum -= this.ys[i]*oldF;
    this.fsum -= this.fs[i];

    // overwrite old values
    this.xs[i] = x;
    this.ys[i] = y;
    this.fs[i] = f;

    // account for new values
    this.xsum += x*f;
    this.ysum += y*f;
    this.fsum += f;
    this.meanX = this.xsum / this.fsum;
    this.meanY = this.ysum / this.fsum;

    this.recalculate();
  }

  recalculate() {
    let squareSumX = 0;
    let squareSumY = 0;
    let covar = 0;
    for (let i = 0, size = this.size; i < size; i ++) {
      let dx = this.xs[i] - this.meanX;
      let dy = this.ys[i] - this.meanY;
      let f = this.fs[i];
      this.dxs[i] = dx;
      this.dys[i] = dy;
      squareSumX += dx*dx*f;
      squareSumY += dy*dy*f;
      covar += dx*dy*f;
    }
    this.varX = squareSumX / this.fsum;
    this.varY = squareSumY / this.fsum;
    this.covar = covar / this.fsum;
    this.corr = this.covar / Math.sqrt(this.varX*this.varY);
  }
}
