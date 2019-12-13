import { Mesh } from 'three';

export default class MessageMesh {
  private mesh: Mesh;
  private initialPosition: { x: number, y: number, z: number };

  constructor (mesh: Mesh) {
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