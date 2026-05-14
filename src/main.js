import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import './styles.css';

const stamps = [
  { set: '普23', name: '内蒙民居', value: '1分', region: '内蒙古', type: 'yurt', palette: ['#ece8d8', '#b33a2f', '#3e6d7c'], year: '1986' },
  { set: '普23', name: '西藏民居', value: '1.5分', region: '西藏', type: 'plateau', palette: ['#9f5535', '#efe4ca', '#334f5c'], year: '1986' },
  { set: '普23', name: '东北民居', value: '2分', region: '东北', type: 'snow', palette: ['#6d241b', '#f2efe6', '#40596b'], year: '1986' },
  { set: '普23', name: '湖南民居', value: '3分', region: '湖南', type: 'stilt', palette: ['#5b3426', '#d8c7a3', '#3f5f55'], year: '1986' },
  { set: '普23', name: '江苏民居', value: '4分', region: '江苏', type: 'water', palette: ['#28343c', '#e9e3d1', '#4f7f89'], year: '1986' },
  { set: '普23', name: '北京民居', value: '8分', region: '北京', type: 'courtyard', palette: ['#7a2e26', '#d8c8a8', '#2f4b5c'], year: '1986' },
  { set: '普23', name: '云南民居', value: '10分', region: '云南', type: 'dai', palette: ['#8b4d2f', '#e6cf94', '#547052'], year: '1986' },
  { set: '普23', name: '上海民居', value: '20分', region: '上海', type: 'lane', palette: ['#73342c', '#d6bea2', '#54656d'], year: '1986' },
  { set: '普23', name: '安徽民居', value: '30分', region: '安徽', type: 'hui', palette: ['#1f2d31', '#f0eadb', '#57706f'], year: '1986' },
  { set: '普23', name: '陕北民居', value: '40分', region: '陕西', type: 'cave', palette: ['#9b673d', '#d8b377', '#586f5b'], year: '1986' },
  { set: '普23', name: '四川民居', value: '50分', region: '四川', type: 'courtyard', palette: ['#684131', '#d2bd91', '#49665b'], year: '1986' },
  { set: '普23', name: '台湾民居', value: '90分', region: '台湾', type: 'southern', palette: ['#8b2f26', '#e5d3ab', '#35536b'], year: '1986' },
  { set: '普23', name: '福建民居', value: '1元', region: '福建', type: 'tulou', palette: ['#8f5632', '#cfa36c', '#3b5f61'], year: '1986' },
  { set: '普23', name: '浙江民居', value: '1.10元', region: '浙江', type: 'water', palette: ['#26333a', '#ece6d8', '#698c8c'], year: '1986' },
  { set: '普25', name: '青海民居', value: '1.30元', region: '青海', type: 'plateau', palette: ['#795239', '#e4d0a1', '#3c6075'], year: '1989' },
  { set: '普25', name: '贵州民居', value: '1.60元', region: '贵州', type: 'stilt', palette: ['#594136', '#d8c09a', '#446b56'], year: '1989' },
  { set: '普26', name: '广西民居', value: '15分', region: '广西', type: 'stilt', palette: ['#5a382c', '#dfc69c', '#41665f'], year: '1990' },
  { set: '普26', name: '宁夏民居', value: '25分', region: '宁夏', type: 'northwest', palette: ['#ad7645', '#e2c28b', '#536b60'], year: '1990' },
  { set: '普26', name: '山西民居', value: '80分', region: '山西', type: 'courtyard', palette: ['#7b4530', '#d9c095', '#5f6761'], year: '1990' },
  { set: '普27', name: '山东民居', value: '5分', region: '山东', type: 'courtyard', palette: ['#79342f', '#dfcfab', '#4a6670'], year: '1991' },
  { set: '普27', name: '江西民居', value: '2元', region: '江西', type: 'hui', palette: ['#263238', '#ebe3cf', '#7c6b4d'], year: '1991' }
];

const stampGroups = [
  { set: '普23', title: '普23 民居邮票', subtitle: '1986 · 14枚' },
  { set: '普25', title: '普25 民居邮票', subtitle: '1989 · 2枚' },
  { set: '普26', title: '普26 民居邮票', subtitle: '1990 · 3枚' },
  { set: '普27', title: '普27 民居邮票', subtitle: '1991 · 2枚' }
];

const app = document.querySelector('#app');
app.innerHTML = `
  <main class="shell">
    <header class="topbar">
      <div class="brand">
        <div>
          <strong>方寸世界</strong>
          <small>中国民居邮票 · 建筑建模资料库</small>
        </div>
      </div>
    </header>

    <aside class="catalog" aria-label="邮票目录">
      <div class="catalog-head">
        <div>
          <p>中国邮政普通邮票</p>
          <h2>中国民居</h2>
        </div>
      </div>
      <div class="stats">
        <span><b>21</b>枚</span>
        <span><b>4</b>组</span>
      </div>
      <div class="stamp-grid" id="stampGrid"></div>
    </aside>

    <section class="workspace">
      <section class="stage-card" aria-label="中国民居邮票 3D 场景">
        <div class="stamp-label">
          <div class="set" id="activeSet">普23</div>
          <h1 id="activeName">内蒙民居</h1>
          <p id="activeMeta">1分 · 内蒙古 · 1986</p>
        </div>
        <canvas id="scene"></canvas>
        <button id="hotspot" class="stamp-hotspot" aria-label="查看蒙古包 3D 模型"><span></span></button>
        <button id="yurtShellHotspot" class="yurt-shell-hotspot" aria-label="查看蒙古包龙骨"><span></span></button>
        <button id="yurtDoorHotspot" class="yurt-door-hotspot" aria-label="进入蒙古包内部"><span></span></button>
        <button id="toonoKnowledgeHotspot" class="knowledge-hotspot blue-knowledge-hotspot" aria-label="陶脑知识点"><span></span></button>
        <button id="domeKnowledgeHotspot" class="knowledge-hotspot blue-knowledge-hotspot" aria-label="低矮穹顶知识点"><span></span></button>
        <button id="doorKnowledgeHotspot" class="knowledge-hotspot blue-knowledge-hotspot" aria-label="门知识点"><span></span></button>
        <button id="shellDomeKnowledgeHotspot" class="knowledge-hotspot blue-knowledge-hotspot" aria-label="穹顶知识点"><span></span></button>
        <button id="shellWallKnowledgeHotspot" class="knowledge-hotspot blue-knowledge-hotspot" aria-label="哈纳知识点"><span></span></button>
        <button id="stoveInteriorHotspot" class="interior-knowledge-hotspot blue-knowledge-hotspot" aria-label="火炉知识点"><span></span></button>
        <button id="daybedInteriorHotspot" class="interior-knowledge-hotspot blue-knowledge-hotspot" aria-label="床榻知识点"><span></span></button>
        <button id="baganaInteriorHotspot" class="interior-knowledge-hotspot blue-knowledge-hotspot" aria-label="巴根知识点"><span></span></button>
        <button id="shrineInteriorHotspot" class="interior-knowledge-hotspot blue-knowledge-hotspot" aria-label="神龛知识点"><span></span></button>
        <button id="backToStamp" class="back-to-stamp" aria-label="返回 2D 邮票">返回</button>
        <aside class="inspector" aria-label="民居建模信息">
          <article class="panel profile-panel">
            <div class="detail-title profile-title">
              <span class="detail-icon" id="detailIcon"></span>
              <div>
                <h3 id="detailName">内蒙民居</h3>
                <p id="detailSubtype">普23 · 1分 · 1986</p>
              </div>
            </div>
            <div class="keyword-tags" id="keywordTags"></div>
          </article>
          <article class="panel map-panel">
            <div class="panel-head">
              <button id="mapProvince">内蒙古</button>
            </div>
            <div class="china-map" id="chinaMap" role="img" aria-label="中国地图高亮省份"></div>
          </article>
          <article class="panel textbook-panel">
            <h3 id="textbookTitle">蒙古包</h3>
            <p id="textbookText"></p>
          </article>
        </aside>
      </section>
    </section>
  </main>
`;

const canvas = document.querySelector('#scene');
const stageCard = document.querySelector('.stage-card');
const hotspot = document.querySelector('#hotspot');
const yurtShellHotspot = document.querySelector('#yurtShellHotspot');
const yurtDoorHotspot = document.querySelector('#yurtDoorHotspot');
const toonoKnowledgeHotspot = document.querySelector('#toonoKnowledgeHotspot');
const domeKnowledgeHotspot = document.querySelector('#domeKnowledgeHotspot');
const doorKnowledgeHotspot = document.querySelector('#doorKnowledgeHotspot');
const shellDomeKnowledgeHotspot = document.querySelector('#shellDomeKnowledgeHotspot');
const shellWallKnowledgeHotspot = document.querySelector('#shellWallKnowledgeHotspot');
const stoveInteriorHotspot = document.querySelector('#stoveInteriorHotspot');
const daybedInteriorHotspot = document.querySelector('#daybedInteriorHotspot');
const baganaInteriorHotspot = document.querySelector('#baganaInteriorHotspot');
const shrineInteriorHotspot = document.querySelector('#shrineInteriorHotspot');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

function makeStageGradientTexture() {
  const gradientCanvas = document.createElement('canvas');
  gradientCanvas.width = 32;
  gradientCanvas.height = 1024;
  const ctx = gradientCanvas.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 0, gradientCanvas.height);
  gradient.addColorStop(0, '#6687a2');
  gradient.addColorStop(0.28, '#8ea0a2');
  gradient.addColorStop(0.5, '#aba994');
  gradient.addColorStop(0.75, '#ae9a78');
  gradient.addColorStop(1, '#947b5b');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, gradientCanvas.width, gradientCanvas.height);
  const texture = new THREE.CanvasTexture(gradientCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearFilter;
  return texture;
}

