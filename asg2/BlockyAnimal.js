// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform mat4 u_ModelMatrix;\n' + 
  'uniform mat4 u_GlobalRotateMatrix;\n' + 
  'uniform float u_Size;\n' + 
  'void main() {\n' +
  '  gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;\n' +
  '  gl_PointSize = u_Size;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'uniform vec4 u_FragColor;\n' +  // uniform変数
  'void main() {\n' +
  '  gl_FragColor = u_FragColor;\n' +
  '}\n';

let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;

function setupWebGL() {
    // Retrieve <canvas> element
    canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    // gl = getWebGLContext(canvas);
    gl = canvas.getContext('webgl', {preserveDrawingBuffer: true});
    if (!gl) {
      console.log('Failed to get the rendering context for WebGL');
      return;
    }

    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  }

function connectVariablesToGLSL() {
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if(!u_ModelMatrix){
    console.log('Failed to get the storage location of u_ModelMatrix')
    return;
  }

  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);

  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if(!u_GlobalRotateMatrix){
    console.log('Failed to get the storage location of u_GlobalRotateMatrix')
    return;
  }

  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
if (!u_Size) {
  console.log('Failed to get the storage location of u_Size');
  return;
}
}

function convertCoordinatesEventToGL(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return [x, y];
}

function renderAllShapes() {
  var globalRotMat = new Matrix4()
  .rotate(g_globalAngleXFromDrag, 1, 0, 0)
  .rotate(g_sliderAngleY + g_globalAngleYFromDrag, 0, 1, 0);

  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  var body = new Cube([0.925, 0.196, 0.114, 0.8]);
  // body.matrix = cylinderCoord;
  body.matrix.translate(-.14, 0, 0);
  if(g_animationOn){
    body.matrix.rotate(20*Math.sin(g_seconds), 0, 1, 0);
  }else{
    body.matrix.rotate(g_bendAngle, 0, 1, 0);
  }
  headCoord = new Matrix4(body.matrix);
  body.matrix.scale(.15, .48, .2);
  body.render();

  let tri = new Triangle3D(
    [0.0, 0.15, 0.0],
    [-0.4, -0.2, 0.0],
    [0, -0.2, 0.0],
    0.2, // depth
    [0.529, 0.871, 0.216, 1.0] // red
  );
  tri.matrix = headCoord;
  tri.matrix.translate(0.08, .16, .1);
  head2Coord = new Matrix4(tri.matrix);
  tri.matrix.scale(1, 1, 1);
  tri.render();

  let tri2 = new Triangle3D(
    [0.0, 0.15, 0.0],
    [-0.4, -0.2, 0.0],
    [0, -0.2, 0.0],
    0.23, // depth
    [0.353, 0.600, 0.122, 1.0] // red
  );
  tri2.matrix = head2Coord;
  tri2.matrix.translate(0, -.1, .01);
  tri2.matrix.scale(.8, .8, 1);
  tri2.render();

  var colors = [
    [0.925, 0.196, 0.114, 0.8],
    [0.858, 0.176, 0.106, 0.8],
    [0.790, 0.157, 0.098, 0.8],
    [0.722, 0.137, 0.089, 0.8],
    [0.654, 0.118, 0.081, 0.8],
    [0.587, 0.108, 0.073, 0.8],
    [0.554, 0.102, 0.068, 0.8],
    [0.520, 0.097, 0.063, 0.8],
    [0.501, 0.095, 0.057, 0.8],
    [0.800, 0.765, 0.243, 1.0]
  ];
  
  var zScales = [0.2, 0.19, 0.18, 0.17, 0.16, 0.15, 0.14, 0.13, 0.12, 0.11];
  var xScales = [0.15, 0.14, 0.13, 0.12, 0.11, 0.10, 0.09, 0.08, 0.07, 0.06];
  var yScales = [0.5, 0.45, 0.4, 0.36, 0.32, 0.28, 0.24, 0.20, 0.16, 0.12];
  var translations = [0, 0.15, 0.13, 0.12, 0.11, 0.10, 0.09, 0.08, 0.07, 0.06];
  
  let prevMatrix = new Matrix4();
prevMatrix.translate(0, 0, 0);

for (let i = 0; i < 10; i++) {
  let part = new Cube(colors[i]);

  part.matrix = new Matrix4(prevMatrix);
  part.matrix.translate(translations[i], i === 0 ? 0 : 0.02, 0);

  if (i > 3) {
    if(g_animationOn){
      part.matrix.rotate(20*Math.sin(g_seconds), 0, 1, 0);
    }else{
      part.matrix.rotate(g_bendAngle2, 0, 1, 0);
    }
  }

  prevMatrix = new Matrix4(part.matrix);

  if (i === 9) {
    // Make the last part (10th part) large
    part.matrix.scale(0.25, 0.5, 0.10);
    part.matrix.translate(0, -.30, 0);
  } else {
    part.matrix.scale(xScales[i], yScales[i], zScales[i]);
  }

  part.render();
}



  
  
  let tri3 = new Triangle3D(
    [0.0, 0.15, 0.0],
    [-0.5, -0.2, 0.0],
    [.2, -0.2, 0.0],
    0.1, // depth
    [0.800, 0.765, 0.243, 1.0] // red
  );
  tri3.matrix.translate(.15, .3, .08);
  tri3.matrix.scale(.8, .8, 1);
  tri3.render();

  let tri4 = new Triangle3D(
    [0.0, 0.01, 0.0],
    [-0.6, -0.2, 0.0],
    [.1, -0.2, 0.0],
    0.1, // depth
    [0.800, 0.765, 0.243, 1.0] // red
  );
  tri4.matrix.translate(.3, 0, .08);
  tri4.matrix.rotate(90, 1, 0, 0);
  tri4.matrix.scale(.8, .8, 1);
  tri4.render();

  let tri5 = new Triangle3D(
    [0.0, 0.01, 0.0],
    [-0.3, -0.2, 0.0],
    [.1, -0.2, 0.0],
    0.05, // depth
    [0.800, 0.765, 0.243, 1.0] // red
  );
  tri5.matrix.translate(.1, .2, .12);
  tri5.matrix.scale(.8, .8, 1);
  tri5.render();

  let tri6 = new Triangle3D(
    [0.0, 0.01, 0.0],
    [-0.3, -0.2, 0.0],
    [.1, -0.2, 0.0],
    0.05, // depth
    [0.800, 0.765, 0.243, 1.0] // red
  );
  tri6.matrix.translate(.1, .2, 0);
  tri6.matrix.scale(.8, .8, 1);
  tri6.render();

}

