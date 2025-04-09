class DifferentTriangle {
    constructor() {
      this.type = 'differenttriangle';
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