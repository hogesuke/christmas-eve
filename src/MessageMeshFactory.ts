import {
  MeshBasicMaterial,
  TextGeometry,
  Font
} from 'three';
import CommitLog from './CommitLog';
import MessageMesh from './MessageMesh';

export default class MessageMeshFactory {
  private font: Font;

  constructor (font: Font) {
    this.font = font;
  }

  createMesh (commitLog: CommitLog) {
    const textGeometry = new TextGeometry(commitLog.getMessage(), {
      font: this.font,
      size: 20,
      height: 0,
      curveSegments: 10 // 曲線に使用する点の数
    });

    const materials = [
      new MeshBasicMaterial({ color: Math.random() * 0xffffff }),
      new MeshBasicMaterial({ color: 0x000000 })
    ];

    return new MessageMesh(textGeometry, materials);
  }
}