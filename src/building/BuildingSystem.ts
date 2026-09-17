import * as THREE from 'three';

export type BuildType = 'wall' | 'floor' | 'ramp' | 'roof';

export interface StructurePiece {
  id: string;
  type: BuildType;
  mesh: THREE.Mesh;
  gridPos: THREE.Vector3;
  health: number;
  maxHealth: number;
}

export class BuildingSystem {
  private gridSize = 4.0; // 4x4 meter building grid
  public structures: Map<string, StructurePiece> = new Map();
  private previewMesh: THREE.Mesh;
  private previewMaterialValid: THREE.MeshBasicMaterial;
  private previewMaterialInvalid: THREE.MeshBasicMaterial;
  public currentType: BuildType = 'wall';
  public buildModeActive = false;

  constructor(private scene: THREE.Scene) {
    const geo = new THREE.BoxGeometry(this.gridSize, 0.1, this.gridSize);
    
    this.previewMaterialValid = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.4,
      wireframe: false,
    });

    this.previewMaterialInvalid = new THREE.MeshBasicMaterial({
      color: 0xef4444,
      transparent: true,
      opacity: 0.4,
    });

    this.previewMesh = new THREE.Mesh(geo, this.previewMaterialValid);
    this.previewMesh.visible = false;
    this.scene.add(this.previewMesh);
  }

  public toggleBuildMode(): void {
    this.buildModeActive = !this.buildModeActive;
    this.previewMesh.visible = this.buildModeActive;
  }

  public setBuildType(type: BuildType): void {
    this.currentType = type;
    this.updatePreviewGeometry();
  }

  private updatePreviewGeometry(): void {
    if (this.currentType === 'wall') {
      this.previewMesh.geometry = new THREE.BoxGeometry(this.gridSize, this.gridSize, 0.2);
    } else if (this.currentType === 'floor') {
      this.previewMesh.geometry = new THREE.BoxGeometry(this.gridSize, 0.2, this.gridSize);
    } else if (this.currentType === 'ramp') {
      this.previewMesh.geometry = new THREE.BoxGeometry(this.gridSize, 0.2, Math.sqrt(2) * this.gridSize);
    }
  }

  public updatePreview(playerPos: THREE.Vector3, lookDir: THREE.Vector3): void {
    if (!this.buildModeActive) return;

    const targetPos = playerPos.clone().add(lookDir.clone().multiplyScalar(4));
    
    // Snap position to global grid
    const gx = Math.round(targetPos.x / this.gridSize) * this.gridSize;
    const gy = Math.max(0, Math.round(targetPos.y / this.gridSize) * this.gridSize);
    const gz = Math.round(targetPos.z / this.gridSize) * this.gridSize;

    this.previewMesh.position.set(gx, gy + (this.currentType === 'wall' ? this.gridSize / 2 : 0), gz);

    const key = `${gx}_${gy}_${gz}_${this.currentType}`;
    const isValid = !this.structures.has(key);
    this.previewMesh.material = isValid ? this.previewMaterialValid : this.previewMaterialInvalid;
  }

  public placeStructure(): StructurePiece | null {
    if (!this.buildModeActive) return null;

    const pos = this.previewMesh.position;
    const key = `${pos.x}_${pos.y}_${pos.z}_${this.currentType}`;

    if (this.structures.has(key)) return null;

    const mat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.6 });
    const mesh = new THREE.Mesh(this.previewMesh.geometry.clone(), mat);
    mesh.position.copy(pos);
    mesh.rotation.copy(this.previewMesh.rotation);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    this.scene.add(mesh);

    const piece: StructurePiece = {
      id: key,
      type: this.currentType,
      mesh,
      gridPos: pos.clone(),
      health: 150,
      maxHealth: 150,
    };

    this.structures.set(key, piece);
    return piece;
  }
}
