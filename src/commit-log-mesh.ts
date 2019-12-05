import * as THREE from 'three';

export default class CommitLogMesh {
  private mesh: THREE.Mesh;
  private initialPosition: { x: number, y: number, z: number };

  constructor (mesh: THREE.Mesh) {
    this.mesh = mesh;
  }

  getInitialPosition () {
    return this.initialPosition;
  }

  getRawMesh () {
    return this.mesh;
  }

  setInitialPosition (x: number, y: number, z: number) {
    this.mesh.position.set(x, y, z);
    this.initialPosition = { x, y, z };
  }

  setPositionY (y: number) {
    this.mesh.position.y = y;
  }
}