import * as THREE from 'three';

export class FPSCamera {
  public camera: THREE.PerspectiveCamera;
  private pitch = 0;
  private yaw = 0;
  private baseFOV = 75;
  private targetFOV = 75;

  public sensitivity = 0.002;

  constructor(aspectRatio: number) {
    this.camera = new THREE.PerspectiveCamera(this.baseFOV, aspectRatio, 0.1, 1000);
    this.camera.rotation.order = 'YXZ';
  }

  public updateRotation(deltaX: number, deltaY: number): void {
    this.yaw -= deltaX * this.sensitivity;
    this.pitch -= deltaY * this.sensitivity;

    // Clamp pitch between -89 and 89 degrees
    const maxPitch = Math.PI / 2 - 0.01;
    this.pitch = Math.max(-maxPitch, Math.min(maxPitch, this.pitch));

    this.camera.rotation.x = this.pitch;
    this.camera.rotation.y = this.yaw;
  }

  public setPosition(position: THREE.Vector3): void {
    this.camera.position.copy(position);
  }

  public updateAspect(aspectRatio: number): void {
    this.camera.aspect = aspectRatio;
    this.camera.updateProjectionMatrix();
  }

  public setFOV(target: number, dt: number): void {
    this.targetFOV = target;
    this.camera.fov = THREE.MathUtils.lerp(this.camera.fov, this.targetFOV, dt * 10);
    this.camera.updateProjectionMatrix();
  }

  public getForwardVector(): THREE.Vector3 {
    const forward = new THREE.Vector3(0, 0, -1);
    forward.applyQuaternion(this.camera.quaternion);
    return forward;
  }

  public getRightVector(): THREE.Vector3 {
    const right = new THREE.Vector3(1, 0, 0);
    right.applyQuaternion(this.camera.quaternion);
    return right;
  }
}