const scene = new THREE.Scene();
const stageGradientTexture = makeStageGradientTexture();
scene.background = stageGradientTexture;
scene.fog = new THREE.Fog('#99a19c', 17, 39);

const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
camera.position.set(8, 6, 11);

const insideCamera = new THREE.PerspectiveCamera(84, 1, 0.02, 100);
let activeRenderCamera = camera;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.autoRotate = false;
controls.autoRotateSpeed = 0.65;
controls.target.set(0, 1.1, 0);
controls.maxPolarAngle = Math.PI * 0.47;
controls.minDistance = 6.5;
controls.maxDistance = 18;

const ambient = new THREE.HemisphereLight('#fffaf0', '#7f9189', 1.75);
scene.add(ambient);

const sun = new THREE.DirectionalLight('#fff0c9', 3.45);
sun.position.set(4.8, 8.8, 5.6);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
scene.add(sun);

const keyGlow = new THREE.SpotLight('#fff6dd', 2.25, 26, Math.PI * 0.24, 0.62, 1.05);
keyGlow.position.set(-4.6, 9.6, 7.8);
keyGlow.castShadow = true;
keyGlow.shadow.mapSize.set(1024, 1024);
scene.add(keyGlow);

const rimLight = new THREE.DirectionalLight('#c9e2ff', 1.5);
rimLight.position.set(-6.5, 4.6, -5.4);
scene.add(rimLight);

const lowWarmLight = new THREE.PointLight('#ffdca8', 1.15, 18, 1.35);
lowWarmLight.position.set(3.4, 1.8, 4.2);
scene.add(lowWarmLight);

const yurtStoveLight = new THREE.PointLight('#ffb45f', 0, 4.2, 1.8);
yurtStoveLight.castShadow = true;
yurtStoveLight.shadow.mapSize.set(512, 512);
scene.add(yurtStoveLight);

const yurtInteriorTopLight = new THREE.SpotLight('#fff0c0', 0, 5.8, Math.PI * 0.42, 0.82, 1.4);
yurtInteriorTopLight.castShadow = true;
yurtInteriorTopLight.shadow.mapSize.set(512, 512);
scene.add(yurtInteriorTopLight);
scene.add(yurtInteriorTopLight.target);

const root = new THREE.Group();
scene.add(root);

const yurtStageCenter = new THREE.Vector3(-1.35, 0, 0.58);

const gltfLoader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');
gltfLoader.setDRACOLoader(dracoLoader);
gltfLoader.setMeshoptDecoder(MeshoptDecoder);

const floor = new THREE.Mesh(
  new THREE.CylinderGeometry(5.6, 6.1, 0.22, 160),
  new THREE.MeshStandardMaterial({ color: '#eee3c2', roughness: 0.78, transparent: true, opacity: 0.38 })
);
floor.position.set(yurtStageCenter.x, -0.14, yurtStageCenter.z - 0.22);
floor.receiveShadow = true;
root.add(floor);

const lightBeam = new THREE.Mesh(
  new THREE.CircleGeometry(5.2, 128),
  new THREE.MeshBasicMaterial({
    color: '#fff4ca',
    transparent: true,
    opacity: 0.16,
    depthWrite: false,
    side: THREE.DoubleSide
  })
);
lightBeam.rotation.x = -Math.PI / 2;
lightBeam.position.set(yurtStageCenter.x, 0.005, yurtStageCenter.z - 0.22);
root.add(lightBeam);

let current = 0;
let model = new THREE.Group();
root.add(model);
let stampArtwork = null;
let yurtAsset = null;
let yurtLoadStarted = false;
let yurtShellTransparent = false;
let yurtInsideView = false;
let yurtInsideProgress = 0;
let yurtInsideControlsActive = false;
let yurtInsideLookDragging = false;
let yurtInsideLookYaw = 0;
let yurtInsideLookPitch = 0;
let yurtInsideLastX = 0;
let yurtInsideLastY = 0;
let yurtShellTransparentBeforeInside = false;
let revealTarget = 0;
let revealProgress = 0;
let activeMapCode = 'neimenggu';
const frontCameraPosition = new THREE.Vector3(0, 2.8, 9.2);
const frontCameraTarget = new THREE.Vector3(0, 2.8, 0);
const laidCameraPosition = new THREE.Vector3(6.6, 5.2, 9.4);
const laidCameraTarget = new THREE.Vector3(yurtStageCenter.x, 1.78, yurtStageCenter.z - 0.3);
const mobileFrontCameraPosition = new THREE.Vector3(0, 2.65, 10.8);
const compactFrontCameraPosition = new THREE.Vector3(-1.7, 2.8, 12.6);
const mobileLaidCameraPosition = new THREE.Vector3(7.8, 6.0, 12.4);
const activeCameraPosition = new THREE.Vector3();
const activeCameraTarget = new THREE.Vector3();
const yurtInsidePosition = new THREE.Vector3();
const yurtInsideTarget = new THREE.Vector3();
const yurtInsideLookTarget = new THREE.Vector3();
const yurtInsideLookDirection = new THREE.Vector3();
const yurtStoveLightWorld = new THREE.Vector3();
const yurtTopLightWorld = new THREE.Vector3();
const yurtTopLightTargetWorld = new THREE.Vector3();
const yurtInsideLocalPosition = new THREE.Vector3(0.16, -0.085, 0.1);
const yurtInsideLocalTarget = new THREE.Vector3(-0.06, -0.1, 0.0);
const yurtStoveLightLocal = new THREE.Vector3(0.02, -0.13, 0.0);
const yurtTopLightLocal = new THREE.Vector3(0.02, 0.12, 0.0);
const yurtTopLightTargetLocal = new THREE.Vector3(0.02, -0.19, 0.0);
const yurtToonoKnowledgeWorld = new THREE.Vector3();
const yurtDomeKnowledgeWorld = new THREE.Vector3();
const yurtDoorKnowledgeWorld = new THREE.Vector3();
const yurtShellDomeKnowledgeWorld = new THREE.Vector3();
const yurtShellWallKnowledgeWorld = new THREE.Vector3();
const yurtStoveInteriorWorld = new THREE.Vector3();
const yurtDaybedInteriorWorld = new THREE.Vector3();
const yurtBaganaInteriorWorld = new THREE.Vector3();
const yurtShrineInteriorWorld = new THREE.Vector3();
const yurtToonoKnowledgeLocal = new THREE.Vector3(-0.1, 0.23, -0.14);
const yurtDomeKnowledgeLocal = new THREE.Vector3(0.2, 0.06, 0.26);
const yurtDoorKnowledgeLocal = new THREE.Vector3(0.455, -0.105, 0.0);
const yurtShellDomeKnowledgeLocal = new THREE.Vector3(-0.18, 0.06, 0.29);
const yurtShellWallKnowledgeLocal = new THREE.Vector3(0.03, -0.17, 0.42);
const yurtStoveInteriorLocal = new THREE.Vector3(0.008, -0.13, 0.0);
const yurtDaybedInteriorLocal = new THREE.Vector3(-0.33, -0.17, 0.02);
const yurtBaganaInteriorLocal = new THREE.Vector3(0.008, -0.055, 0.11);
const yurtShrineInteriorLocal = new THREE.Vector3(-0.25, -0.09, 0.26);
const stampHotspotWorld = new THREE.Vector3();
const stampHotspotLocal = new THREE.Vector3(-0.48, -0.5, 0.04);
const yurtDoorHotspotWorld = new THREE.Vector3();
const yurtDoorHotspotLocal = new THREE.Vector3(0.435, -0.245, 0);
const yurtDoorWorld = new THREE.Vector3();
const yurtCenterWorld = new THREE.Vector3();
const yurtStoveWorld = new THREE.Vector3();
const yurtStoveHotspotOffset = new THREE.Vector3();
const hotspotCameraDirection = new THREE.Vector3();
const hotspotCameraDelta = new THREE.Vector3();

function material(color, roughness = 0.78) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness: 0.02 });
}

function addBox(group, size, position, color, cast = true) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material(color));
  mesh.position.set(...position);
  mesh.castShadow = cast;
  mesh.receiveShadow = true;
  group.add(mesh);
  return mesh;
}

function addRoof(group, width, depth, height, y, color, x = 0, z = 0) {
  const shape = new THREE.Shape();
  shape.moveTo(-width / 2, 0);
  shape.lineTo(0, height);
  shape.lineTo(width / 2, 0);
  shape.lineTo(-width / 2, 0);
  const geo = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false });
  geo.center();
  const roof = new THREE.Mesh(geo, material(color, 0.82));
  roof.rotation.y = Math.PI / 2;
  roof.position.set(x, y, z);
  roof.castShadow = true;
  roof.receiveShadow = true;
  group.add(roof);
  return roof;
}

function addCylinder(group, radius, height, position, color, segments = 48) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height, segments), material(color));
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);
  return mesh;
}

function addArch(group, x, y, z, color) {
  const shape = new THREE.Shape();
  shape.moveTo(-0.35, -0.45);
  shape.lineTo(-0.35, 0);
  shape.absarc(0, 0, 0.35, Math.PI, 0, true);
  shape.lineTo(0.35, -0.45);
  shape.lineTo(-0.35, -0.45);
  const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.08, bevelEnabled: false });
  const arch = new THREE.Mesh(geo, material(color));
  arch.position.set(x, y, z);
  arch.castShadow = true;
  group.add(arch);
}

