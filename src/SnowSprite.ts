import {
  Vector3,
  Sprite,
  SpriteMaterial,
} from 'three';

export default class SnowSprite extends Sprite {
  private velocity = new SnowVector3(0, -4, 0);
  private gravity = new SnowVector3(0, 0, 0);
  private drag = 1;

  constructor (material: SpriteMaterial) {
    super(material);

    this.velocity.rotateX(this.randomRange(-20, 20));
    this.velocity.rotateY(this.randomRange(0, 360));
  }

  updatePhysics () {
    this.velocity.multiplyScalar(this.drag);
    this.velocity.add(this.gravity);
    this.position.add(this.velocity);
  }

  private randomRange (min: number, max: number) {
    return ((Math.random() * (max - min)) + min);
  }
}

class SnowVector3 extends Vector3 {
  private readonly TO_RADIANS = Math.PI / 180;

  rotateY (angle: number) {
    const cosRY = Math.cos(angle * this.TO_RADIANS);
    const sinRY = Math.sin(angle * this.TO_RADIANS);

    const tempz = this.z;
    const tempx = this.x;

    this.x = (tempx * cosRY) + (tempz * sinRY);
    this.z = (tempx * -sinRY) + (tempz * cosRY);
  }

  rotateX (angle: number) {
    const cosRY = Math.cos(angle * this.TO_RADIANS);
    const sinRY = Math.sin(angle * this.TO_RADIANS);

    const tempz = this.z;
    const tempy = this.y;

    this.y = (tempy * cosRY) + (tempz * sinRY);
    this.z = (tempy * -sinRY) + (tempz * cosRY);
  }

  rotateZ (angle: number) {
    const cosRY = Math.cos(angle * this.TO_RADIANS);
    const sinRY = Math.sin(angle * this.TO_RADIANS);

    const tempx = this.x;
    const tempy = this.y;

    this.y = (tempy * cosRY) + (tempx * sinRY);
    this.x = (tempy * -sinRY) + (tempx * cosRY);
  }
}
