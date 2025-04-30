class Cube {
    constructor(color = [1.0, 1.0, 1.0, 1.0]) {
      this.type = 'cube';
      this.color = color;
      this.matrix = new Matrix4();
    }
  
    render() {
      const faceColors = [
        1.0,   // Front
        0.9,   // Right
        0.85,  // Back
        0.8,   // Left
        0.95,  // Top
        0.7    // Bottom
      ];
  
      const faces = [
        [0, 0, 0,   1, 1, 0,   1, 0, 0],
        [0, 0, 0,   0, 1, 0,   1, 1, 0],
  
        [1, 0, 0,   1, 1, 0,   1, 1, 1],
        [1, 0, 0,   1, 1, 1,   1, 0, 1],
  
        [1, 0, 1,   1, 1, 1,   0, 1, 1],
        [1, 0, 1,   0, 1, 1,   0, 0, 1],
  
        [0, 0, 1,   0, 1, 1,   0, 1, 0],
        [0, 0, 1,   0, 1, 0,   0, 0, 0],
  
        [0, 1, 0,   0, 1, 1,   1, 1, 1],
        [0, 1, 0,   1, 1, 1,   1, 1, 0],
  
        [0, 0, 0,   1, 0, 0,   1, 0, 1],
        [0, 0, 0,   1, 0, 1,   0, 0, 1],
      ];
  
      gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
  
      for (let i = 0; i < faces.length; i++) {
        const shade = faceColors[Math.floor(i / 2)];
        gl.uniform4f(u_FragColor,
          this.color[0] * shade,
          this.color[1] * shade,
          this.color[2] * shade,
          this.color[3]
        );
        drawTriangle3D(faces[i]);
      }
    }
  }
  