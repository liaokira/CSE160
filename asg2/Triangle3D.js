class Triangle3D {
  constructor(p1, p2, p3, height = 0.1, color = [1.0, 1.0, 1.0, 1.0], matrix = new Matrix4()) {
    this.p1 = p1;
    this.p2 = p2;
    this.p3 = p3;
    this.height = height;
    this.color = color;
    this.matrix = matrix;
  }

  render() {
    const top = [this.p1, this.p2, this.p3];
    const base = top.map(p => [p[0], p[1], p[2] - this.height]);

    const faces = [
      [top[0], top[1], top[2]],     // Top face
      [base[2], base[1], base[0]],  // Bottom face
      [top[0], top[1], base[1]], [top[0], base[1], base[0]], // Side 1
      [top[1], top[2], base[2]], [top[1], base[2], base[1]], // Side 2
      [top[2], top[0], base[0]], [top[2], base[0], base[2]], // Side 3
    ];

    const faceShades = [
      0.95,  // Top
      0.95,   // Bottom
      0.8, 0.8,   // Side 1
      0.85, 0.85, // Side 2
      0.8, 0.8    // Side 3
    ];

    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    for (let i = 0; i < faces.length; i++) {
      const face = faces[i];
      const shade = faceShades[i];

      const transform = (v) => {
        const vec = new Vector4([...v, 1]);
        const result = this.matrix.multiplyVector4(vec);
        return [result.elements[0], result.elements[1], result.elements[2]];
      };

      const v0 = transform(face[0]);
      const v1 = transform(face[1]);
      const v2 = transform(face[2]);

      gl.uniform4f(
        u_FragColor,
        this.color[0] * shade,
        this.color[1] * shade,
        this.color[2] * shade,
        this.color[3]
      );

      drawTriangle3D([...v0, ...v1, ...v2]);
    }
  }
}