import {
  WebGLRenderer,
  PerspectiveCamera,
  Mesh,
  MeshBasicMaterial,
  Scene,
  PointLight,
  BoxGeometry,
  SphereBufferGeometry,
  Vector2,
  Vector3,
  FontLoader,
  Font,
  Texture,
  ImageUtils,
  UVMapping
} from 'three';
import { DeviceOrientationControls } from './DeviceOrientationControls';
import SnowMeshFactory from './snow-mesh-factory';
import CommitLogMesh from './snow-mesh';
import CommitLog from './commit-log';

class Canvas {
  private w: number;
  private h: number;
  private mouse: Vector2;
  private renderer: WebGLRenderer;
  private camera: PerspectiveCamera;
  private scene: Scene;
  private light: PointLight;
  private controls: DeviceOrientationControls;
  private geo: BoxGeometry;
  private snowMeshes: CommitLogMesh[] = [];
  private prevTimestamp: DOMHighResTimeStamp = 0;

  constructor (w: number, h: number) {
    // ウィンドウサイズ
    this.w = w;
    this.h = h;
  }

  async run () {
    // マウス座標
    this.mouse = new Vector2(0, 0);

    // レンダラーを作成
    this.renderer = new WebGLRenderer({ alpha: true });
    this.renderer.setSize(this.w, this.h); // 描画サイズ
    // this.renderer.setClearColor(0x000000, 1);
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

    // シーンを作成
    this.scene = new Scene();

    // カメラを作成（視野角、画面のアスペクト比、カメラに映る最短距離、カメラに映る再遠距離）
    this.camera = new PerspectiveCamera(fov, this.w / this.h, 1, dist * 2);
    this.camera.lookAt(new Vector3( 0, 0, 0 ));

    // ジャイロ
    this.controls = new DeviceOrientationControls(this.camera);
    this.controls.connect();

    // ライトを作成
    this.light = new PointLight(0x00ffff);
    this.light.position.set(0, 0, 400); // ライトの位置を設定

    // ライトをシーンに追加
    this.scene.add(this.light);

    // フォント
    const loader = new FontLoader();

    const font = await new Promise<Font>(resolve => {
      // loader.load('Sawarabi_Mincho_Regular.json', resolve);
      loader.load('helvetiker_regular.typeface.json', resolve);
    });

    // テクスチャ
    const texture = await new Promise<Texture>(resolve => {
      ImageUtils.loadTexture('360_night01_1200-min.jpg', UVMapping, resolve);
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

    const geometry = new SphereBufferGeometry(1000, 32, 32);
    geometry.scale(-1, 1, 1);

    const material = new MeshBasicMaterial({ map: texture });

    const mesh = new Mesh(geometry, material);

    this.scene.add(mesh);

    // 描画ループを開始
    this.render();
  }

  render () {
    requestAnimationFrame(() => { this.render() });

    const currentTimestamp = performance.now();
    const sec = (currentTimestamp - this.prevTimestamp) / 1000;

    this.prevTimestamp = currentTimestamp;

    this.snowMeshes.forEach(a => {
      if (a.getRawMesh().position.y < -1000) {
        a.setPositionY(a.getInitialPosition().y)
      } else {
        a.setPositionY(a.getRawMesh().position.y - sec * 100)
      }
    });

    this.controls.update();

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
