import {
  Geometry,
  BufferGeometry,
  Material,
  Mesh
} from 'three';

export default class MessageMesh extends Mesh {
  private coefficient: number;
  private originalPosition: { x: number, y: number, z: number };

  constructor (
    geometry: Geometry | BufferGeometry,
    material: Material | Material[],
    coefficient: number
  ) {
    super(geometry, material);

    this.coefficient = coefficient;

    this.setRandomOriginalPosition();
  }

  tick (sec: number) {
    if (this.position.y < -2000 + this.complement) {
      this.position.y = this.originalPosition.y
    } else {
      this.position.y = this.position.y - sec * 100;
    }
  }

  private get complement () {
    return 500 + 500 * this.coefficient;
  }

  private setRandomOriginalPosition () {
    const x = Math.floor(Math.random() * 2000) - 1000;
    const y = Math.floor(Math.random() * 1000) + this.complement;
    const z = Math.floor(Math.random() * 2000) - 1000;
    const rotationY = Math.random() * Math.PI;

    this.originalPosition = { x, y, z};
    this.position.set(x, y, z);
    this.rotateY(rotationY);
  }
}