let g_segments = 24;
let g_globalAngleX = 0;
let g_sliderAngleY = 0;
let g_dragAngleY = 0;
let g_mouseDown = false;
let g_lastMouseX = null;
let g_lastMouseY = null;
let g_bendAngle = 0;
let g_bendAngle2 = 0;
let g_animationOn = false;
let g_globalAngleXFromDrag = 0;
let g_globalAngleYFromDrag = 0;


function addActionsForHtmlUI() {
  

  document.getElementById('angle').addEventListener('input', function(){
    g_sliderAngleY = parseFloat(this.value);
    renderAllShapes();
  });

  document.getElementById('bend').addEventListener('input', function(){
    g_bendAngle = this.value;
    renderAllShapes();
  });

  document.getElementById('bend2').addEventListener('input', function(){
    g_bendAngle2 = this.value;
    renderAllShapes();
  });

  document.getElementById('animationOn').onclick = function(){
    g_bendAngle = 0;
    g_bendAngle2 = 0;
    document.getElementById('bend').value = 0;
    document.getElementById('bend2').value = 0;
    g_animationOn = !g_animationOn;
  }

  document.getElementById('animationOff').onclick = function(){
    g_bendAngle = 0;
    g_bendAngle2 = 0;
    document.getElementById('bend').value = 0;
    document.getElementById('bend2').value = 0;
    g_animationOn = !g_animationOn;
  }
  
}

function clearCanvas(){
  // Specify the color for clearing <canvas>
  g_shapesList = []; // Clear the shapes list
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
}

function main() {
  setupWebGL();
  connectVariablesToGLSL();
  addActionsForHtmlUI();

  g_sliderAngleY = document.getElementById('angle').value;

  canvas.onmousedown = function(ev) {
    g_mouseDown = true;
    g_mouseLastX = ev.clientX;
    g_mouseLastY = ev.clientY;
  };
  
  canvas.onmousemove = function(ev) {
    if (g_mouseDown) {
      let dx = ev.clientX - g_mouseLastX;
      let dy = ev.clientY - g_mouseLastY;
  
      g_globalAngleYFromDrag += dx * 0.5;
      g_globalAngleXFromDrag += dy * 0.5;
  
      g_mouseLastX = ev.clientX;
      g_mouseLastY = ev.clientY;
  
      renderAllShapes();
    }
  };
  
  canvas.onmouseup = function(ev) {
    g_mouseDown = false;
  };
  
  canvas.onmouseleave = function(ev) {
    g_mouseDown = false;
  };
  

  clearCanvas();
  // renderAllShapes();
  requestAnimationFrame(tick);
}

let frame = 0;
var g_startTime = performance.now()/ 1000;
var g_seconds = performance.now()/ 1000 - g_startTime;

function tick(){
  g_seconds = performance.now()/ 1000 - g_startTime;

  renderAllShapes();

  requestAnimationFrame(tick);
}