function makeDwelling(stamp) {
  const g = new THREE.Group();
  const [accent, wall, trim] = stamp.palette;
  addBox(g, [0.35, 0.08, 3.8], [-2.25, 0.04, 0], accent, false);
  addBox(g, [0.35, 0.08, 3.8], [2.25, 0.04, 0], accent, false);
  addBox(g, [4.7, 0.08, 0.35], [0, 0.04, -1.85], accent, false);
  addBox(g, [4.7, 0.08, 0.35], [0, 0.04, 1.85], accent, false);

  if (stamp.type === 'tulou') {
    addCylinder(g, 1.75, 1.6, [0, 0.8, 0], accent, 72);
    addCylinder(g, 1.18, 1.72, [0, 0.86, 0], '#d6be85', 72).material.side = THREE.BackSide;
    addCylinder(g, 1.92, 0.2, [0, 1.72, 0], trim, 72);
    addRoof(g, 4.2, 4.2, 0.75, 2.05, trim);
    for (let i = 0; i < 16; i += 1) {
      const a = (i / 16) * Math.PI * 2;
      addBox(g, [0.16, 0.24, 0.05], [Math.cos(a) * 1.78, 1.12, Math.sin(a) * 1.78], wall);
    }
    return g;
  }

  if (stamp.type === 'yurt') {
    addCylinder(g, 1.45, 1.05, [0, 0.54, 0], wall, 64);
    const dome = new THREE.Mesh(new THREE.SphereGeometry(1.46, 64, 24, 0, Math.PI * 2, 0, Math.PI * 0.52), material(wall));
    dome.position.y = 1.06;
    dome.scale.y = 0.54;
    dome.castShadow = true;
    g.add(dome);
    addCylinder(g, 0.18, 0.14, [0, 1.88, 0], accent, 32);
    addBox(g, [0.72, 0.68, 0.08], [0, 0.48, 1.46], accent);
    return g;
  }

  if (stamp.type === 'cave') {
    addBox(g, [4.1, 1.1, 1.25], [0, 0.55, -0.25], '#b87945');
    for (let x of [-1.25, 0, 1.25]) addArch(g, x, 0.72, 0.42, wall);
    addBox(g, [4.4, 0.26, 1.55], [0, 1.24, -0.25], '#946136');
    return g;
  }

  const raised = ['stilt', 'dai', 'tropical'].includes(stamp.type);
  const baseY = raised ? 0.9 : 0.55;
  if (raised) {
    for (let x of [-1.25, 1.25]) for (let z of [-0.8, 0.8]) addBox(g, [0.16, 0.9, 0.16], [x, 0.45, z], trim);
  }

  const width = stamp.type === 'lane' ? 3.5 : 3.1;
  const depth = stamp.type === 'courtyard' ? 1.45 : 1.75;
  addBox(g, [width, 1.3, depth], [0, baseY, 0], wall);
  addRoof(g, width + 0.55, depth + 0.5, stamp.type === 'hui' ? 0.62 : 0.78, baseY + 0.86, accent);

  if (stamp.type === 'courtyard') {
    addBox(g, [1.45, 1.0, 1.15], [-2.05, 0.5, 0.15], wall);
    addBox(g, [1.45, 1.0, 1.15], [2.05, 0.5, 0.15], wall);
    addRoof(g, 1.72, 1.36, 0.46, 1.16, accent, -2.05, 0.15);
    addRoof(g, 1.72, 1.36, 0.46, 1.16, accent, 2.05, 0.15);
  }

  if (stamp.type === 'water') {
    addBox(g, [4.8, 0.06, 0.7], [0, 0.02, 2.35], '#7aa7a5', false);
    addBox(g, [0.18, 0.35, 2.6], [-2.2, 0.2, 1.15], trim);
    addBox(g, [0.18, 0.35, 2.6], [2.2, 0.2, 1.15], trim);
  }

  if (stamp.type === 'northwest' || stamp.type === 'plateau') {
    addBox(g, [3.45, 0.28, 1.98], [0, baseY + 0.78, 0], accent);
  }

  for (let x of [-0.85, 0.85]) {
    addBox(g, [0.44, 0.46, 0.08], [x, baseY + 0.1, depth / 2 + 0.04], trim);
  }
  addBox(g, [0.58, 0.82, 0.08], [0, baseY - 0.24, depth / 2 + 0.05], accent);

  return g;
}

function makeStampPlane(stamp) {
  const g = new THREE.Group();
  const [accent, wall, trim] = stamp.palette;
  const back = new THREE.Mesh(
    new THREE.BoxGeometry(4.6, 6.2, 0.14),
    material('#f6f1e2', 0.68)
  );
  back.position.set(0, 2.6, -1.05);
  back.castShadow = true;
  back.receiveShadow = true;
  g.add(back);

  const band = addBox(g, [4.2, 0.9, 0.08], [0, 5.12, -0.94], accent);
  band.material.color = new THREE.Color(accent);
  addBox(g, [3.9, 3.15, 0.08], [0, 2.8, -0.93], wall, false);

  for (let i = 0; i < 18; i += 1) {
    const y = -0.25 + i * 0.34;
    addCylinder(g, 0.045, 0.08, [-2.36, y, -0.95], '#d5ccb5', 16);
    addCylinder(g, 0.045, 0.08, [2.36, y, -0.95], '#d5ccb5', 16);
  }
  for (let i = 0; i < 13; i += 1) {
    const x = -2.05 + i * 0.34;
    addCylinder(g, 0.045, 0.08, [x, -0.55, -0.95], '#d5ccb5', 16);
    addCylinder(g, 0.045, 0.08, [x, 5.76, -0.95], '#d5ccb5', 16);
  }

  return g;
}

function makeArtworkStamp() {
  const g = new THREE.Group();
  const stampMaterial = new THREE.MeshStandardMaterial({
    color: '#ffffff',
    roughness: 0.62,
    metalness: 0,
    transparent: true,
    alphaTest: 0.04,
    side: THREE.DoubleSide
  });

  const width = 3.9;
  const height = width * (512 / 449);
  const stamp = new THREE.Mesh(
    new THREE.PlaneGeometry(width, height),
    stampMaterial
  );

  loadStampTexture('/stamps/p23-1/p23-1-4k.png', (texture) => {
    stampMaterial.map = texture;
    stampMaterial.color.set('#ffffff');
    stampMaterial.needsUpdate = true;
    const textureHeight = texture.image?.height || 0;
    const textureWidth = texture.image?.width || 0;
    if (textureWidth > 0 && textureHeight > 0) {
      stamp.geometry.dispose();
      stamp.geometry = new THREE.PlaneGeometry(width, width * (textureHeight / textureWidth));
    }
  });
  stamp.castShadow = false;
  stamp.receiveShadow = true;
  g.add(stamp);
  g.userData.stampMesh = stamp;

  g.userData.verticalPosition = new THREE.Vector3(-1.15, 2.74, 0.8);
  g.userData.flatPosition = new THREE.Vector3(0, 0.045, 0.15);
  g.position.copy(g.userData.verticalPosition);
  return g;
}

function loadStampTexture(src, onLoad) {
  const image = new Image();
  image.onload = () => {
    const textureCanvas = document.createElement('canvas');
    textureCanvas.width = image.naturalWidth;
    textureCanvas.height = image.naturalHeight;
    const ctx = textureCanvas.getContext('2d');
    ctx.drawImage(image, 0, 0);
    const imageData = ctx.getImageData(0, 0, textureCanvas.width, textureCanvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i] < 28 && data[i + 1] < 28 && data[i + 2] < 28) data[i + 3] = 0;
    }
    ctx.putImageData(imageData, 0, 0);

    const texture = new THREE.CanvasTexture(textureCanvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);
    onLoad(texture);
  };
  image.src = src;
}

function loadYurtAsset() {
  if (yurtLoadStarted) return;
  yurtLoadStarted = true;
  gltfLoader.load(`/models/mongolian_yurt_web.glb?v=${Date.now()}`, (gltf) => {
    const loadedModel = gltf.scene;
    let doorHotspotObject = null;
    let stoveObject = null;
    loadedModel.traverse((child) => {
      if (/door_lintel/i.test(child.name)) doorHotspotObject = child;
      if (/wood_stove/i.test(child.name)) stoveObject = child;
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          const shouldKeepTransparent = /rug/i.test(child.name) || /rug/i.test(child.material.name || '');
          const isShell = /yurt_shell/i.test(child.name);
          child.userData.isYurtShell = isShell;
          child.material.roughness = Math.max(child.material.roughness ?? 0.55, 0.68);
          if (isShell) child.material.side = THREE.DoubleSide;
          child.material.transparent = true;
          child.material.alphaTest = shouldKeepTransparent ? 0.28 : 0;
          child.material.depthWrite = !shouldKeepTransparent;
          child.material.userData.keepTransparent = shouldKeepTransparent;
          child.material.userData.isYurtShell = isShell;
          child.material.opacity = 0;
        }
      }
    });

    const box = new THREE.Box3().setFromObject(loadedModel);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    loadedModel.position.sub(center);

    yurtAsset = new THREE.Group();
    yurtAsset.add(loadedModel);
    const maxAxis = Math.max(size.x, size.y, size.z) || 1;
    yurtAsset.scale.setScalar(4.35 / maxAxis);
    yurtAsset.position.set(yurtStageCenter.x, 0, yurtStageCenter.z + 0.14);
    const groundedBox = new THREE.Box3().setFromObject(yurtAsset);
    yurtAsset.position.y += 0.18 - groundedBox.min.y;
    const settledBox = new THREE.Box3().setFromObject(yurtAsset);
    yurtAsset.rotation.y = -Math.PI * 0.35 + Math.PI / 9;
    yurtAsset.visible = current === 0;
    yurtAsset.userData.baseScale = yurtAsset.scale.clone();
    yurtAsset.userData.basePosition = yurtAsset.position.clone();
    yurtAsset.userData.loadedModel = loadedModel;
    yurtAsset.userData.doorHotspotObject = doorHotspotObject;
    yurtAsset.userData.stoveObject = stoveObject;
    yurtAsset.userData.floorY = settledBox.min.y;
    const hotspotBox = new THREE.Box3().setFromObject(yurtAsset);
    yurtAsset.userData.hotspotWorld = new THREE.Vector3(
      (hotspotBox.min.x + hotspotBox.max.x) / 2,
      hotspotBox.max.y,
      (hotspotBox.min.z + hotspotBox.max.z) / 2
    );
    model.add(yurtAsset);
  });
}

