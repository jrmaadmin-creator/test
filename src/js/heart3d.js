// 3D "glass heart": translucent chambers and great vessels with the conduction
// system inside. Reads the same beat timeline as the strip and lights up
// whatever is firing at the current simulation time.
//
// Orientation: anterior view. The patient's right is the viewer's left, so the
// right atrium sits upper-left and the apex points down and to the viewer's right.

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const V = (x, y, z) => new THREE.Vector3(x, y, z);

const COLOR = {
  normal: new THREE.Color(0xffb547),
  ectopic: new THREE.Color(0xc39bff),
  block: new THREE.Color(0xff5c5c),
  core: new THREE.Color(0xb7874a),
  glass: new THREE.Color(0x5d93a6),
  warm: new THREE.Color(0xff7a4d),
};

// ---- Anatomy ----------------------------------------------------------------

const P = {
  sa: V(-1.12, 1.4, 0.3),
  avIn: V(-0.5, 0.45, 0.0),
  avOut: V(-0.27, 0.29, 0.08),
  hisEnd: V(-0.05, 0.05, 0.1),
  lbbSplit: V(0.14, -0.2, 0.02),
};

const PATHS = {
  bachmann: [P.sa, V(-0.5, 1.5, 0.34), V(0.2, 1.4, 0.06), V(0.98, 1.2, -0.36)],
  intAnt: [P.sa, V(-0.74, 1.2, 0.52), V(-0.52, 0.72, 0.36), P.avIn],
  intMid: [P.sa, V(-0.94, 0.96, 0.22), V(-0.7, 0.6, 0.1), P.avIn],
  intPost: [P.sa, V(-1.4, 0.92, -0.1), V(-1.0, 0.42, -0.2), P.avIn],
  av: [P.avIn, V(-0.39, 0.37, 0.05), P.avOut],
  his: [P.avOut, V(-0.16, 0.18, 0.1), P.hisEnd],
  rbb: [P.hisEnd, V(-0.1, -0.45, 0.28), V(0.04, -0.95, 0.38), V(-0.2, -1.22, 0.56), V(-0.56, -1.06, 0.72)],
  lbb: [P.hisEnd, V(0.06, -0.08, 0.06), P.lbbSplit],
  laf: [P.lbbSplit, V(0.36, -0.55, 0.28), V(0.68, -0.96, 0.38)],
  lpf: [P.lbbSplit, V(0.42, -0.62, -0.3), V(0.8, -1.16, -0.36)],
  kent: [V(1.1, 0.74, -0.38), V(1.24, 0.38, -0.32), V(1.18, 0.0, -0.24)],
  pacer: [V(-1.02, 2.8, 0.08), V(-1.0, 1.7, 0.1), V(-0.82, 0.85, 0.24), V(-0.4, 0.05, 0.42), V(-0.12, -0.9, 0.5), V(0.02, -1.38, 0.45)],
};

// Purkinje networks fan out from the ends of the bundles over the ventricular walls.
const PURK = {
  purkR: [
    [V(-0.56, -1.06, 0.72), V(-0.8, -0.7, 0.72), V(-0.95, -0.25, 0.55)],
    [V(-0.56, -1.06, 0.72), V(-0.45, -1.35, 0.6), V(-0.1, -1.55, 0.45)],
    [V(-0.2, -1.22, 0.56), V(-0.5, -1.0, 0.2), V(-0.85, -0.6, 0.05)],
    [V(0.04, -0.95, 0.38), V(-0.25, -0.55, 0.78), V(-0.55, -0.2, 0.8)],
  ],
  purkL: [
    [V(0.68, -0.96, 0.38), V(1.0, -0.6, 0.42), V(1.15, -0.2, 0.3)],
    [V(0.68, -0.96, 0.38), V(0.9, -1.45, 0.35), V(1.0, -1.82, 0.1)],
    [V(0.8, -1.16, -0.36), V(1.15, -0.8, -0.48), V(1.2, -0.35, -0.45)],
    [V(0.8, -1.16, -0.36), V(0.95, -1.62, -0.25), V(0.95, -1.85, 0.0)],
    [V(0.8, -1.16, -0.36), V(0.45, -1.2, -0.72), V(0.2, -0.75, -0.8)],
  ],
};

