class World {
  constructor() {
    this.blocks = {}; // or your current storage method
  }

  setBlock(x, y, z, type) {
    const key = `${x},${y},${z}`;
    if (type === 0) {
      delete this.blocks[key];
    } else {
      this.blocks[key] = type;
    }
    this.rebuildMesh(); // or trigger re-rendering
  }
}
