import * as THREE from 'three';
import MessageMeshFactory from './MessageMeshFactory';
import Commit from './Commit';

self.addEventListener('message', (event) => {
  const fontJSON = JSON.parse(event.data.fontJSON);

  const font = new THREE.Font(fontJSON);
  const factory = new MessageMeshFactory(font);

  const messageMeshes = event.data.commits.map(commit => {
    const c = new Commit(commit.message);
    return factory.createMesh(c);
  });

  self.postMessage({ messageMeshes: JSON.stringify(messageMeshes) });
});