function circle(center, radius, normal, n = 48) {
  const nrm = normal.clone().normalize();
  const e1 = new THREE.Vector3().crossVectors(nrm, Math.abs(nrm.y) < 0.9 ? V(0, 1, 0) : V(1, 0, 0)).normalize();
  const e2 = new THREE.Vector3().crossVectors(nrm, e1).normalize();
  const pts = [];
  for (let i = 0; i < n; i++) {
    const u = (i / n) * Math.PI * 2;
    pts.push(center.clone().addScaledVector(e1, Math.cos(u) * radius).addScaledVector(e2, Math.sin(u) * radius));
  }
  return pts;
}

// Reentry circuits, shown only for the rhythms that use them.
const LOOPS = {
  flutterLoop: circle(V(-0.72, 0.42, 0.24), 0.36, V(0.55, -0.45, 0.7)),
  avnrtLoop: circle(V(-0.4, 0.38, 0.06), 0.11, V(0.3, 0.2, 1)),
  vtLoop: circle(V(0.88, -1.55, 0.32), 0.17, V(0.5, -0.3, 0.8)),
  twistLoop: circle(V(0, 0, 0), 0.95, V(0, 1, 0.2)),
};
const TWIST_CENTER = V(0.3, -0.85, 0.08);

// Where abnormal impulses start.
const FOCI = {
  sa: P.sa,
  av: V(-0.38, 0.37, 0.05),
  pac: V(-1.48, 0.78, 0.22),
  pvc: V(-0.28, -0.12, 0.74),
  ivr: V(0.78, -1.5, 0.12),
  escape: V(0.28, -1.05, 0.05),
  vt: V(0.98, -1.42, 0.4),
  pacerTip: V(0.02, -1.38, 0.45),
  septumR: V(-0.02, -0.55, 0.3),
  septumL: V(0.22, -0.5, -0.05),
  kentV: V(1.18, 0.0, -0.24),
};

const CHAMBERS = {
  RA: { c: V(-0.95, 0.85, 0.1), r: [0.62, 0.62, 0.62], taper: 0, rotZ: 0 },
  LA: { c: V(0.55, 1.0, -0.45), r: [0.72, 0.5, 0.56], taper: 0, rotZ: 0 },
  RV: { c: V(-0.3, -0.55, 0.35), r: [0.8, 1.05, 0.6], taper: 0.38, rotZ: 0.35 },
  LV: { c: V(0.45, -0.7, -0.15), r: [0.82, 1.3, 0.82], taper: 0.45, rotZ: 0.45 },
};

const VESSELS = [
  { pts: [V(0.15, 0.2, 0.05), V(0.05, 1.2, 0.25), V(0.02, 2.0, 0.12), V(0.45, 2.36, -0.22), V(0.88, 2.05, -0.62), V(0.92, 0.9, -0.9)], r: 0.25, color: 0x9a5f63 },
  { pts: [V(-0.12, 0.2, 0.66), V(0.15, 1.2, 0.62), V(0.45, 1.6, 0.35), V(1.05, 1.62, -0.05)], r: 0.21, color: 0x5d73a3 },
  { pts: [V(0.25, 1.45, 0.5), V(-0.35, 1.72, 0.1), V(-0.7, 1.75, -0.3)], r: 0.14, color: 0x5d73a3 },
  { pts: [V(-1.0, 2.75, 0.05), V(-1.0, 1.9, 0.05), V(-1.0, 1.35, 0.06)], r: 0.2, color: 0x5d73a3 },
  { pts: [V(-0.95, 0.35, -0.05), V(-0.92, -0.2, -0.12), V(-0.88, -0.75, -0.15)], r: 0.21, color: 0x5d73a3 },
];

// Structures a label can point at, and the segments each one lights up.
export const STRUCTURE_SEGS = {
  sa: ['sa'],
  internodal: ['intAnt', 'intMid', 'intPost'],
  bachmann: ['bachmann'],
  av: ['av'],
  his: ['his'],
  rbb: ['rbb'],
  lbb: ['lbb'],
  laf: ['laf'],
  lpf: ['lpf'],
  purk: ['purkR', 'purkL'],
};

const OPTIONAL = ['kent', 'pacer', 'flutterLoop', 'avnrtLoop', 'vtLoop', 'twistLoop', 'scar'];

// ---- Materials ----------------------------------------------------------------

