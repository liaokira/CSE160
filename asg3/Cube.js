class Cube {
    constructor(color = [1.0, 1.0, 1.0, 1.0]) {
        this.type = 'cube';
        this.color = color;
        this.matrix = new Matrix4();
        this.textureNum = -1;
    }

    render() {
        const faces = [
            // Front face (z = 1)
            { verts: [0, 0, 1, 1, 1, 1, 1, 0, 1], uv: [1, 0, 0, 1, 1, 1] },
            { verts: [0, 0, 1, 0, 1, 1, 1, 1, 1], uv: [1, 0, 0, 0, 0, 1] },
            
            // Back face (z = 0)
            { verts: [1, 0, 0, 0, 1, 0, 0, 0, 0], uv: [1, 0, 0, 1, 0, 0] },
            { verts: [1, 0, 0, 1, 1, 0, 0, 1, 0], uv: [1, 0, 1, 1, 0, 1] },
            
            // Top face (y = 1)
            { verts: [0, 1, 0, 1, 1, 1, 1, 1, 0], uv: [0, 1, 1, 0, 1, 1] },
            { verts: [0, 1, 0, 0, 1, 1, 1, 1, 1], uv: [0, 1, 0, 0, 1, 0] },
            
            // Bottom face (y = 0)
            { verts: [0, 0, 0, 1, 0, 0, 1, 0, 1], uv: [0, 0, 1, 0, 1, 1] },
            { verts: [0, 0, 0, 1, 0, 1, 0, 0, 1], uv: [0, 0, 1, 1, 0, 1] },
            
            // Right face (x = 1)
            { verts: [1, 0, 0, 1, 1, 0, 1, 1, 1], uv: [1, 0, 1, 1, 0, 1] },
            { verts: [1, 0, 0, 1, 1, 1, 1, 0, 1], uv: [1, 0, 0, 1, 0, 0] },
            
            // Left face (x = 0)
            { verts: [0, 0, 0, 0, 1, 1, 0, 1, 0], uv: [0, 0, 1, 1, 0, 1] },
            { verts: [0, 0, 0, 0, 0, 1, 0, 1, 1], uv: [0, 0, 1, 0, 1, 1] }
        ];

        gl.uniform1i(u_whichTexture, this.textureNum);
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        // If using a solid color instead of texture
        if (this.textureNum == -2) {
            gl.uniform4f(u_FragColor, ...this.color);
        }

        for (let i = 0; i < faces.length; i++) {
            // Only set color if not using texture
            if (this.textureNum < 0) {
                gl.uniform4f(u_FragColor, ...this.color);
            }
            drawTriangle3DUV(faces[i].verts, faces[i].uv);
        }
    }
}