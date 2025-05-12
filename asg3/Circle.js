class Circle {
    constructor() {
      this.type = 'circle';
      this.position = [0, 0, 0];
      this.color = [1.0, 1.0, 1.0, 1.0];
      this.size = 10;
      this.segments = 24; // Default number of segments (can be changed later)
    }
  
    render() {
      const [x, y] = this.position;
      const rgba = this.color;
      const radius = this.size / 200; // Scale for WebGL
      const segments = this.segments;
  
      // Set the uniforms
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      gl.uniform1f(u_Size, this.size); // still used for consistency
  
      // Generate vertices for a triangle fan
      const vertices = [];
      vertices.push(x, y); // Center of circle
  
      for (let i = 0; i <= segments; i++) {
        const angle = (i * 2 * Math.PI) / segments;
        const xPos = x + Math.cos(angle) * radius;
        const yPos = y + Math.sin(angle) * radius;
        vertices.push(xPos, yPos);
      }
  
      drawCircle(vertices);
    }
  }

  function drawCircle(vertices) {
    const n = vertices.length / 2;
  
    const vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }
  
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
  
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);
  
    gl.drawArrays(gl.TRIANGLE_FAN, 0, n); // This is what makes it a circle
  }
  