function glassMaterial(base, opacity) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uBase: { value: new THREE.Color(base) },
      uActive: { value: COLOR.warm.clone() },
      uAct: { value: 0 },
      uOpacity: { value: opacity },
    },
    vertexShader: /* glsl */ `
      varying vec3 vN; varying vec3 vV;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vN = normalize(normalMatrix * normal);
        vV = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uBase; uniform vec3 uActive; uniform float uAct; uniform float uOpacity;
      varying vec3 vN; varying vec3 vV;
      void main() {
        float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.2);
        float k = clamp(uAct, 0.0, 1.0);
        vec3 c = mix(uBase, uActive, k);
        float a = uOpacity * (0.16 + 0.84 * f) + k * 0.2 * (0.35 + 0.65 * f);
        gl_FragColor = vec4(c * (0.55 + 0.95 * f), a);
      }`,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
}

function rimMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: { uColor: { value: COLOR.ectopic.clone() }, uAlpha: { value: 0 } },
    vertexShader: glassMaterial(0, 0).vertexShader,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor; uniform float uAlpha;
      varying vec3 vN; varying vec3 vV;
      void main() {
        float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 3.0);
        gl_FragColor = vec4(uColor, uAlpha * f);
      }`,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  });
}

function spriteTexture(draw) {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  draw(c.getContext('2d'));
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

const GLOW_TEX = () =>
  spriteTexture((g) => {
    const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grd.addColorStop(0, 'rgba(255,255,255,1)');
    grd.addColorStop(0.25, 'rgba(255,255,255,0.8)');
    grd.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grd;
    g.fillRect(0, 0, 64, 64);
  });

const X_TEX = () =>
  spriteTexture((g) => {
    g.strokeStyle = '#fff';
    g.lineWidth = 9;
    g.lineCap = 'round';
    g.beginPath();
    g.moveTo(16, 16);
    g.lineTo(48, 48);
    g.moveTo(48, 16);
    g.lineTo(16, 48);
    g.stroke();
  });

function chamberGeometry({ r, taper }) {
  const g = new THREE.SphereGeometry(1, 56, 40);
  const pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const k = y < 0 ? 1 - taper * Math.pow(-y, 1.6) : 1;
    pos.setXYZ(i, x * r[0] * k, y * r[1], z * r[2] * k);
  }
  g.computeVertexNormals();
  return g;
}

// ---- Heart view -----------------------------------------------------------------

export class HeartView {
  constructor(container, labelLayer, { onSelect } = {}) {
    this.container = container;
    this.labelLayer = labelLayer;
    this.onSelect = onSelect;
    this.highlight = null;

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, preserveDrawingBuffer: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setClearColor(0x081014, 1);
    container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.enablePan = false;
    this.controls.minDistance = 4;
    this.controls.maxDistance = 14;
    this.resetView();

    this.root = new THREE.Group();
    this.scene.add(this.root);

    this.glowTex = GLOW_TEX();
    this.xTex = X_TEX();

    this.buildChambers();
    this.buildVessels();
    this.buildConduction();
    this.buildPools();
    this.buildLabels();

    this.sparks = [];
    this.sparkDebt = 0;

    new ResizeObserver(() => this.resize()).observe(container);
    this.resize();
  }

  resetView() {
    this.camera.position.set(1.5, 0.75, 9.4);
    this.controls.target.set(0.05, 0.3, 0);
    this.controls.update();
  }

  resize() {
    const w = this.container.clientWidth || 1;
    const h = this.container.clientHeight || 1;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    // Keep the whole heart in frame on narrow screens.
    this.camera.fov = w / h < 0.9 ? 44 : 34;
    this.camera.updateProjectionMatrix();
  }

  buildChambers() {
    this.chambers = {};
    this.surface = { atria: [], ventricles: [] };
    for (const [id, d] of Object.entries(CHAMBERS)) {
      const mesh = new THREE.Mesh(chamberGeometry(d), glassMaterial(COLOR.glass, 0.5));
      mesh.position.copy(d.c);
      mesh.rotation.z = d.rotZ;
      mesh.renderOrder = 1;
      this.root.add(mesh);
      this.chambers[id] = mesh;
      mesh.updateMatrixWorld();
      const pos = mesh.geometry.attributes.position;
      const bucket = id === 'RA' || id === 'LA' ? this.surface.atria : this.surface.ventricles;
      for (let i = 0; i < pos.count; i += 7) bucket.push(V(pos.getX(i), pos.getY(i), pos.getZ(i)).applyMatrix4(mesh.matrixWorld));
    }
  }

  buildVessels() {
    for (const v of VESSELS) {
      const curve = new THREE.CatmullRomCurve3(v.pts, false, 'centripetal');
      const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 48, v.r, 20, false), glassMaterial(v.color, 0.55));
      mesh.renderOrder = 0;
      this.root.add(mesh);
    }
  }

  addSegment(id, curves, radius, { closed = false, visible = true, coreColor = COLOR.core } = {}) {
    const group = new THREE.Group();
    const core = new THREE.MeshBasicMaterial({ color: coreColor.clone(), transparent: true, opacity: 0.6, depthWrite: false });
    const halo = new THREE.MeshBasicMaterial({
      color: COLOR.normal.clone(),
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const built = curves.map((pts) => {
      const curve = new THREE.CatmullRomCurve3(pts, closed, 'centripetal');
      const segs = closed ? 96 : 40;
      const c = new THREE.Mesh(new THREE.TubeGeometry(curve, segs, radius, 8, closed), core);
      const h = new THREE.Mesh(new THREE.TubeGeometry(curve, segs, radius * 3.2, 8, closed), halo);
      c.renderOrder = 2;
      h.renderOrder = 3;
      group.add(c, h);
      return curve;
    });
    group.visible = visible;
    this.root.add(group);
    this.segs[id] = { group, curves: built, core, halo, glow: 0, color: COLOR.normal.clone() };
  }

  buildConduction() {
    this.segs = {};
    const R = { bachmann: 0.03, intAnt: 0.02, intMid: 0.02, intPost: 0.02, av: 0.05, his: 0.048, rbb: 0.036, lbb: 0.042, laf: 0.032, lpf: 0.034, kent: 0.034, pacer: 0.03 };
    for (const [id, pts] of Object.entries(PATHS)) {
      const opts = {};
      if (id === 'kent' || id === 'pacer') opts.visible = false;
      if (id === 'pacer') opts.coreColor = new THREE.Color(0x9aa7ad);
      this.addSegment(id, [pts], R[id], opts);
    }
    for (const [id, list] of Object.entries(PURK)) this.addSegment(id, list, 0.016);
    for (const [id, pts] of Object.entries(LOOPS)) {
      this.addSegment(id, [pts], id === 'twistLoop' ? 0.018 : 0.022, { closed: true, visible: false, coreColor: new THREE.Color(0x7c6440) });
    }
    // The torsades circuit spins about the long axis of the ventricles.
    this.twist = new THREE.Group();
    this.twist.position.copy(TWIST_CENTER);
    this.root.remove(this.segs.twistLoop.group);
    this.twist.add(this.segs.twistLoop.group);
    this.root.add(this.twist);

    // Nodes.
    const nodeMat = () => new THREE.MeshBasicMaterial({ color: COLOR.core.clone(), transparent: true, opacity: 0.9 });
    this.saNode = new THREE.Mesh(new THREE.SphereGeometry(0.1, 20, 14), nodeMat());
    this.saNode.scale.set(1.5, 1, 1);
    this.saNode.position.copy(P.sa);
    this.avNode = new THREE.Mesh(new THREE.SphereGeometry(0.1, 20, 14), nodeMat());
    this.avNode.scale.set(1.9, 0.9, 0.9);
    this.avNode.rotation.z = -0.6;
    this.avNode.position.copy(FOCI.av);
    this.root.add(this.saNode, this.avNode);
    this.segs.sa = { group: this.saNode, curves: [], core: this.saNode.material, halo: null, glow: 0, color: COLOR.normal.clone() };

    // Scar for the VT circuit.
    this.scar = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 20, 14),
      new THREE.MeshBasicMaterial({ color: 0x2b1f22, transparent: true, opacity: 0.9 }),
    );
    this.scar.position.copy(LOOPS.vtLoop.reduce((a, p) => a.add(p), V(0, 0, 0)).multiplyScalar(1 / LOOPS.vtLoop.length));
    this.scar.visible = false;
    this.root.add(this.scar);
  }

  buildPools() {
    const make = (tex, n, size) =>
      Array.from({ length: n }, () => {
        const s = new THREE.Sprite(
          new THREE.SpriteMaterial({ map: tex, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, depthTest: false }),
        );
        s.scale.setScalar(size);
        s.visible = false;
        s.renderOrder = 5;
        this.root.add(s);
        return s;
      });
    this.pulsePool = make(this.glowTex, 260, 0.2);
    this.xPool = make(this.xTex, 8, 0.24);
    for (const x of this.xPool) x.material.blending = THREE.NormalBlending;
    this.sparkPool = make(this.glowTex, 220, 0.12);
    this.saHalo = make(this.glowTex, 1, 0.7)[0];
    this.saHalo.position.copy(P.sa);
    this.avHalo = make(this.glowTex, 1, 0.6)[0];
    this.avHalo.position.copy(FOCI.av);
    this.ripplePool = Array.from({ length: 10 }, () => {
      const m = new THREE.Mesh(new THREE.SphereGeometry(1, 28, 20), rimMaterial());
      m.visible = false;
      m.renderOrder = 4;
      this.root.add(m);
      return m;
    });
  }

  buildLabels() {
    const at = (id, u) => this.segs[id].curves[0].getPointAt(u);
    this.labels = [
      { id: 'sa', text: 'SA node', pos: P.sa, side: 'l' },
      { id: 'bachmann', text: 'Bachmann’s bundle', pos: at('bachmann', 0.72), side: 'r' },
      { id: 'internodal', text: 'Internodal pathways', pos: at('intPost', 0.45), side: 'l' },
      { id: 'av', text: 'AV node', pos: FOCI.av, side: 'l' },
      { id: 'his', text: 'Bundle of His', pos: at('his', 0.7), side: 'r' },
      { id: 'rbb', text: 'Right bundle branch', pos: at('rbb', 0.45), side: 'l' },
      { id: 'lbb', text: 'Left bundle branch', pos: at('lbb', 0.9), side: 'r' },
      { id: 'laf', text: 'Left anterior fascicle', pos: at('laf', 0.5), side: 'r' },
      { id: 'lpf', text: 'Left posterior fascicle', pos: at('lpf', 1), side: 'r' },
      { id: 'purk', text: 'Purkinje fibers', pos: PURK.purkR[0][2], side: 'l' },
      { id: 'kent', text: 'Accessory pathway', pos: at('kent', 0.5), side: 'r', only: 'kent' },
      { id: 'pacer', text: 'Pacing lead', pos: at('pacer', 0.25), side: 'l', only: 'pacer' },
      { id: 'scar', text: 'Scar', pos: this.scar.position, side: 'r', only: 'scar' },
      { id: 'RA', text: 'RA', pos: V(-1.62, 0.45, 0.4), side: 'l', chamber: true },
      { id: 'LA', text: 'LA', pos: V(1.45, 0.95, -0.45), side: 'r', chamber: true },
      { id: 'RV', text: 'RV', pos: V(-0.85, -1.35, 0.5), side: 'l', chamber: true },
      { id: 'LV', text: 'LV', pos: V(1.55, -0.8, -0.1), side: 'r', chamber: true },
    ];
    for (const l of this.labels) {
      const el = document.createElement(l.chamber || l.only ? 'span' : 'button');
      el.className = `hlabel hlabel-${l.side}${l.chamber ? ' hlabel-chamber' : ''}`;
      el.innerHTML = `<i></i><span>${l.text}</span>`;
      if (el.tagName === 'BUTTON') {
        el.type = 'button';
        el.title = `About the ${l.text}`;
        el.addEventListener('click', () => this.onSelect?.(l.id));
      }
      this.labelLayer.appendChild(el);
      l.el = el;
    }
  }

  setRhythm(rhythm) {
    this.rhythm = rhythm;
    const show = new Set(rhythm.show || []);
    for (const id of OPTIONAL) {
      const vis = show.has(id);
      if (id === 'scar') this.scar.visible = vis;
      else this.segs[id].group.visible = vis;
    }
    for (const l of this.labels) if (l.only) l.visible = show.has(l.only);
    this.sparks.length = 0;
  }

  setHighlight(structureId) {
    this.highlight = structureId ? { id: structureId, until: performance.now() + 2600 } : null;
  }

  // ---- Per-frame update --------------------------------------------------------

  update(t, beats, dtSim) {
    for (const s of Object.values(this.segs)) {
      s.glow = 0;
      s.color.copy(COLOR.normal);
    }
    let pi = 0;
    let xi = 0;
    let ri = 0;
    const pulse = (pos, color, alpha, scale = 0.2) => {
      if (pi >= this.pulsePool.length) return;
      const sp = this.pulsePool[pi++];
      sp.position.copy(pos);
      sp.material.color.copy(color);
      sp.material.opacity = alpha;
      sp.scale.setScalar(scale);
      sp.visible = true;
    };
    const glow = (seg, g, color) => {
      const s = this.segs[seg];
      if (!s || g <= s.glow) return;
      s.glow = g;
      s.color.copy(color);
    };

    const chamberAct = { RA: 0, LA: 0, RV: 0, LV: 0 };

    for (const b of beats) {
      for (const a of b.acts) {
        if (t < a.t0 || t > a.t1 + 0.6) continue;
        const seg = this.segs[a.seg];
        if (!seg) continue;
        const col = a.kind === 'ectopic' ? COLOR.ectopic : COLOR.normal;
        const dur = Math.max(a.t1 - a.t0, 1e-3);
        const tb = a.block ? a.t0 + dur * a.block.at : Infinity;
        const along = (p) => (a.rev ? 1 - p : p);

        if (a.seg === 'sa') {
          if (t <= a.t1 + 0.15) glow('sa', t <= a.t1 ? 1 : Math.exp(-(t - a.t1) / 0.06), col);
          continue;
        }
        if (t >= tb) {
          const since = t - tb;
          const p = along(a.block.at);
          if (a.block.kind === 'block') {
            if (since < 0.45 && xi < this.xPool.length) {
              const x = this.xPool[xi++];
              x.position.copy(seg.curves[0].getPointAt(p));
              x.material.color.copy(COLOR.block);
              x.material.opacity = since < 0.3 ? 1 : 1 - (since - 0.3) / 0.15;
              x.visible = true;
            }
            if (since < 0.35) glow(a.seg, 1 - since / 0.35, COLOR.block);
          } else if (since < 0.12) {
            for (const c of seg.curves) pulse(c.getPointAt(p), col, 1 - since / 0.12, 0.2 * (1 - since / 0.2));
            glow(a.seg, 0.5 * (1 - since / 0.12), col);
          }
          continue;
        }
        if (t <= a.t1) {
          const p = (t - a.t0) / dur;
          for (const c of seg.curves) {
            pulse(c.getPointAt(along(p)), col, 1, 0.22);
            for (let k = 1; k <= 3; k++) {
              const q = p - k * 0.06;
              if (q > 0) pulse(c.getPointAt(along(q)), col, 0.55 - k * 0.14, 0.2 - k * 0.03);
            }
          }
          glow(a.seg, 1, col);
        } else {
          glow(a.seg, Math.exp(-(t - a.t1) / 0.1), col);
        }
      }

      for (const c of b.chambers) {
        if (t < c.d0 || t > c.r1) continue;
        let v;
        if (t < c.d1) v = (t - c.d0) / (c.d1 - c.d0);
        else if (t < c.r0) v = 1 - (0.3 * (t - c.d1)) / Math.max(c.r0 - c.d1, 1e-3);
        else v = 0.7 * (1 - (t - c.r0) / Math.max(c.r1 - c.r0, 1e-3));
        if (v > chamberAct[c.ch]) chamberAct[c.ch] = v;
      }

      for (const r of b.ripples) {
        if (t < r.t0 || t > r.t1 || ri >= this.ripplePool.length) continue;
        const k = (t - r.t0) / (r.t1 - r.t0);
        const m = this.ripplePool[ri++];
        m.position.copy(FOCI[r.at] || P.sa);
        m.scale.setScalar(0.06 + (r.at === 'sa' || r.at === 'av' ? 0.45 : 0.8) * k);
        m.material.uniforms.uColor.value.copy(r.kind === 'ectopic' ? COLOR.ectopic : COLOR.normal);
        m.material.uniforms.uAlpha.value = 1.6 * Math.pow(1 - k, 1.4);
        m.visible = true;
      }
    }

    // Continuous reentry circuits.
    const loop = this.rhythm?.loop;
    if (loop) {
      const seg = this.segs[loop.seg];
      const u = (((t / loop.period) % 1) + 1) % 1;
      const curve = seg.curves[0];
      if (loop.twist) this.twist.rotation.set(0.35 * Math.sin(t * 0.7), (t / loop.twist) * Math.PI * 2, 0.25);
      this.twist.updateMatrixWorld();
      const toWorld = (p) => (loop.twist ? p.applyMatrix4(this.twist.matrix) : p);
      for (let k = 0; k < 6; k++) {
        const uu = (((u - k * 0.035) % 1) + 1) % 1;
        pulse(toWorld(curve.getPointAt(uu)), COLOR.ectopic, 1 - k * 0.15, 0.22 - k * 0.02);
      }
      glow(loop.seg, 0.6, COLOR.ectopic);
    }

    // Chaotic activity: short-lived sparks scattered over the chamber walls.
    const chaos = this.rhythm?.ambient?.chaos;
    if (chaos) {
      const pts = chaos === 'atria' ? this.surface.atria : this.surface.ventricles;
      this.sparkDebt += (this.rhythm.ambient.chaosRate || 140) * dtSim;
      while (this.sparkDebt >= 1) {
        this.sparkDebt -= 1;
        this.sparks.push({ p: pts[(Math.random() * pts.length) | 0], t0: t });
      }
      this.sparks = this.sparks.filter((s) => t - s.t0 < 0.07 && t >= s.t0);
      if (this.sparks.length > this.sparkPool.length) this.sparks.splice(0, this.sparks.length - this.sparkPool.length);
      const flick = 0.3 + 0.15 * Math.sin(t * 47) + 0.1 * Math.sin(t * 91);
      for (const ch of chaos === 'atria' ? ['RA', 'LA'] : ['RV', 'LV']) chamberAct[ch] = Math.max(chamberAct[ch], flick);
    } else {
      this.sparks.length = 0;
    }
    this.sparkPool.forEach((s, i) => {
      const sp = this.sparks[i];
      s.visible = !!sp;
      if (!sp) return;
      s.position.copy(sp.p);
      s.material.color.copy(COLOR.ectopic);
      s.material.opacity = 1 - (t - sp.t0) / 0.07;
    });

    // Apply.
    for (const [id, m] of Object.entries(this.chambers)) m.material.uniforms.uAct.value = chamberAct[id];
    const hl = this.highlight && performance.now() < this.highlight.until ? STRUCTURE_SEGS[this.highlight.id] || [] : [];
    const hlPulse = 0.55 + 0.45 * Math.sin(performance.now() / 140);
    for (const [id, s] of Object.entries(this.segs)) {
      let g = s.glow;
      let col = s.color;
      if (hl.includes(id)) {
        g = Math.max(g, hlPulse);
        col = COLOR.normal;
      }
      if (s.halo) {
        s.halo.opacity = 0.42 * g;
        s.halo.color.copy(col);
      }
      s.core.color.copy(COLOR.core).lerp(col, g);
      s.core.opacity = 0.6 + 0.4 * g;
    }
    this.saHalo.visible = this.segs.sa.glow > 0.01 || hl.includes('sa');
    this.saHalo.material.opacity = Math.max(this.segs.sa.glow, hl.includes('sa') ? hlPulse : 0);
    this.saHalo.material.color.copy(this.segs.sa.color);
    this.avHalo.visible = this.segs.av.glow > 0.01 || hl.includes('av');
    this.avHalo.material.opacity = 0.8 * Math.max(this.segs.av.glow, hl.includes('av') ? hlPulse : 0);
    this.avHalo.material.color.copy(this.segs.av.color);
    this.avNode.material.color.copy(COLOR.core).lerp(this.segs.av.color, this.segs.av.glow);

    for (let i = pi; i < this.pulsePool.length; i++) this.pulsePool[i].visible = false;
    for (let i = xi; i < this.xPool.length; i++) this.xPool[i].visible = false;
    for (let i = ri; i < this.ripplePool.length; i++) this.ripplePool[i].visible = false;
  }

  render(showLabels) {
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    const v = new THREE.Vector3();
    for (const l of this.labels) {
      const on = showLabels && (l.only ? l.visible : true);
      l.el.hidden = !on;
      if (!on) continue;
      v.copy(l.pos).project(this.camera);
      const x = ((v.x + 1) / 2) * w;
      // Flip a label to the other side of its dot rather than let it run off-screen.
      if (!l.w) l.w = l.el.offsetWidth;
      let side = l.side;
      if (side === 'l' && x - l.w < 4) side = 'r';
      else if (side === 'r' && x + l.w > w - 4) side = 'l';
      if (side !== l.cur) {
        l.el.classList.toggle('hlabel-l', side === 'l');
        l.el.classList.toggle('hlabel-r', side === 'r');
        l.cur = side;
      }
      l.el.style.transform = `translate(${x}px, ${((1 - v.y) / 2) * h}px)`;
    }
  }
}
