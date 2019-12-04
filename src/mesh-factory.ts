import * as THREE from 'three';
import CommitLog from './commit-log';

export default class MeshFactory {
  private font: THREE.Font;

  constructor (font: THREE.Font) {
    this.font = font;
  }

  createMesh (commitLog: CommitLog) {
    const textGeometry = new THREE.TextGeometry(commitLog.getMessage(), {
      font: this.font,
      size: 20,
      height: 0,
      curveSegments: 10 // 曲線に使用する点の数
    });

    const materials = [
      new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff }),
      new THREE.MeshBasicMaterial({ color: 0x000000 })
    ];

    const mesh = new THREE.Mesh(textGeometry, materials);
    mesh.rotation.x = -0.8;

    return mesh;
  }
}