function setReveal(value) {
  revealTarget = value;
  stageCard.classList.toggle('is-revealed', revealTarget > 0.5);
  if (value <= 0.5 && yurtAsset) {
    setYurtInsideView(false);
    setYurtShellTransparent(false);
    yurtAsset.visible = false;
    yurtAsset.traverse((child) => {
      if (child.isMesh && child.material) child.material.opacity = 0;
    });
  }
  if (value > 0.1 && current === 0) loadYurtAsset();
}

function setYurtShellTransparent(value) {
  yurtShellTransparent = value;
  stageCard.classList.toggle('is-shell-transparent', yurtShellTransparent);
}

function setYurtInsideView(value) {
  if (value && !yurtInsideView) yurtShellTransparentBeforeInside = yurtShellTransparent;
  yurtInsideView = value;
  yurtInsideControlsActive = false;
  yurtInsideLookDragging = false;
  yurtInsideProgress = value ? 1 : 0;
  if (!value) setYurtShellTransparent(yurtShellTransparentBeforeInside);
  activeRenderCamera = value ? insideCamera : camera;
  controls.object = camera;
  controls.enabled = false;
  activeRenderCamera.aspect = camera.aspect;
  activeRenderCamera.updateProjectionMatrix();
  stageCard.classList.toggle('is-yurt-inside', yurtInsideView);
}

function setProjectedHotspot(element, worldPosition, visible, fallback = null) {
  if (!visible) {
    element.style.opacity = '';
    element.style.pointerEvents = '';
    return;
  }
  activeRenderCamera.getWorldDirection(hotspotCameraDirection);
  hotspotCameraDelta.copy(worldPosition).sub(activeRenderCamera.position);
  if (hotspotCameraDelta.dot(hotspotCameraDirection) <= 0) {
    element.style.opacity = '';
    element.style.pointerEvents = '';
    return;
  }
  const stageRect = stageCard.getBoundingClientRect();
  const rect = canvas.getBoundingClientRect();
  const projected = worldPosition.clone().project(activeRenderCamera);
  let localX = (projected.x * 0.5 + 0.5) * rect.width;
  let localY = (-projected.y * 0.5 + 0.5) * rect.height;
  if (fallback && (!Number.isFinite(localX) || !Number.isFinite(localY) || localX < 0 || localX > rect.width || localY < 0 || localY > rect.height)) {
    localX = rect.width * fallback.x;
    localY = rect.height * fallback.y;
  }
  const x = rect.left - stageRect.left + localX;
  const y = rect.top - stageRect.top + localY;
  element.style.left = `${x}px`;
  element.style.top = `${y}px`;
  element.style.opacity = '1';
  element.style.pointerEvents = 'auto';
}

function setStageHotspot(element, visible, xPercent, yPercent) {
  if (!visible) {
    element.style.opacity = '';
    element.style.pointerEvents = '';
    return;
  }
  const stageRect = stageCard.getBoundingClientRect();
  const rect = canvas.getBoundingClientRect();
  element.style.left = `${rect.left - stageRect.left + rect.width * xPercent}px`;
  element.style.top = `${rect.top - stageRect.top + rect.height * yPercent}px`;
  element.style.opacity = '1';
  element.style.pointerEvents = 'auto';
}

function updateYurtHotspots(yurtOpacity) {
  const canShowHotspots = revealTarget > 0.5 && yurtOpacity > 0.72 && !yurtInsideView;
  const canShowKnowledgeHotspots = canShowHotspots && !yurtShellTransparent && yurtOpacity > 0.96 && !!yurtAsset?.userData.loadedModel;
  const canShowShellKnowledgeHotspots = canShowHotspots && yurtShellTransparent && yurtOpacity > 0.96 && !!yurtAsset?.userData.loadedModel;
  const canShowInteriorHotspots = revealTarget > 0.5 && yurtInsideView && !!yurtAsset?.userData.loadedModel;
  setProjectedHotspot(
    yurtShellHotspot,
    yurtAsset?.userData.hotspotWorld || yurtCenterWorld,
    canShowHotspots && !!yurtAsset?.userData.hotspotWorld
  );
  if (yurtAsset?.userData.loadedModel) {
    yurtDoorHotspotWorld.copy(yurtDoorHotspotLocal);
    yurtAsset.userData.loadedModel.localToWorld(yurtDoorHotspotWorld);
  }
  setProjectedHotspot(
    yurtDoorHotspot,
    yurtDoorHotspotWorld,
    canShowHotspots && !!yurtAsset?.userData.loadedModel,
    { x: 0.56, y: 0.46 }
  );
  if (yurtAsset?.userData.loadedModel) {
    yurtToonoKnowledgeWorld.copy(yurtToonoKnowledgeLocal);
    yurtDomeKnowledgeWorld.copy(yurtDomeKnowledgeLocal);
    yurtDoorKnowledgeWorld.copy(yurtDoorKnowledgeLocal);
    yurtShellDomeKnowledgeWorld.copy(yurtShellDomeKnowledgeLocal);
    yurtShellWallKnowledgeWorld.copy(yurtShellWallKnowledgeLocal);
    yurtStoveInteriorWorld.copy(yurtStoveInteriorLocal);
    yurtDaybedInteriorWorld.copy(yurtDaybedInteriorLocal);
    yurtBaganaInteriorWorld.copy(yurtBaganaInteriorLocal);
    yurtShrineInteriorWorld.copy(yurtShrineInteriorLocal);
    yurtAsset.userData.loadedModel.localToWorld(yurtToonoKnowledgeWorld);
    yurtAsset.userData.loadedModel.localToWorld(yurtDomeKnowledgeWorld);
    yurtAsset.userData.loadedModel.localToWorld(yurtDoorKnowledgeWorld);
    yurtAsset.userData.loadedModel.localToWorld(yurtShellDomeKnowledgeWorld);
    yurtAsset.userData.loadedModel.localToWorld(yurtShellWallKnowledgeWorld);
    yurtAsset.userData.loadedModel.localToWorld(yurtStoveInteriorWorld);
    yurtAsset.userData.stoveObject?.getWorldPosition(yurtStoveInteriorWorld);
    yurtStoveHotspotOffset.set(0, -0.14, 0).applyQuaternion(yurtAsset.userData.loadedModel.getWorldQuaternion(new THREE.Quaternion()));
    yurtStoveInteriorWorld.add(yurtStoveHotspotOffset);
    yurtAsset.userData.loadedModel.localToWorld(yurtDaybedInteriorWorld);
    yurtAsset.userData.loadedModel.localToWorld(yurtBaganaInteriorWorld);
    yurtAsset.userData.loadedModel.localToWorld(yurtShrineInteriorWorld);
  }
  setProjectedHotspot(toonoKnowledgeHotspot, yurtToonoKnowledgeWorld, canShowKnowledgeHotspots);
  setProjectedHotspot(domeKnowledgeHotspot, yurtDomeKnowledgeWorld, canShowKnowledgeHotspots);
  setProjectedHotspot(doorKnowledgeHotspot, yurtDoorKnowledgeWorld, canShowKnowledgeHotspots);
  setProjectedHotspot(shellDomeKnowledgeHotspot, yurtShellDomeKnowledgeWorld, canShowShellKnowledgeHotspots);
  setProjectedHotspot(shellWallKnowledgeHotspot, yurtShellWallKnowledgeWorld, canShowShellKnowledgeHotspots);
  setProjectedHotspot(stoveInteriorHotspot, yurtStoveInteriorWorld, canShowInteriorHotspots);
  setProjectedHotspot(daybedInteriorHotspot, yurtDaybedInteriorWorld, canShowInteriorHotspots);
  setProjectedHotspot(baganaInteriorHotspot, yurtBaganaInteriorWorld, canShowInteriorHotspots);
  setProjectedHotspot(shrineInteriorHotspot, yurtShrineInteriorWorld, canShowInteriorHotspots);
}

function updateStampHotspot() {
  const canShowHotspot = current === 0 && revealTarget <= 0.5 && !!stampArtwork?.userData.stampMesh;
  if (canShowHotspot) {
    stampArtwork.updateMatrixWorld(true);
    stampHotspotWorld.copy(stampHotspotLocal);
    stampArtwork.userData.stampMesh.localToWorld(stampHotspotWorld);
  }
  setProjectedHotspot(hotspot, stampHotspotWorld, canShowHotspot, { x: 0.34, y: 0.59 });
}

function applyInsideCameraLook() {
  yurtInsideLookDirection.set(
    Math.sin(yurtInsideLookYaw) * Math.cos(yurtInsideLookPitch),
    Math.sin(yurtInsideLookPitch),
    Math.cos(yurtInsideLookYaw) * Math.cos(yurtInsideLookPitch)
  );
  yurtInsideLookTarget.copy(insideCamera.position).add(yurtInsideLookDirection);
  insideCamera.lookAt(yurtInsideLookTarget);
}

