import * as THREE from 'three';
import { Vector2 } from 'three';
import SnowMeshFactory from './snow-mesh-factory';
import CommitLogMesh from './snow-mesh';
import CommitLog from './commit-log';

class Canvas {
  private w: number;
  private h: number;
  private mouse: Vector2;
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private scene: THREE.Scene;
  private light: THREE.PointLight;
  private geo: THREE.BoxGeometry;
  private snowMeshes: CommitLogMesh[] = [];

  constructor (w: number, h: number) {
    // ウィンドウサイズ
    this.w = w;
    this.h = h;
  }

  async run () {
    // マウス座標
    this.mouse = new Vector2(0, 0);

    // レンダラーを作成
    this.renderer = new THREE.WebGLRenderer({ alpha: true });
    this.renderer.setSize(this.w, this.h); // 描画サイズ
    this.renderer.setPixelRatio(window.devicePixelRatio);

    // #canvas-containerにレンダラーのcanvasを追加
    const container = document.getElementById("canvas-container");
    container.appendChild(this.renderer.domElement);

    // 視野角をラジアンに変換
    const fov    = 60;
    const fovRad = (fov / 2) * (Math.PI / 180);

    // 途中式
    // Math.tan(favRad)        = (height / 2) / dist;
    // Math.tan(favRad) * dist = (height / 2);
    const dist = (this.h / 2) / Math.tan(fovRad);

    // カメラを作成（視野角、画面のアスペクト比、カメラに映る最短距離、カメラに映る再遠距離）
    this.camera = new THREE.PerspectiveCamera(fov, this.w / this.h, 1, dist * 2);
    this.camera.position.z = dist; // カメラを遠ざける

    // シーンを作成
    this.scene = new THREE.Scene();

    // ライトを作成
    this.light = new THREE.PointLight(0x00ffff);
    this.light.position.set(0, 0, 400); // ライトの位置を設定

    // ライトをシーンに追加
    this.scene.add(this.light);

    // 立方体のジオメトリを作成（幅、高さ、奥行き）
    const geo = new THREE.BoxGeometry(300, 300, 300);

    const loader = new THREE.FontLoader();

    const font = await new Promise<THREE.Font>(resolve => {
      loader.load('Sawarabi_Mincho_Regular.json', resolve);
    });

    const snowMeshFactory = new SnowMeshFactory(font);

    for (let i = 0; i < 300; i++) {
      const commitLog = new CommitLog(`#${i}`);
      const snowMesh = snowMeshFactory.createMesh(commitLog);

      const x = Math.floor(Math.random() * 2000) - 1000;
      const y = Math.floor(Math.random() * 1000);
      const z = Math.floor(Math.random() * 2000) - 1000;

      snowMesh.setInitialPosition(x, y, z);

      this.scene.add(snowMesh.getRawMesh());
      this.snowMeshes.push(snowMesh);
    }


    // 描画ループを開始
    this.render();
  }

  render () {
    requestAnimationFrame(() => { this.render() });

    const sec = performance.now() / 1000;

    this.snowMeshes.forEach(a => a.setPositionY(a.getInitialPosition().y - sec * 100));

    this.renderer.render(this.scene, this.camera);
  }

  mouseMoved (x, y) {
    this.mouse.x = x - (this.w / 2); // 原点を中心に持ってくる
    this.mouse.y = -y + (this.h / 2); // 軸を反転して原点を中心に持ってくる

    this.light.position.x = this.mouse.x;
    this.light.position.y = this.mouse.y;
  }
}

const canvas = new Canvas(window.innerWidth, window.innerHeight);
canvas.run();
