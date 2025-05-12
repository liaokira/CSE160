class CubeBatch {
  constructor() {
    this.vertices = [];
    this.uvs = [];
    this.textureNum = -1; // Default texture for the whole batch
  }

  addCube(x, y, z, scale = 1) {
    const s = scale / 2;
    const cubeVertices = [
      // front
      -s, -s,  s,   s, -s,  s,   s,  s,  s,  -s, -s,  s,   s,  s,  s,  -s,  s,  s,
      // back
      -s, -s, -s,  -s,  s, -s,   s,  s, -s,  -s, -s, -s,   s,  s, -s,   s, -s, -s,
      // top
      -s,  s, -s,  -s,  s,  s,   s,  s,  s,  -s,  s, -s,   s,  s,  s,   s,  s, -s,
      // bottom
      -s, -s, -s,   s, -s, -s,   s, -s,  s,  -s, -s, -s,   s, -s,  s,  -s, -s,  s,
      // right
       s, -s, -s,   s,  s, -s,   s,  s,  s,   s, -s, -s,   s,  s,  s,   s, -s,  s,
      // left
      -s, -s, -s,  -s, -s,  s,  -s,  s,  s,  -s, -s, -s,  -s,  s,  s,  -s,  s, -s,
    ];

    const uv = [
      0, 0, 1, 0, 1, 1,  0, 0, 1, 1, 0, 1,
      0, 0, 1, 1, 1, 0,  0, 0, 1, 1, 0, 1,
      0, 0, 1, 0, 1, 1,  0, 0, 1, 1, 0, 1,
      0, 0, 1, 0, 1, 1,  0, 0, 1, 1, 0, 1,
      0, 0, 1, 0, 1, 1,  0, 0, 1, 1, 0, 1,
      0, 0, 1, 0, 1, 1,  0, 0, 1, 1, 0, 1,
    ];

    for (let i = 0; i < cubeVertices.length; i += 3) {
      this.vertices.push(cubeVertices[i] + x);
      this.vertices.push(cubeVertices[i + 1] + y);
      this.vertices.push(cubeVertices[i + 2] + z);
    }

    this.uvs.push(...uv);
  }

  finalizeAndRender(overrideTextureNum = null) {
    const textureToUse = overrideTextureNum !== null ? overrideTextureNum : this.textureNum;

    const vertexBuffer = gl.createBuffer();
    const uvBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.uvs), gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_UV);

    gl.uniform1i(u_whichTexture, textureToUse);
    gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length / 3);
  }
}
