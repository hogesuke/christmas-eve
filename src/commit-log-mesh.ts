import * as THREE from 'three';

export default class CommitLogMesh {
  private mesh: THREE.Mesh;

  constructor (mesh: THREE.Mesh) {
    this.mesh = mesh;
  }

  getRawMesh () {
    return this.mesh;
  }

  setPosition (x: number, y: number, z: number) {
    this.mesh.position.set(x, y, z);
  }

  setPositionY (y: number) {
    this.mesh.position.y = y;
  }
}