import {
  WebGLRenderer,
  PerspectiveCamera,
  Mesh,
  MeshBasicMaterial,
  SpriteMaterial,
  Scene,
  PointLight,
  SphereBufferGeometry,
  Vector3,
  LoadingManager,
  FontLoader,
  Font,
  Texture,
  TextureLoader,
} from 'three';
import { DeviceOrientationControls } from './DeviceOrientationControls';
import { OrbitControls } from './OrbitControls';
import MessageMeshFactory from './MessageMeshFactory';
import MessageMesh from './MessageMesh';
import CommitLoader from './CommitLoader';
import SnowSprite from './SnowSprite';

class Canvas {
  private w: number;
  private h: number;
  private loadingManager: LoadingManager;
  private commitLoader: CommitLoader;
  private font: Font;
  private backgroundTexture: Texture;
  private snowImage: Texture;
  private repositoryInput: HTMLInputElement;
  private renderer: WebGLRenderer;
  private camera: PerspectiveCamera;
  private scene: Scene;
  private light: PointLight;
  private controls: DeviceOrientationControls | OrbitControls;
  private messageMeshFactory: MessageMeshFactory;
  private messageMeshes: MessageMesh[] = [];
  private snowSprites: SnowSprite[] = [];
  private prevTimestamp: DOMHighResTimeStamp = 0;
  private readonly DEFAULT_REPO = 'hogesuke/gited';

  constructor (w: number, h: number) {
    // ウィンドウサイズ
    this.w = w;
    this.h = h;

    this.loadingManager = new LoadingManager();
    this.commitLoader = new CommitLoader(process.env.API_ROOT);

    this.repositoryInput = document.querySelector<HTMLInputElement>('.repository-input');
    this.repositoryInput.addEventListener('keypress',this.onPressEnter.bind(this));
    this.repositoryInput.value = this.DEFAULT_REPO;
  }

  async loadAssets () {
    const promise = new Promise((resolve, reject) => {
      this.loadingManager.onLoad = () => {
        resolve();
        console.log('Loading complete!');
      };

      this.loadingManager.onError = (url) => {
        reject();
        console.log('There was an error loading ' + url);
      };
    });

    this.loadingManager.onStart = (url, itemsLoaded, itemsTotal) => {
      console.log('Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
    };

    this.loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
      console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
    };

    // 背景
    new TextureLoader(this.loadingManager).load('360_night01_1200-min.jpg', texture => this.backgroundTexture = texture);

    // 雪
    new TextureLoader(this.loadingManager).load('snow2.png', texture => this.snowImage = texture);

    // フォント
    new FontLoader(this.loadingManager).load('helvetiker_regular.typeface.json', font => this.font = font);

    return promise;
  }

  init () {
    // レンダラーを作成
    this.renderer = new WebGLRenderer({ alpha: true });
    // this.renderer.setClearColor(0x000000, 1);

    // canvasを追加
    const container = document.getElementById("canvas-container");
    container.appendChild(this.renderer.domElement);

    // シーンを作成
    this.scene = new Scene();

    // カメラを作成
    this.camera = new PerspectiveCamera();
    this.camera.fov = 60; // 視野角
    this.camera.near = 1; // カメラに映る最短距離
    this.camera.far = 2100; // カメラに映る再遠距離
    this.camera.lookAt(new Vector3( 0, 0, 0 ));

    this.onResize();

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
    this.light = new PointLight(0xffffff);
    this.light.position.set(0, 0, 0); // ライトの位置を設定

    this.scene.add(this.light);

    // メッセージ
    this.messageMeshFactory = new MessageMeshFactory(this.font);

    this.refreshCommitMeshes(this.DEFAULT_REPO);

    // 背景
    const geometry = new SphereBufferGeometry(2000, 32, 32);
    geometry.scale(-1, 1, 1);

    const material = new MeshBasicMaterial({ map: this.backgroundTexture, color: 0x777777 });
    const mesh = new Mesh(geometry, material);

    this.scene.add(mesh);

    // 雪
    const spriteMaterial = new SpriteMaterial({ map: this.snowImage });

    for (var i = 0; i < 2000; i++) {
      const snowSprite = new SnowSprite(spriteMaterial);
      this.scene.add(snowSprite);
      this.snowSprites.push(snowSprite);
    }

    // イベント
    window.addEventListener('resize', this.onResize.bind(this));
  }

  render () {
    requestAnimationFrame(() => { this.render() });

    const currentTimestamp = performance.now();
    const sec = (currentTimestamp - this.prevTimestamp) / 1000;

    this.prevTimestamp = currentTimestamp;

    this.messageMeshes.forEach(a => {
      // a.rotation.y = a.rotation.y + sec * 0.5;

      if (a.position.y < -1000) {
        a.position.y = a.getOriginalPosition().y
      } else {
        a.position.y = a.position.y - sec * 100;
      }
    });

    this.snowSprites.forEach((particle) => {
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

  async refreshCommitMeshes (repository: string) {
    const commits = await this.commitLoader.load(repository);

    this.messageMeshes.forEach(a => this.scene.remove(a));
    this.messageMeshes = [];

    commits.forEach(commit => {
      const messageMesh = this.messageMeshFactory.createMesh(commit);
      this.messageMeshes.push(messageMesh);
    });
    this.scene.add(...this.messageMeshes);
  }

  onPressEnter (e: KeyboardEvent) {
    if (e.keyCode !== 13) { return; }

    this.refreshCommitMeshes(this.repositoryInput.value)
  }

  onResize () {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }
}

const canvas = new Canvas(window.innerWidth, window.innerHeight);

(async () => {
  await canvas.loadAssets();

  canvas.init();
  canvas.render();

  const mainElement = document.getElementById('main');
  mainElement.classList.add('hide');
})()