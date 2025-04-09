// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform float u_Size;\n' + 
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
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
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  var len = g_shapesList.length;

  for(var i = 0; i < len; i++) {
    var shape = g_shapesList[i];
    shape.render();
  }
}

const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;
const DTRIANGLE = 4;

let g_selectedColor = [1.0, 1.0, 1.0, 1.0]; // The color of a point
let g_selectedSize = 10;
let g_selectedType = POINT; // The type of a point
let g_segments = 24;

function addActionsForHtmlUI() {
  document.getElementById('r').addEventListener('mouseup', function(){
    g_selectedColor[0] = this.value/100;
  })
  document.getElementById('g').addEventListener('mouseup', function(){
    g_selectedColor[1] = this.value/100;
  })
  document.getElementById('b').addEventListener('mouseup', function(){
    g_selectedColor[2] = this.value/100;
  })

  document.getElementById('square').onclick = function() { g_selectedType = POINT };
  document.getElementById('triangle').onclick = function() { g_selectedType = TRIANGLE };
  document.getElementById('circle').onclick = function() { g_selectedType = CIRCLE };

  document.getElementById('size').addEventListener('mouseup', function(){
    g_selectedSize = this.value;
  })

  document.getElementById('segments').addEventListener('mouseup', function(){
    g_segments = this.value;
  })
}

function clearCanvas(){
  // Specify the color for clearing <canvas>
  g_shapesList = []; // Clear the shapes list
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}

function main() {

  setupWebGL();

  connectVariablesToGLSL();

  addActionsForHtmlUI();

  g_selectedColor[0] = document.getElementById('r').value/100;
  g_selectedColor[1] = document.getElementById('g').value/100;
  g_selectedColor[2] = document.getElementById('b').value/100;

  g_selectedSize = document.getElementById('size').value;
  g_segments = document.getElementById('segments').value;

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;

  canvas.onmousemove = function(ev) {
    if (ev.buttons == 1) { // Left button is pressed
      click(ev);
    }
  }

  clearCanvas();

}
var g_shapesList = [];

// var g_points = [];  // The array for the position of a mouse press
// var g_colors = [];  // The array to store the color of a point
// var g_sizes = [];   // The array to store the size of a point
function click(ev) {
  [x, y] = convertCoordinatesEventToGL(ev); // Convert to GL coordinates

  let point;
  if(g_selectedType == POINT) {
    point = new Point();
  }
  else if(g_selectedType == TRIANGLE) {
    point = new Triangle();
  }
  else if(g_selectedType == CIRCLE) {
    point = new Circle();
    point.segments = g_segments;
  }
  point.position = [x, y];
  point.color = g_selectedColor.slice(); // Store the color to g_colors array
  point.size = g_selectedSize; // Store the size to g_sizes array
  g_shapesList.push(point); // Store the point to g_shapesList array

  renderAllShapes();
}

