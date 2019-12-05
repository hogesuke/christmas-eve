import * as THREE from 'three';
import CommitLog from './commit-log';
import SnowMesh from './snow-mesh';

export default class SnowMeshFactory {
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

    return new SnowMesh(new THREE.Mesh(textGeometry, materials));
  }
}