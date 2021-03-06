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

    this.scale.set(4, 4, 1);

    this.setRandomOriginalPosition();
  }

  tick () {
    this.updatePhysics();

    const p = this.position;

    if (p.y < -1000) {
      p.y += 2000;
    }

    if (p.x > 1000) {
      p.x -= 2000;
    } else if (p.x < -1000) {
      p.x += 2000;
    }

    if (p.z > 1000) {
      p.z -= 2000;
    } else if (p.z < -1000) {
      p.z += 2000;
    }
  }

  private updatePhysics () {
    this.velocity.multiplyScalar(this.drag);
    this.velocity.add(this.gravity);
    this.position.add(this.velocity);
  }

  private randomRange (min: number, max: number) {
    return ((Math.random() * (max - min)) + min);
  }

  private setRandomOriginalPosition () {
    this.position.x = Math.random() * 2000 - 1000;
    this.position.y = Math.random() * 2000 - 1000;
    this.position.z = Math.random() * 2000 - 1000;
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