function renderDrawing(){
  dict = [{ position: [[-0.395, 0.52], [-0.35, -0.02], [0.375, 0.55]], color: [0.75, 0.77, 0.85, 1] },
  { position: [[-0.27, -0.23], [0.57, -0.21], [-0.23, -0.985]], color: [0.75, 0.77, 0.85, 1] },
  { position: [[-0.365, -0.03], [0.365, 0.55], [0.43, 0.025]], color: [0.63, 0.61, 0.91, 1] },
  { position: [[-0.23, -0.975], [0.56, -0.21], [0.63, -0.965]], color: [0.63, 0.61, 0.91, 1] },
  { position: [[-0.125, -0.095], [0.71, -0.075], [-0.27, -0.235]], color: [0.45, 0.53, 0.94, 1] },
  { position: [[0.555, -0.21], [0.705, -0.07], [0.63, -0.98]], color: [0.45, 0.53, 0.94, 1] },
  { position: [[0.625, -0.985], [0.77, -0.83], [0.7, -0.06]], color: [0.32, 0.37, 0.94, 1] },
  { position: [[0.695, -0.9], [0.69, -0.895], [0.71, -0.095]], color: [0.32, 0.37, 0.94, 1] },
  { position: [[0.575, -0.22], [0.7, -0.075], [-0.29, -0.23]], color: [0.32, 0.37, 0.94, 1] },
  { position: [[0.745, 0.36], [0.775, 0.365], [0.77, 0.38]], color: [0.32, 0.37, 0.94, 1] },
  { position: [[0.5, 0.65], [0.555, 0.165], [0.43, 0.03]], color: [0.32, 0.37, 0.94, 1] },
  { position: [[0.335, 0.53], [0.33, 0.525], [0.335, 0.53]], color: [0.32, 0.37, 0.94, 1] },
  { position: [[0.36, 0.56], [0.43, 0.025], [0.5, 0.635]], color: [0.48, 0.55, 0.94, 1] },
  { position: [[-0.41, 0.515], [-0.17, 0.61], [0.49, 0.635]], color: [0.82, 0.79, 0.94, 1] },
  { position: [[-0.39, 0.515], [0.365, 0.55], [0.5, 0.64]], color: [0.66, 0.73, 0.94, 1] },
  { position: [[0.435, 0.42], [0.62, 0.45], [0.445, 0.305]], color: [0.92, 0.89, 0.08, 1] },
  { position: [[0.615, 0.445], [0.445, 0.31], [0.635, 0.33]], color: [0.73, 0.73, 0.08, 1] },
  { position: [[-0.37, 0.235], [-0.515, 0.23], [-0.515, 0.335]], color: [0.73, 0.73, 0.08, 1] },
  { position: [[-0.52, 0.34], [-0.36, 0.355], [-0.37, 0.23]], color: [0.89, 0.84, 0.04, 1] },
  { position: [[-0.225, 0.355], [-0.22, 0.265], [-0.085, 0.28]], color: [0.94, 0.89, 0.04, 1] },
  { position: [[0.13, 0.29], [0.27, 0.31], [0.24, 0.41]], color: [0.94, 0.89, 0.04, 1] },
  { position: [[-0.23, 0.35], [-0.095, 0.4], [-0.09, 0.275]], color: [0.94, 0.89, 0.04, 1] },
  { position: [[0.135, 0.29], [0.105, 0.415], [0.245, 0.4]], color: [0.94, 0.89, 0.04, 1] },
  { position: [[-0.02, 0.19], [0.02, 0.28], [0.06, 0.2]], color: [0.94, 0.89, 0.04, 1] },
  { position: [[-0.16, 0.115], [0.24, 0.16], [0.245, 0.04]], color: [0.94, 0.89, 0.04, 1] },
  { position: [[-0.11, 0.015], [0.255, 0.045], [-0.105, 0.115]], color: [0.99, 0.89, 0.04, 1] },
  { position: [[-0.36, 0.5], [-0.15, 0.52], [-0.355, 0.375]], color: [1, 1, 1, 1] },
  { position: [[-0.155, 0.285], [-0.205, 0.35], [-0.145, 0.385]], color: [1, 1, 1, 1] },
  { position: [[0.13, 0.41], [0.195, 0.4], [0.18, 0.305]], color: [1, 1, 1, 1] },
  { position: [[-0.28, 0.54], [0.22, 0.575], [0.35, 0.625]], color: [1, 1, 1, 1] },
  { position: [[0.07, 0], [0.23, -0.165], [0.1, -0.16]], color: [0.6, 0.65, 0.84, 1] },
  { position: [[0.085, -0.015], [0.08, -0.015], [-0.64, -0.23]], color: [0.51, 0.53, 0.64, 1] },
  { position: [[0.19, 0.01], [0.07, 0], [0.235, -0.17]], color: [0.47, 0.53, 0.81, 1] },
  { position: [[-0.64, 0], [-0.62, -0.515], [-0.56, -0.415]], color: [0.47, 0.53, 0.81, 1] },
  { position: [[-0.64, -0.52], [-0.265, -0.31], [-0.26, -0.43]], color: [0.47, 0.53, 0.81, 1] },
  { position: [[0.99, -0.51], [0.68, -0.29], [0.96, -0.49]], color: [0.47, 0.53, 0.81, 1] },
  { position: [[0.985, -0.46], [0.615, -0.19], [0.995, -0.61]], color: [0.47, 0.53, 0.81, 1] },
  { position: [[-0.73, -0.055], [-0.615, -0.51], [-0.635, -0.025]], color: [0.73, 0.84, 0.98, 1] },
  { position: [[-0.575, -0.405], [-0.615, -0.525], [-0.25, -0.305]], color: [0.73, 0.84, 0.98, 1] },
  { position: [[0.675, -0.245], [0.99, -0.595], [0.67, -0.35]], color: [0.73, 0.84, 0.98, 1] },
  { position: [[-0.885, 0.18], [-0.8, -0.1], [-0.805, 0.2]], color: [0.95, 0.91, 0.13, 1] },
  { position: [[-0.63, -0.02], [-0.68, 0.225], [-0.61, 0.24]], color: [0.95, 0.91, 0.13, 1] },
  { position: [[-0.64, 0.065], [-0.81, -0.075], [-0.625, -0.025]], color: [0.95, 0.91, 0.13, 1] },
  { position: [[-0.8, -0.08], [-0.83, 0.03], [-0.625, 0.075]], color: [0.95, 0.91, 0.13, 1] },
  { position: [[-0.615, 0.255], [-0.63, -0.03], [-0.57, 0]], color: [0.94, 0.68, 0.13, 1] },
  { position: [[-0.82, 0.025], [-0.81, 0.21], [-0.74, 0.045]], color: [0.94, 0.68, 0.13, 1] },
  { position: [[-0.855, 0.87], [-0.81, 0.63], [-0.715, 0.675]], color: [0.98, 0.87, 0.13, 1] },
  { position: [[-0.755, 0.715], [-0.685, 0.775], [-0.565, 0.51]], color: [0.98, 0.87, 0.13, 1] },
  { position: [[-0.585, 0.885], [-0.545, 0.68], [-0.465, 0.73]], color: [0.98, 0.87, 0.13, 1] },
  { position: [[-0.505, 0.765], [-0.435, 0.805], [-0.43, 0.59]], color: [0.98, 0.87, 0.13, 1] },
  { position: [[-0.085, -0.46], [-0.045, -0.96], [0.405, -0.45]], color: [0.56, 0.74, 0.33, 1] },
  { position: [[0.395, -0.445], [-0.07, -0.96], [0.445, -0.955]], color: [0.4, 0.65, 0.54, 1] }]

  for (let i = 0; i < dict.length; i++) {
    const triangle = new DifferentTriangle();
    triangle.position = dict[i].position;
    triangle.color = dict[i].color;
    g_shapesList.push(triangle);
  }
  renderAllShapes();

}