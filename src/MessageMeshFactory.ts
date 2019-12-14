import {
  MeshBasicMaterial,
  TextGeometry,
  Font
} from 'three';
import * as chroma from 'chroma-js';
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
      height: 5,
      curveSegments: 10 // 曲線に使用する点の数
    });

    const color = chroma.random().saturate(Math.floor(Math.random() * 3) + 1);

    const materials = [
      new MeshBasicMaterial({ color: color.num() }),
      new MeshBasicMaterial({ color: color.darken().num() })
    ];

    return new MessageMesh(textGeometry, materials);
  }
}