function updateYurtInteriorLights() {
  const active = yurtInsideView && !!yurtAsset?.userData.loadedModel;
  yurtStoveLight.intensity += ((active ? 3.6 : 0) - yurtStoveLight.intensity) * 0.18;
  yurtInteriorTopLight.intensity += ((active ? 1.75 : 0) - yurtInteriorTopLight.intensity) * 0.18;
  if (!active) return;
  yurtStoveLightWorld.copy(yurtStoveLightLocal);
  yurtTopLightWorld.copy(yurtTopLightLocal);
  yurtTopLightTargetWorld.copy(yurtTopLightTargetLocal);
  yurtAsset.userData.loadedModel.localToWorld(yurtStoveLightWorld);
  yurtAsset.userData.loadedModel.localToWorld(yurtTopLightWorld);
  yurtAsset.userData.loadedModel.localToWorld(yurtTopLightTargetWorld);
  yurtStoveLight.position.copy(yurtStoveLightWorld);
  yurtInteriorTopLight.position.copy(yurtTopLightWorld);
  yurtInteriorTopLight.target.position.copy(yurtTopLightTargetWorld);
  yurtInteriorTopLight.target.updateMatrixWorld();
}

function updateInsideCamera() {
  if (!yurtAsset?.userData.loadedModel) return;
  yurtAsset.updateMatrixWorld(true);
  yurtInsidePosition.copy(yurtInsideLocalPosition);
  yurtInsideTarget.copy(yurtInsideLocalTarget);
  yurtAsset.userData.loadedModel.localToWorld(yurtInsidePosition);
  yurtAsset.userData.loadedModel.localToWorld(yurtInsideTarget);
  controls.enabled = false;
  if (!yurtInsideControlsActive) {
    activeRenderCamera = insideCamera;
    insideCamera.position.copy(yurtInsidePosition);
    yurtInsideLookDirection.copy(yurtInsideTarget).sub(yurtInsidePosition).normalize();
    yurtInsideLookYaw = Math.atan2(yurtInsideLookDirection.x, yurtInsideLookDirection.z);
    yurtInsideLookPitch = Math.asin(THREE.MathUtils.clamp(yurtInsideLookDirection.y, -0.98, 0.98));
    yurtInsideControlsActive = true;
  }
  applyInsideCameraLook();
}

const typeDetails = {
  yurt: {
    subtype: '圆形毡包结构',
    volume: '圆柱围护 + 扁半球顶',
    roof: '低矮穹顶，顶部短烟囱',
    material: '白毡、木门、彩色束带',
    notes: '建模时先做可复用的圆形基座，再用半球顶压扁形成柔软轮廓。门洞保持正面偏低，束带可用环形曲线贴合外墙。',
    scale: '建议比例：直径 1.00，高度 0.68，门高约 0.32。'
  },
  plateau: {
    subtype: '高原厚墙平顶民居',
    volume: '厚墙矩形体块 + 女儿墙',
    roof: '平顶厚檐，局部抬高',
    material: '夯土、石墙、深色木构',
    notes: '重点表现墙体厚度和小开窗。模型可用不规则石材法线或粗糙贴图，把体块做得沉稳一些。',
    scale: '建议比例：宽 1.55，深 0.86，高 0.72。'
  },
  snow: {
    subtype: '东北坡屋顶民居',
    volume: '横向主屋 + 厚屋面',
    roof: '大坡度双坡顶',
    material: '砖墙、木窗、积雪或灰瓦',
    notes: '屋顶体量要压过墙体，适合在檐口加厚边。正立面窗洞可以左右均衡，突出寒地民居的封闭感。',
    scale: '建议比例：宽 1.45，深 0.82，高 0.78。'
  },
  stilt: {
    subtype: '吊脚楼/干栏式民居',
    volume: '架空柱网 + 木楼体',
    roof: '轻薄长坡屋顶',
    material: '木柱、木板墙、瓦屋面',
    notes: '先搭柱网，再放置悬挑楼体。侧视图要把架空层留出来，这是识别度最高的部分。',
    scale: '建议比例：宽 1.48，深 0.86，高 1.05，架空层约 0.34。'
  },
  water: {
    subtype: '江南水乡民居',
    volume: '白墙主屋 + 临水平台',
    roof: '黑瓦双坡顶',
    material: '白墙、黑瓦、木栏、水面',
    notes: '黑白对比是重点。顶视图里可加入水岸线或小码头，便于后续场景搭建。',
    scale: '建议比例：宽 1.50，深 0.92，高 0.74。'
  },
  courtyard: {
    subtype: '合院式民居',
    volume: '主屋 + 两侧厢房 + 中庭',
    roof: '多段双坡屋顶',
    material: '灰瓦、砖墙、木门窗',
    notes: '顶视图最关键：用 U 形或口字形组织房屋。主屋稍高，厢房略低，院墙作为尺度参照。',
    scale: '建议比例：院落宽 1.9，深 1.35，主屋高 0.78。'
  },
  dai: {
    subtype: '云南高脚木构民居',
    volume: '架空层 + 宽深主楼',
    roof: '舒展坡屋顶',
    material: '竹木、草顶或瓦顶',
    notes: '与吊脚楼类似，但屋面更舒展，檐口更长。建议在侧视图保留大挑檐和楼梯入口。',
    scale: '建议比例：宽 1.55，深 1.00，高 1.08。'
  },
  lane: {
    subtype: '里弄砖木民居',
    volume: '窄面宽连续体块',
    roof: '规整坡顶或平坡结合',
    material: '红砖、石库门、深色窗框',
    notes: '正面适合强调门框和竖向窗洞。可复制单元形成连续街巷。',
    scale: '建议比例：宽 1.20，深 1.05，高 0.92。'
  },
  hui: {
    subtype: '徽派马头墙民居',
    volume: '白墙院落 + 高墙头',
    roof: '黑瓦坡顶，马头墙收边',
    material: '粉墙、黛瓦、木雕门窗',
    notes: '三视图里要明确马头墙的阶梯形轮廓。后续精模可把门罩、窗棂、墙脚石材单独拆件。',
    scale: '建议比例：宽 1.42，深 0.88，高 0.95。'
  },
  cave: {
    subtype: '陕北窑洞',
    volume: '覆土厚体 + 拱券门洞',
    roof: '平缓覆土顶',
    material: '黄土、砖券、木门窗',
    notes: '正立面的连续拱券是核心。模型可以用布尔切洞或拱形曲线挤出，顶部覆盖粗糙黄土材质。',
    scale: '建议比例：宽 1.85，深 0.72，高 0.70。'
  },
  southern: {
    subtype: '闽台南方合院民居',
    volume: '低矮院落 + 红瓦屋面',
    roof: '燕尾或硬山坡顶',
    material: '红瓦、砖墙、石基',
    notes: '屋脊可以略微起翘，正面入口保持中轴对称。适合后续加入砖雕和彩绘装饰。',
    scale: '建议比例：宽 1.52，深 0.90，高 0.78。'
  },
  tulou: {
    subtype: '福建土楼',
    volume: '圆筒围楼 + 内院',
    roof: '环形大屋顶',
    material: '夯土墙、木构廊、深色瓦',
    notes: '先建外圆筒，再切出内院。窗洞沿圆周阵列，顶视图应清楚显示同心圆关系。',
    scale: '建议比例：外径 1.70，内院径 0.95，高 0.86。'
  },
  northwest: {
    subtype: '西北厚墙民居',
    volume: '厚墙矩形院落',
    roof: '平顶或微坡顶',
    material: '黄土、砖、木门',
    notes: '减少开窗，强调封闭院墙和厚檐。顶视图可以加入院门和内院空地。',
    scale: '建议比例：宽 1.55，深 0.92，高 0.68。'
  },
  tropical: {
    subtype: '热带棚屋民居',
    volume: '架空平台 + 轻质屋身',
    roof: '高坡草顶',
    material: '竹木、茅草、棕榈色系',
    notes: '当前邮票数据没有海南民居，但这个类型可留作未来扩展。建模时突出高坡屋面和通风架空层。',
    scale: '建议比例：宽 1.45，深 0.90，高 1.10。'
  }
};

const typeKeywords = {
  yurt: [
    { label: '蒙古包', note: 'intro' },
    { label: '陶脑', note: 'toono' },
    { label: '哈纳', note: 'shellWall' },
    { label: '乌尼', note: 'shellDome' }
  ],
  plateau: ['厚墙', '平顶', '高原气候', '小窗洞'],
  snow: ['坡屋顶', '寒地民居', '砖木结构'],
  stilt: ['架空层', '木构', '湿热地区'],
  water: ['白墙黑瓦', '临水', '江南水乡'],
  courtyard: ['合院', '中轴', '院落生活'],
  dai: ['高脚楼', '大挑檐', '竹木结构'],
  lane: ['里弄', '砖墙', '街巷肌理'],
  hui: ['马头墙', '粉墙黛瓦', '院落'],
  cave: ['窑洞', '黄土', '拱券'],
  southern: ['红瓦', '南方合院', '硬山顶'],
  tulou: ['圆形围楼', '夯土', '宗族聚居'],
  northwest: ['厚墙', '平顶', '西北院落']
};

