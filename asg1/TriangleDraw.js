// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
class Triangle {
    constructor() {
      this.type = 'triangle';
      this.position = []; // [ [x1, y1], [x2, y2], [x3, y3] ]
      this.color = [1.0, 1.0, 1.0, 1.0];
      this.size = 10;
    }
  
    render() {
        if (this.position.length !== 3) return;
      
        // Draw triangle
        gl.uniform4f(u_FragColor, this.color[0], this.color[1], this.color[2], this.color[3]);
        gl.uniform1f(u_Size, this.size);
      
        const verts = [
          this.position[0][0], this.position[0][1],
          this.position[1][0], this.position[1][1],
          this.position[2][0], this.position[2][1]
        ];
        drawTriangle(verts);

      }
      
  }
  

  function drawTriangle(vertices) {
    // var vertices = new Float32Array([
    //   0, 0.5,   -0.5, -0.5,   0.5, -0.5
    // ]);
    var n = 3; // The number of vertices
  
    // Create a buffer object
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }
  
    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
  
    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  
    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);
  
    gl.drawArrays(gl.TRIANGLES, 0, n); // Draw the rectangle
  }
  

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
    gl.clear(gl.COLOR_BUFFER_BIT);
  
    for (const triangle of g_triangles) {
      triangle.render();
    }

    displayOnUi();
  }
  

const POINT = 0;

let g_selectedColor = [1.0, 1.0, 1.0, 1.0]; // The color of a point
let g_selectedSize = 10;
let g_selectedType = POINT; // The type of a point
let g_segments = 24;

function addActionsForHtmlUI() {
  document.getElementById('r').addEventListener('mouseup', function(){
    g_selectedColor[0] = this.value/100;
    updateColor();
  })
  document.getElementById('g').addEventListener('mouseup', function(){
    g_selectedColor[1] = this.value/100;
    updateColor();
  })
  document.getElementById('b').addEventListener('mouseup', function(){
    g_selectedColor[2] = this.value/100;
    updateColor();
  })

}

function clearCanvas(){
  // Specify the color for clearing <canvas>
  g_triangles = []; // Clear the shapes list
  g_tempPoints = []; // Clear the temporary points list
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}

function deleteLastTriangle(){
    g_triangles.pop();
    renderAllShapes();
}

function main() {

  setupWebGL();

  connectVariablesToGLSL();

  addActionsForHtmlUI();

  g_selectedColor[0] = document.getElementById('r').value/100;
  g_selectedColor[1] = document.getElementById('g').value/100;
  g_selectedColor[2] = document.getElementById('b').value/100;
  updateColor();


  // Register function (event handler) to be called on a mouse press

  canvas.onmousedown = (ev) => {
    const [x, y] = convertCoordinatesEventToGL(ev);
    selectedVertex = findVertexUnderMouse(x, y);
  
    if (selectedVertex) {
      dragging = true;
    } else {
      handleMouseDown(ev); // Normal behavior: collect points
    }
  };
  
  canvas.onmousemove = (ev) => {
    if (dragging && selectedVertex) {
      const [x, y] = convertCoordinatesEventToGL(ev);
      const { triangleIndex, vertexIndex } = selectedVertex;
      g_triangles[triangleIndex].position[vertexIndex] = [x, y];
      renderAllShapes();
    }
  };
  
  canvas.onmouseup = () => {
    dragging = false;
    selectedVertex = null;
  };

  clearCanvas();

}

function updateColor(){
    document.getElementById('colorDisplay').style.backgroundColor = `rgba(${g_selectedColor[0]*255}, ${g_selectedColor[1]*255}, ${g_selectedColor[2]*255}`;
}

function handleMouseDown(ev) {
    const [x, y] = convertCoordinatesEventToGL(ev);
  
    g_tempPoints.push([x, y]);
  
    if (g_tempPoints.length === 3) {
      // Create a Triangle
      const triangle = new Triangle();
      triangle.position = g_tempPoints.slice(); // Copy all 3 points
      triangle.color = [...g_selectedColor];
      triangle.size = g_selectedSize;
      g_triangles.push(triangle);
      g_tempPoints = []; // Reset temp points
    }
  
    renderAllShapes();
  }
  

let g_triangles = [];
let g_tempPoints = []; // Temporary storage for triangle vertices
let dragging = false;
let selectedVertex = null; // { triangleIndex: number, vertexIndex: 0-2 }
const VERTEX_SELECT_RADIUS = 0.03; // ~3% of canvas width

  
  function findVertexUnderMouse(x, y) {
    for (let i = 0; i < g_triangles.length; i++) {
      const tri = g_triangles[i];
      for (let j = 0; j < 3; j++) {
        const [vx, vy] = tri.position[j];
        const dist = Math.sqrt((vx - x)**2 + (vy - y)**2);
        if (dist < VERTEX_SELECT_RADIUS) {
          return { triangleIndex: i, vertexIndex: j };
        }
      }
    }
    return null;
  }
  
  function displayOnUi(){
    document.getElementById('generatedCode').innerHTML = g_triangles.map(triangle => {
      return `{
                position: [${triangle.position.map(p => `[${p.join(', ')}]`).join(', ')}],
                color: [${triangle.color.join(', ')}]
                },`;
    }).join('<br>');
  }