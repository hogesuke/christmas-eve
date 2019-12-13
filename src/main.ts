import {
  WebGLRenderer,
  PerspectiveCamera,
  Mesh,
  MeshBasicMaterial,
  SpriteMaterial,
  Scene,
  PointLight,
  SphereBufferGeometry,
  Vector2,
  Vector3,
  FontLoader,
  Font,
  Texture,
  TextureLoader,
} from 'three';
import { DeviceOrientationControls } from './DeviceOrientationControls';
import { OrbitControls } from './OrbitControls';
import MessageMeshFactory from './MessageMeshFactory';
import MessageMesh from './MessageMesh';
import CommitLog from './CommitLog';
import Snow from './Snow';

class Canvas {
  private w: number;
  private h: number;
  private mouse: Vector2;
  private renderer: WebGLRenderer;
  private camera: PerspectiveCamera;
  private scene: Scene;
  private light: PointLight;
  private controls: DeviceOrientationControls | OrbitControls;
  private messageMeshes: MessageMesh[] = [];
  private snowParticles: Snow[] = [];
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

    // Controls
    const isAndroid = /Android/.test(navigator.userAgent);
    const isIOS = /(iPad|iPhone|iPod)/.test(navigator.userAgent);

    if (isAndroid || isIOS) {
      this.controls = new DeviceOrientationControls(this.camera);
      this.controls.connect();
    } else {
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.target.set(0, 0, 1);
      this.controls.autoRotate = true;
      this.controls.enableDamping = true;
      this.controls.autoRotateSpeed = 0.8
      this.controls.rotateSpeed = -0.3;
      this.controls.dampingFactor = 0.1;
      this.controls.screenSpacePanning = false;
      this.controls.minDistance = 1;
      this.controls.maxDistance = 1;
      this.controls.maxPolarAngle = Math.PI;
    }

    // ライトを作成
    this.light = new PointLight(0x00ffff);
    this.light.position.set(0, 0, 400); // ライトの位置を設定

    // ライトをシーンに追加
    this.scene.add(this.light);

    // フォント
    const font = await new Promise<Font>(resolve => {
      // loader.load('Sawarabi_Mincho_Regular.json', resolve);
      new FontLoader().load('helvetiker_regular.typeface.json', resolve);
    });

    // テクスチャ
    const texture = await new Promise<Texture>(resolve => {
      new TextureLoader().load('360_night01_1200-min.jpg', resolve);
    });

    const messageMeshFactory = new MessageMeshFactory(font);

    for (let i = 0; i < 30; i++) {
      const commitLog = new CommitLog(`#${i}`);
      const messageMesh = messageMeshFactory.createMesh(commitLog);

      const x = Math.floor(Math.random() * 2000) - 1000;
      const y = Math.floor(Math.random() * 1000);
      const z = Math.floor(Math.random() * 2000) - 1000;

      messageMesh.setInitialPosition(x, y, z);

      this.scene.add(messageMesh.getRawMesh());
      this.messageMeshes.push(messageMesh);
    }

    const geometry = new SphereBufferGeometry(1000, 32, 32);
    geometry.scale(-1, 1, 1);

    const material = new MeshBasicMaterial({ map: texture });

    const mesh = new Mesh(geometry, material);

    this.scene.add(mesh);

    // 雪
    const particleImage = await new Promise<Texture>(resolve => {
      new TextureLoader().load('snow2.png', resolve);
    });

    const spriteMaterial = new SpriteMaterial({ map: particleImage });

    for (var i = 0; i < 2000; i++) {
      const snow = new Snow(spriteMaterial);
      snow.position.x = Math.random() * 2000 - 1000;
      snow.position.y = Math.random() * 2000 - 1000;
      snow.position.z = Math.random() * 2000 - 1000;
      snow.scale.set(4, 4, 1);

      this.scene.add(snow);
      this.snowParticles.push(snow);
    }

    // 描画ループを開始
    this.render();
  }

  render () {
    requestAnimationFrame(() => { this.render() });

    const currentTimestamp = performance.now();
    const sec = (currentTimestamp - this.prevTimestamp) / 1000;

    this.prevTimestamp = currentTimestamp;

    this.messageMeshes.forEach(a => {
      if (a.getRawMesh().position.y < -1000) {
        a.setPositionY(a.getInitialPosition().y)
      } else {
        a.setPositionY(a.getRawMesh().position.y - sec * 100)
      }
    });

    this.snowParticles.forEach((particle) => {
      particle.updatePhysics();

      const p = particle.position;

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