const provinceMap = {
  内蒙古: { label: '内蒙古自治区', code: 'neimenggu' },
  西藏: { label: '西藏自治区', code: 'xizang' },
  东北: { label: '东北地区', code: 'heilongjiang' },
  湖南: { label: '湖南省', code: 'hunan' },
  江苏: { label: '江苏省', code: 'jiangsu' },
  北京: { label: '北京市', code: 'beijing' },
  云南: { label: '云南省', code: 'yunnan' },
  上海: { label: '上海市', code: 'shanghai' },
  安徽: { label: '安徽省', code: 'anhui' },
  陕西: { label: '陕西省', code: 'shanxiHZ' },
  四川: { label: '四川省', code: 'sichuan' },
  台湾: { label: '台湾省', code: 'taiwan' },
  福建: { label: '福建省', code: 'fujian' },
  浙江: { label: '浙江省', code: 'zhejiang' },
  青海: { label: '青海省', code: 'qinghai' },
  贵州: { label: '贵州省', code: 'guizhou' },
  广西: { label: '广西壮族自治区', code: 'guangxi' },
  宁夏: { label: '宁夏回族自治区', code: 'ningxia' },
  山西: { label: '山西省', code: 'shanxi' },
  山东: { label: '山东省', code: 'shandong' },
  江西: { label: '江西省', code: 'jiangxi' }
};

const textbookNotes = {
  yurt: '蒙古族民居又称蒙古包（蒙古语称“格尔斯”），古称穹庐、毡帐，是北方游牧民族创造的可移动装配式建筑，最早记载见于《史记》。其结构由哈纳（可伸缩木制墙架）、陶脑（天窗）、乌尼（椽条）等构件组成，平面呈圆形，具有抵御风寒、便于游牧的特点。',
  plateau: '高原民居通常墙体厚重、开窗较小，以适应昼夜温差和强风环境。平顶空间兼具晾晒、储物与生活功能，建筑形态稳重内敛。',
  snow: '东北民居重视保温和排雪，坡屋顶、厚墙体和紧凑开口共同构成寒地生活的基本空间策略。',
  stilt: '干栏式或吊脚楼民居通过架空底层避潮、通风，并适应山地或湿热环境。木构梁柱体系使建筑轻巧而富有弹性。',
  water: '江南水乡民居依水而建，白墙黑瓦、临河开口和码头平台共同塑造了生活、交通与景观相连的聚落图景。',
  courtyard: '合院式民居以院落组织家庭生活，房屋围合出内向空间，强调秩序、礼仪与日常活动之间的关系。',
  dai: '傣族高脚楼利用架空层获得通风防潮的效果，大挑檐适应热带雨水环境，竹木材料使建筑轻盈而易于维护。',
  lane: '里弄民居以连续街巷和紧凑单元组织城市生活，砖木结构、石库门与窄面宽形成了近代城市居住的典型肌理。',
  hui: '徽派民居以粉墙黛瓦、马头墙和内向院落著称。高墙界面强调防火和围合，木雕门窗体现地方工艺传统。',
  cave: '窑洞利用黄土高原厚实土层形成天然围护，冬暖夏凉。拱券门洞和覆土体量体现了对地形与材料的直接利用。',
  southern: '闽台南方民居多见红瓦坡顶与院落布局，屋脊和门廊装饰丰富，既回应湿热气候，也承载宗族与地方审美。',
  tulou: '福建土楼以巨大的圆形或方形围合体组织群居生活，夯土外墙厚重坚固，内部木构廊屋围绕公共内院展开。',
  northwest: '西北民居常以厚墙、平顶和封闭院落应对干旱、多风与温差环境，建筑形态朴素，强调耐久与防护。'
};

const yurtKnowledgeNotes = {
  toono: {
    title: '陶脑',
    text: '陶脑位于蒙古包顶部，是连接乌尼椽条的圆形天窗构件。它既承担屋顶受力汇聚的作用，也为室内提供采光、通风和排烟通道，是蒙古包顶部结构的核心节点。'
  },
  dome: {
    title: '低矮穹顶',
    text: '蒙古包屋顶呈低矮穹顶形态，外轮廓圆缓，能够减小草原强风对建筑的冲击。穹顶空间有利于热空气聚集和烟气上升，也让可拆装木构在较轻材料下获得稳定支撑。'
  },
  door: {
    title: '门',
    text: '蒙古包门洞较低，门框与门槛共同加强入口结构。传统蒙古包多重视门的朝向，以避开寒风、获得日照；入口也是从外部草原生活进入家庭内部空间的分界。'
  },
  shellDome: {
    title: '乌尼',
    text: '透明蒙皮后可以看到穹顶由乌尼椽条向顶部陶脑汇聚，形成放射状受力体系。低矮穹顶既减小风压，也让轻质木构在较小自重下保持整体稳定。'
  },
  shellWall: {
    title: '哈纳',
    text: '蒙古包竖墙由哈纳组成，哈纳是可伸缩的木制网格墙架。它展开后形成圆形围护，收拢后便于运输，体现了游牧生活中“可移动、可装配”的建筑智慧。'
  },
  stove: {
    title: '火炉',
    text: '火炉位于蒙古包中央附近，承担取暖、炊事和凝聚家庭活动的功能。烟气通过顶部结构排出，火炉也让室内空间形成围绕中心展开的生活秩序。'
  },
  daybed: {
    title: '床榻',
    text: '床榻是蒙古包内重要的休息与待客家具，通常靠近围护边缘布置，既节省中央活动空间，也便于与箱柜、铺陈等生活物品组合使用。'
  },
  bagana: {
    title: '巴根',
    text: '巴根是蒙古包内部的竖向支撑构件，连接地面与顶部结构，帮助稳定陶脑和乌尼组成的屋顶体系。它强化了蒙古包轻质结构的整体性。'
  },
  shrine: {
    title: '神龛',
    text: '神龛体现蒙古包内部的精神性空间，常与家庭礼俗、供奉和日常秩序相关。它让居住空间不只是生活场所，也承载信仰与家族记忆。'
  }
};

function showTextbookNote(title, text) {
  document.querySelector('#textbookTitle').textContent = title;
  document.querySelector('#textbookText').textContent = text;
}

function setActiveKnowledgeHotspot(activeHotspot) {
  document.querySelectorAll('.blue-knowledge-hotspot').forEach((hotspotElement) => {
    hotspotElement.classList.toggle('is-selected', hotspotElement === activeHotspot);
  });
}

function renderKeywordTags(stamp) {
  const tags = typeKeywords[stamp.type] || ['地域民居', '传统建筑'];
  document.querySelector('#keywordTags').innerHTML = tags.map((tag) => {
    if (typeof tag === 'string') return `<span>${tag}</span>`;
    return `<button type="button" data-note="${tag.note}">${tag.label}</button>`;
  }).join('');
}

function detailFor(stamp) {
  return typeDetails[stamp.type] || typeDetails.courtyard;
}

async function loadChinaMap() {
  const mount = document.querySelector('#chinaMap');
  const response = await fetch('/maps/china_provinces_map.svg');
  mount.innerHTML = await response.text();
  const svg = mount.querySelector('svg');
  svg.removeAttribute('width');
  svg.removeAttribute('height');
  svg.setAttribute('viewBox', '110 0 430 504');
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  svg.setAttribute('aria-hidden', 'true');
  updateMapHighlight(activeMapCode);
}

function updateMapHighlight(code) {
  activeMapCode = code || 'neimenggu';
  const mount = document.querySelector('#chinaMap');
  mount.querySelectorAll('.active-province').forEach((node) => node.classList.remove('active-province'));
  const target = mount.querySelector(`.${CSS.escape(activeMapCode)}`);
  if (target) target.classList.add('active-province');
}

