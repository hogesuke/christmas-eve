import {
  Geometry,
  BufferGeometry,
  Material,
  Mesh
} from 'three';

export default class MessageMesh extends Mesh {
  private originalPosition: { x: number, y: number, z: number };

  constructor (
    geometry: Geometry | BufferGeometry,
    material: Material | Material[]
  ) {
    super(geometry, material);
  }

  getOriginalPosition () {
    return this.originalPosition;
  }

  setInitialPosition (x: number, y: number, z: number) {
    this.position.set(x, y, z);
    this.originalPosition = { x, y, z };
  }

  setPositionY (y: number) {
    this.position.y = y;
  }
}