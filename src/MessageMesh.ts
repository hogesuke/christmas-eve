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

    this.setRandomOriginalPosition();
  }

  getOriginalPosition () {
    return this.originalPosition;
  }

  setPositionY (y: number) {
    this.position.y = y;
  }

  private setRandomOriginalPosition () {
    const x = Math.floor(Math.random() * 2000) - 1000;
    const y = Math.floor(Math.random() * 1000);
    const z = Math.floor(Math.random() * 2000) - 1000;
    const rotationY = Math.random() * Math.PI;

    this.originalPosition = { x, y, z};
    this.position.set(x, y, z);
    this.rotateY(rotationY);
  }
}