function blueprintGeometry(stamp) {
  const base = {
    frontRoof: 'M22 60 L90 28 L158 60 Z',
    frontBody: '<rect x="36" y="60" width="108" height="64" rx="2" />',
    sideRoof: 'M22 62 L78 30 L150 62 Z',
    sideBody: '<rect x="38" y="62" width="96" height="62" rx="2" />',
    topBody: '<rect x="40" y="42" width="104" height="76" rx="3" />',
    topRoof: '<rect x="28" y="32" width="128" height="96" rx="2" />'
  };

  const variants = {
    yurt: {
      frontRoof: '<ellipse cx="90" cy="58" rx="58" ry="24" /><rect x="42" y="58" width="96" height="52" rx="6" />',
      frontBody: '<rect x="78" y="78" width="24" height="32" rx="2" />',
      sideRoof: '<ellipse cx="88" cy="58" rx="54" ry="23" /><rect x="44" y="58" width="88" height="52" rx="6" />',
      sideBody: '<rect x="78" y="78" width="22" height="32" rx="2" />',
      topBody: '<circle cx="90" cy="82" r="48" />',
      topRoof: '<circle cx="90" cy="82" r="62" />'
    },
    tulou: {
      frontRoof: '<rect x="28" y="46" width="124" height="22" rx="2" />',
      frontBody: '<rect x="38" y="68" width="104" height="66" rx="4" />',
      sideRoof: '<rect x="28" y="46" width="124" height="22" rx="2" />',
      sideBody: '<rect x="38" y="68" width="104" height="66" rx="4" />',
      topBody: '<circle cx="90" cy="82" r="42" />',
      topRoof: '<circle cx="90" cy="82" r="62" />'
    },
    cave: {
      frontRoof: '<rect x="24" y="44" width="132" height="28" rx="3" />',
      frontBody: '<rect x="28" y="72" width="124" height="54" rx="3" /><path d="M48 126 V98 Q60 78 72 98 V126 Z M78 126 V98 Q90 78 102 98 V126 Z M108 126 V98 Q120 78 132 98 V126 Z" />',
      sideRoof: '<rect x="32" y="46" width="116" height="26" rx="3" />',
      sideBody: '<rect x="36" y="72" width="96" height="54" rx="3" />',
      topBody: '<rect x="30" y="54" width="120" height="58" rx="4" />',
      topRoof: '<rect x="22" y="42" width="136" height="82" rx="5" />'
    },
    stilt: {
      frontBody: '<rect x="38" y="58" width="104" height="48" rx="2" /><path d="M52 106 V134 M82 106 V134 M112 106 V134 M140 106 V134" />',
      sideBody: '<rect x="42" y="58" width="98" height="48" rx="2" /><path d="M56 106 V134 M92 106 V134 M128 106 V134" />'
    },
    dai: {
      frontRoof: 'M16 64 L90 22 L164 64 Z',
      sideRoof: 'M16 64 L78 24 L158 64 Z',
      frontBody: '<rect x="38" y="64" width="104" height="44" rx="2" /><path d="M52 108 V136 M86 108 V136 M122 108 V136" />',
      sideBody: '<rect x="42" y="64" width="98" height="44" rx="2" /><path d="M58 108 V136 M104 108 V136" />'
    },
    hui: {
      frontRoof: 'M26 64 L90 34 L154 64 Z',
      frontBody: '<path d="M36 124 V58 H54 V46 H68 V58 H126 V46 H140 V58 H144 V124 Z" />',
      sideBody: '<path d="M38 124 V60 H58 V48 H72 V60 H134 V124 Z" />'
    },
    courtyard: {
      topBody: '<path d="M34 44 H146 V124 H118 V72 H62 V124 H34 Z" />',
      topRoof: '<path d="M24 34 H156 V134 H110 V84 H70 V134 H24 Z" />'
    },
    water: {
      frontRoof: 'M24 62 L90 34 L156 62 Z',
      frontBody: '<rect x="38" y="62" width="104" height="56" rx="2" /><path d="M32 128 H148" />',
      topBody: '<rect x="38" y="42" width="104" height="64" rx="3" /><rect x="24" y="116" width="132" height="14" rx="2" />'
    },
    northwest: {
      frontRoof: '<rect x="30" y="46" width="120" height="20" rx="2" />',
      frontBody: '<rect x="36" y="66" width="108" height="58" rx="2" />',
      sideRoof: '<rect x="34" y="46" width="112" height="20" rx="2" />'
    },
    plateau: {
      frontRoof: '<rect x="30" y="44" width="120" height="22" rx="2" />',
      frontBody: '<rect x="36" y="66" width="108" height="62" rx="2" />',
      sideRoof: '<rect x="34" y="44" width="112" height="22" rx="2" />'
    },
    lane: {
      frontBody: '<rect x="48" y="58" width="84" height="68" rx="2" /><rect x="72" y="88" width="36" height="38" rx="2" />',
      topBody: '<rect x="52" y="34" width="76" height="98" rx="2" />',
      topRoof: '<rect x="42" y="28" width="96" height="110" rx="2" />'
    },
    southern: {
      frontRoof: 'M20 62 Q90 26 160 62 L148 68 Q90 45 32 68 Z',
      sideRoof: 'M24 62 Q84 28 154 62 L144 68 Q84 46 34 68 Z'
    }
  };

  return { ...base, ...(variants[stamp.type] || {}) };
}

function viewSvg(title, roof, body, stamp, view) {
  const [accent, wall, trim] = stamp.palette;
  return `
    <article class="blueprint">
      <div class="blueprint-title"><strong>${title}</strong><span>${view}</span></div>
      <svg viewBox="0 0 180 154" role="img" aria-label="${stamp.name}${title}">
        <defs>
          <pattern id="grid-${title}" width="12" height="12" patternUnits="userSpaceOnUse">
            <path d="M12 0H0V12" fill="none" stroke="#ded5c0" stroke-width="0.7"/>
          </pattern>
        </defs>
        <rect width="180" height="154" rx="8" fill="url(#grid-${title})"/>
        <g class="shape roof" fill="${accent}" stroke="${trim}" stroke-width="2">${roof}</g>
        <g class="shape body" fill="${wall}" stroke="${trim}" stroke-width="2">${body}</g>
        <path d="M18 136 H162 M24 130 V142 M156 130 V142" stroke="#9f8f75" stroke-width="1.4" fill="none"/>
      </svg>
    </article>
  `;
}

function renderBlueprints(stamp) {
  const g = blueprintGeometry(stamp);
  document.querySelector('#blueprints').innerHTML = [
    viewSvg('正视图', g.frontRoof, g.frontBody, stamp, 'front'),
    viewSvg('侧视图', g.sideRoof, g.sideBody, stamp, 'side'),
    viewSvg('顶视图', g.topRoof, g.topBody, stamp, 'top')
  ].join('');
}

function setMiniStyle(element, stamp) {
  element.setAttribute(
    'style',
    `--accent:${stamp.palette[0]};--paper:${stamp.palette[1]};--ink:${stamp.palette[2]}`
  );
}

function setActive(index) {
  current = (index + stamps.length) % stamps.length;
  const stamp = stamps[current];
  const details = detailFor(stamp);
  const province = provinceMap[stamp.region] || provinceMap[stamp.name.replace('民居', '')] || { label: stamp.region, code: 'neimenggu' };
  document.querySelector('#activeSet').textContent = stamp.set;
  document.querySelector('#activeName').textContent = stamp.name;
  document.querySelector('#activeMeta').textContent = `${stamp.value} · ${stamp.region} · ${stamp.year}`;
  document.querySelector('#detailName').textContent = stamp.name;
  document.querySelector('#detailSubtype').textContent = `${stamp.set} · ${stamp.value} · ${stamp.year}`;
  renderKeywordTags(stamp);
  document.querySelector('#mapProvince').textContent = stamp.region;
  updateMapHighlight(province.code);
  showTextbookNote(stamp.type === 'yurt' ? '蒙古包' : details.subtype.replace(/结构|民居/g, '') || stamp.name, textbookNotes[stamp.type] || details.notes);
  document.querySelector('#detailIcon').style.background = `linear-gradient(135deg, ${stamp.palette[0]}, ${stamp.palette[1]})`;

  model.removeFromParent();
  model.traverse((child) => {
    if (child.geometry) child.geometry.dispose();
    if (child.material) child.material.dispose();
  });
  yurtAsset = null;
  yurtLoadStarted = false;
  setYurtShellTransparent(false);

  model = new THREE.Group();
  stampArtwork = null;
  revealProgress = current === 0 ? revealProgress : 0;
  revealTarget = current === 0 ? revealTarget : 0;
  setYurtInsideView(false);

  if (current === 0) {
    stampArtwork = makeArtworkStamp();
    model.add(stampArtwork);
    controls.enabled = false;
    if (revealTarget > 0.1) loadYurtAsset();
  } else {
    controls.enabled = true;
    const stampPlane = makeStampPlane(stamp);
    stampPlane.rotation.x = -0.06;
    stampPlane.scale.setScalar(0.84);
    stampPlane.position.set(-0.28, 0.02, -0.28);
    model.add(stampPlane);

    const dwelling = makeDwelling(stamp);
    dwelling.scale.setScalar(0.92);
    dwelling.position.set(0, 0.16, 1.05);
    model.add(dwelling);
  }

  root.add(model);

  document.querySelectorAll('.stamp-card').forEach((card, i) => {
    card.classList.toggle('selected', i === current);
  });
}

const grid = document.querySelector('#stampGrid');
function makeStampCard(stamp, i) {
  const button = document.createElement('button');
  button.className = 'stamp-card';
  if (i !== 0) {
    button.disabled = true;
    button.setAttribute('aria-disabled', 'true');
  }
  button.innerHTML = `
    ${i === 0
      ? '<img src="/stamps/p23-1/p23-1.png" alt="" class="stamp-thumb-image" data-transparent-stamp>'
      : `<span class="mini" style="--accent:${stamp.palette[0]};--paper:${stamp.palette[1]};--ink:${stamp.palette[2]}"></span>`}
    <span class="card-text">
      <strong>${stamp.name}</strong>
      <small>${stamp.set} · ${stamp.value}</small>
    </span>
  `;
  if (i === 0) button.addEventListener('click', () => setActive(i));
  return button;
}

stampGroups.forEach((group) => {
  const details = document.createElement('details');
  details.className = 'stamp-group';
  details.open = group.set === '普23';
  details.innerHTML = `
    <summary>
      <span>${group.title}</span>
      <small>${group.subtitle}</small>
    </summary>
  `;
  const groupList = document.createElement('div');
  groupList.className = 'stamp-group-list';
  stamps.forEach((stamp, i) => {
    if (stamp.set === group.set) groupList.appendChild(makeStampCard(stamp, i));
  });
  details.appendChild(groupList);
  grid.appendChild(details);
});

function makeTransparentStampThumbnail(src, onLoad) {
  const image = new Image();
  image.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i] < 30 && data[i + 1] < 30 && data[i + 2] < 30) data[i + 3] = 0;
    }
    ctx.putImageData(imageData, 0, 0);
    onLoad(canvas.toDataURL('image/png'));
  };
  image.src = src;
}

document.querySelectorAll('[data-transparent-stamp]').forEach((image) => {
  makeTransparentStampThumbnail(image.getAttribute('src'), (dataUrl) => {
    image.src = dataUrl;
  });
});

