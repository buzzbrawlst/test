import * as THREE from 'three';

export class TestEnvironment {
  public scene: THREE.Scene;
  public colliders: THREE.Object3D[] = [];

  constructor() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x1e293b);
    this.scene.fog = new THREE.FogExp2(0x1e293b, 0.015);

    this.setupLighting();
    this.setupGroundAndStructures();
  }

  private setupLighting(): void {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(20, 40, 20);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 100;
    const d = 40;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    this.scene.add(dirLight);
  }

  private setupGroundAndStructures(): void {
    // Grid Ground
    const groundSize = 100;
    const groundGeo = new THREE.PlaneGeometry(groundSize, groundSize);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.8,
      metalness: 0.2,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);
    this.colliders.push(ground);

    // Grid Helper
    const gridHelper = new THREE.GridHelper(groundSize, 50, 0x38bdf8, 0x475569);
    gridHelper.position.y = 0.01;
    this.scene.add(gridHelper);

    // Test Obstacles & Cover Elements
    const boxGeo = new THREE.BoxGeometry(1, 1, 1);
    const boxMat = new THREE.MeshStandardMaterial({ color: 0x0ea5e9, roughness: 0.4 });

    const obstaclePositions = [
      { pos: [0, 1.5, -8], scale: [4, 3, 1] },
      { pos: [-6, 1, -5], scale: [2, 2, 2] },
      { pos: [6, 2, -10], scale: [3, 4, 3] },
      { pos: [-10, 0.5, -12], scale: [6, 1, 6] },
    ];

    obstaclePositions.forEach((config) => {
      const mesh = new THREE.Mesh(boxGeo, boxMat);
      mesh.position.set(config.pos[0], config.pos[1], config.pos[2]);
      mesh.scale.set(config.scale[0], config.scale[1], config.scale[2]);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      this.scene.add(mesh);
      this.colliders.push(mesh);
    });
  }
}