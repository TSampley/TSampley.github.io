
let onMouseDown = function(e) {
  let closest = Math.pow(5, 2);
  for (let i = 0, size = data.size; i < size; i++) {
    let dx = graph.unmapX(data.xs[i]) - e.offsetX;
    let dy = graph.unmapY(data.ys[i]) - e.offsetY;
    let dSquared = dx*dx + dy*dy;
    if (dSquared < closest) {
      onMouseDown.trackedIndex = i;
      closest = dSquared;
    }
  }
};
onMouseDown.trackedIndex = -1;

let onMouseMove = function(e) {
  if (onMouseDown.trackedIndex >= 0) {
    data.setVal(onMouseDown.trackedIndex,
      graph.mapX(e.offsetX),
      graph.mapY(e.offsetY),
      data.fs[onMouseDown.trackedIndex]
    );
    updateDisplay();
  }
};

let onMouseUp = function(e) {
  graph.drawInfo("up");
};

let onClick = function(e) {
  if (onMouseDown.trackedIndex == -1) {
    let x = graph.mapX(e.offsetX);
    let y = graph.mapY(e.offsetY);
    data.pushVal(x, y, 1);

    updateDisplay();
  } else {
    onMouseDown.trackedIndex = -1;
  }
}

function move(tx, ty) {
  graph.tx = tx;
  graph.ty = ty;

  graph.draw(data);
}

function savePoints() {
  document.cookie = `xs=${data.xs}`;
  document.cookie = `ys=${data.ys}`;
  document.cookie = `fs=${data.fs}`;
}

function clearPoints() {
  data = new CalculationData([], [], []);
  updateDisplay();
}

function updateDisplay() {
  graph.draw(data);
  label_count.innerHTML = `Count: ${data.size}`;
  label_meanx.innerHTML = `Mean X: ${data.meanX}`;
  label_meany.innerHTML = `Mean Y: ${data.meanY}`;
  label_varX.innerHTML = `Variance X: ${data.varX}`;
  label_varY.innerHTML = `Variance Y: ${data.varY}`;
  label_covar.innerHTML = `Covariance: ${data.covar}`;
  label_corr.innerHTML = `Correlation: ${data.corr}`;
}

function loadCookies() {
  let vars = document.cookie; // "k1=v1;k2=v2;k3=v3"
  let pairs = vars.split(";"); // "key=value"
  let map = new Map();
  for (pair of pairs) {
    let vals = pair.split("=");
    if (vals[1] != "") {
      map.set(vals[0].trim(), vals[1]);
    }
  }
  return map;
}

// MAIN

let data = null;
let graph = null;

function main() {
  cookies = loadCookies();

  if (cookies.has("xs")) {
    data = new CalculationData(
      cookies.get("xs").split(",").map(parseFloat),
      cookies.get("ys").split(",").map(parseFloat),
      cookies.get("fs").split(",").map(parseFloat)
    );
  } else {
    data = new CalculationData([], [], []);
  }

  // get chalkboard reference
  // let chalkboard = document.getElementById(ID_CHALKBOARD);
  let canvas = chalkboard.getContext("2d");
  graph = new Graph(chalkboard, canvas, 0, 0, slider_scale.value, slider_scale.value, 5, 5)

  // attach listener
  chalkboard.onmousedown = onMouseDown;
  chalkboard.onmousemove = onMouseMove;
  chalkboard.onmouseup = onMouseUp;
  chalkboard.onclick = onClick;
  slider_scale.oninput = function() {
    graph.sx = graph.sy = this.value;
    graph.draw(data);
  }

  // draw graph
  updateDisplay();

  return 0;
}

main();