document.querySelector('#keywordTags').addEventListener('click', (event) => {
  const button = event.target.closest('button[data-note]');
  if (!button) return;
  const noteKey = button.dataset.note;
  if (noteKey === 'intro') {
    showTextbookNote('蒙古包', textbookNotes.yurt);
    return;
  }
  const note = yurtKnowledgeNotes[noteKey];
  if (note) showTextbookNote(note.title, note.text);
});
document.querySelector('#hotspot').addEventListener('click', (event) => {
  event.stopPropagation();
  setReveal(1);
});
document.querySelector('#yurtShellHotspot').addEventListener('click', (event) => {
  event.stopPropagation();
  setYurtShellTransparent(!yurtShellTransparent);
});
document.querySelector('#yurtDoorHotspot').addEventListener('click', (event) => {
  event.stopPropagation();
  setYurtInsideView(true);
});
document.querySelector('#yurtDoorHotspot').addEventListener('pointerdown', (event) => {
  event.stopPropagation();
  setYurtInsideView(true);
});
toonoKnowledgeHotspot.addEventListener('click', (event) => {
  event.stopPropagation();
  setActiveKnowledgeHotspot(toonoKnowledgeHotspot);
  showTextbookNote(yurtKnowledgeNotes.toono.title, yurtKnowledgeNotes.toono.text);
});
domeKnowledgeHotspot.addEventListener('click', (event) => {
  event.stopPropagation();
  setActiveKnowledgeHotspot(domeKnowledgeHotspot);
  showTextbookNote(yurtKnowledgeNotes.dome.title, yurtKnowledgeNotes.dome.text);
});
doorKnowledgeHotspot.addEventListener('click', (event) => {
  event.stopPropagation();
  setActiveKnowledgeHotspot(doorKnowledgeHotspot);
  showTextbookNote(yurtKnowledgeNotes.door.title, yurtKnowledgeNotes.door.text);
});
shellDomeKnowledgeHotspot.addEventListener('click', (event) => {
  event.stopPropagation();
  setActiveKnowledgeHotspot(shellDomeKnowledgeHotspot);
  showTextbookNote(yurtKnowledgeNotes.shellDome.title, yurtKnowledgeNotes.shellDome.text);
});
shellWallKnowledgeHotspot.addEventListener('click', (event) => {
  event.stopPropagation();
  setActiveKnowledgeHotspot(shellWallKnowledgeHotspot);
  showTextbookNote(yurtKnowledgeNotes.shellWall.title, yurtKnowledgeNotes.shellWall.text);
});
stoveInteriorHotspot.addEventListener('click', (event) => {
  event.stopPropagation();
  setActiveKnowledgeHotspot(stoveInteriorHotspot);
  showTextbookNote(yurtKnowledgeNotes.stove.title, yurtKnowledgeNotes.stove.text);
});
daybedInteriorHotspot.addEventListener('click', (event) => {
  event.stopPropagation();
  setActiveKnowledgeHotspot(daybedInteriorHotspot);
  showTextbookNote(yurtKnowledgeNotes.daybed.title, yurtKnowledgeNotes.daybed.text);
});
baganaInteriorHotspot.addEventListener('click', (event) => {
  event.stopPropagation();
  setActiveKnowledgeHotspot(baganaInteriorHotspot);
  showTextbookNote(yurtKnowledgeNotes.bagana.title, yurtKnowledgeNotes.bagana.text);
});
shrineInteriorHotspot.addEventListener('click', (event) => {
  event.stopPropagation();
  setActiveKnowledgeHotspot(shrineInteriorHotspot);
  showTextbookNote(yurtKnowledgeNotes.shrine.title, yurtKnowledgeNotes.shrine.text);
});
canvas.addEventListener('pointerdown', (event) => {
  if (!yurtInsideView) return;
  event.preventDefault();
  yurtInsideLookDragging = true;
  yurtInsideLastX = event.clientX;
  yurtInsideLastY = event.clientY;
  canvas.setPointerCapture?.(event.pointerId);
});
canvas.addEventListener('pointermove', (event) => {
  if (!yurtInsideView || !yurtInsideLookDragging) return;
  event.preventDefault();
  const dx = event.clientX - yurtInsideLastX;
  const dy = event.clientY - yurtInsideLastY;
  yurtInsideLastX = event.clientX;
  yurtInsideLastY = event.clientY;
  yurtInsideLookYaw -= dx * 0.0042;
  yurtInsideLookPitch = THREE.MathUtils.clamp(yurtInsideLookPitch - dy * 0.0038, -0.78, 0.58);
  applyInsideCameraLook();
});
canvas.addEventListener('pointerup', (event) => {
  if (!yurtInsideView) return;
  yurtInsideLookDragging = false;
  canvas.releasePointerCapture?.(event.pointerId);
});
canvas.addEventListener('pointercancel', () => {
  yurtInsideLookDragging = false;
});
document.querySelector('#backToStamp').addEventListener('click', (event) => {
  event.stopPropagation();
  if (yurtInsideView) {
    setYurtInsideView(false);
    return;
  }
  setReveal(0);
});
document.querySelector('#copySpec')?.addEventListener('click', async () => {
  const stamp = stamps[current];
  const details = detailFor(stamp);
  const text = `${stamp.name}｜${stamp.set}｜${stamp.value}
类型：${details.subtype}
主体：${details.volume}
屋顶：${details.roof}
材质：${details.material}
比例：${details.scale}`;
  await navigator.clipboard?.writeText(text);
});

function resize() {
  const rect = canvas.parentElement.getBoundingClientRect();
  renderer.setSize(rect.width, rect.height, false);
  camera.aspect = rect.width / rect.height;
  insideCamera.aspect = camera.aspect;
  const isCompactLandscape = rect.width < 720 && rect.height < 380;
  if (isCompactLandscape) {
    root.position.set(-0.55, -0.2, 0);
    root.scale.setScalar(0.68);
  } else if (rect.width < 720) {
    root.position.set(0.95, -0.72, 0);
    root.scale.setScalar(0.78);
  } else {
    root.position.set(0, 0, 0);
    root.scale.setScalar(1);
  }
  if (current !== 0) {
    if (isCompactLandscape) {
      camera.position.set(10.8, 7.1, 15.2);
    } else if (rect.width < 720) {
      camera.position.set(9.5, 6.4, 13.4);
    } else {
      camera.position.set(8, 6, 11);
    }
  }
  camera.updateProjectionMatrix();
  insideCamera.updateProjectionMatrix();
}

function animate() {
  revealProgress += (revealTarget - revealProgress) * 0.075;
  const eased = revealProgress * revealProgress * (3 - 2 * revealProgress);

  floor.material.opacity = THREE.MathUtils.lerp(0.46, 0.28, eased);
  scene.background = stageGradientTexture;
  scene.fog.color.set('#99a19c');
  updateYurtInteriorLights();

  if (current === 0) {
    if (yurtInsideProgress > 0.01) {
      updateInsideCamera();
    } else {
      const stageRect = canvas.parentElement.getBoundingClientRect();
      const isCompactLandscape = stageRect.width < 720 && stageRect.height < 380;
      const isMobile = stageRect.width < 720;
      const allowOrbit = revealTarget > 0.5 && eased > 0.96;
      controls.enabled = allowOrbit;
      controls.object = camera;
      activeRenderCamera = camera;
      if (allowOrbit) {
        controls.minDistance = 6.5;
        controls.maxDistance = 18;
        controls.maxPolarAngle = Math.PI * 0.47;
        controls.target.copy(laidCameraTarget);
        controls.update();
      } else {
        activeCameraPosition.lerpVectors(
          isCompactLandscape ? compactFrontCameraPosition : isMobile ? mobileFrontCameraPosition : frontCameraPosition,
          isMobile ? mobileLaidCameraPosition : laidCameraPosition,
          eased
        );
        activeCameraTarget.lerpVectors(frontCameraTarget, laidCameraTarget, eased);
        camera.position.copy(activeCameraPosition);
        camera.lookAt(activeCameraTarget);
      }
    }
  } else {
    controls.enabled = true;
    controls.object = camera;
    activeRenderCamera = camera;
    controls.update();
  }

  if (stampArtwork) {
    stampArtwork.position.lerpVectors(stampArtwork.userData.verticalPosition, stampArtwork.userData.flatPosition, eased);
    stampArtwork.rotation.x = THREE.MathUtils.lerp(0, -Math.PI / 2, eased);
    stampArtwork.rotation.z = THREE.MathUtils.lerp(0, -0.025, eased);
    stampArtwork.scale.setScalar(THREE.MathUtils.lerp(1, 1.08, eased));
    const stampOpacity = 1 - Math.max(0, Math.min(1, (eased - 0.36) / 0.28));
    stampArtwork.userData.stampMesh.material.opacity = stampOpacity;
  }
  updateStampHotspot();

  if (yurtAsset) {
    yurtAsset.visible = current === 0 && revealTarget > 0.5;
    const yurtOpacity = Math.max(0, Math.min(1, (eased - 0.68) / 0.32));
    const scale = THREE.MathUtils.lerp(0.55, 1, yurtOpacity);
    yurtAsset.scale.copy(yurtAsset.userData.baseScale).multiplyScalar(scale);
    yurtAsset.position.copy(yurtAsset.userData.basePosition);
    yurtAsset.traverse((child) => {
      if (child.isMesh && child.material) {
        const isOpaque = yurtOpacity > 0.98;
        const keepTransparent = child.material.userData.keepTransparent;
        const isShell = child.material.userData.isYurtShell;
        child.visible = true;
        if (isShell && yurtShellTransparent) {
          child.material.transparent = true;
          child.material.opacity = yurtOpacity * 0.18;
          child.material.depthWrite = false;
        } else {
          child.material.transparent = keepTransparent || !isOpaque;
          child.material.opacity = isOpaque ? 1 : yurtOpacity;
          child.material.depthWrite = !keepTransparent;
        }
        child.material.needsUpdate = true;
      }
    });
    updateYurtHotspots(yurtOpacity);
  } else {
    updateYurtHotspots(0);
  }

  root.rotation.y += controls.autoRotate ? 0.0016 : 0;
  renderer.render(scene, activeRenderCamera);
  requestAnimationFrame(animate);
}

window.addEventListener('resize', resize);
setActive(0);
loadChinaMap();
resize();
animate();
