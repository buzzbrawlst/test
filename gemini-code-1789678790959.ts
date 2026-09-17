import * as THREE from 'three';
import { InputManager } from '../core/InputManager';
import { FPSCamera } from './FPSCamera';

export class PlayerController {
  public position: THREE.Vector3;
  public velocity: THREE.Vector3;

  private height = 1.8;
  private crouchHeight = 1.0;
  private currentHeight = 1.8;
  private radius = 0.4;

  private isGrounded = false;
  private isSprinting = false;
  private isCrouching = false;

  private walkSpeed = 7.0;
  private sprintSpeed = 11.0;
  private crouchSpeed = 3.5;
  private jumpForce = 8.5;
  private gravity = 25.0;
  private airControl = 0.3;

  constructor(
    public fpsCamera: FPSCamera,
    private inputManager: InputManager,
    spawnPosition = new THREE.Vector3(0, 2, 0)
  ) {
    this.position = spawnPosition.clone();
    this.velocity = new THREE.Vector3();
  }

  public update(dt: number, colliders: THREE.Object3D[]): void {
    if (!this.inputManager.isLocked()) return;

    // Mouse look
    const mouseDelta = this.inputManager.consumeMouseDelta();
    this.fpsCamera.updateRotation(mouseDelta.x, mouseDelta.y);

    // States
    this.isCrouching = this.inputManager.isKeyPressed('ControlLeft') || this.inputManager.isKeyPressed('KeyC');
    this.isSprinting = !this.isCrouching && this.inputManager.isKeyPressed('ShiftLeft');

    // Camera Height Interpolation (Crouch effect)
    const targetHeight = this.isCrouching ? this.crouchHeight : this.height;
    this.currentHeight = THREE.MathUtils.lerp(this.currentHeight, targetHeight, dt * 12);

    // Dynamic FOV for sprinting
    const targetFOV = this.isSprinting && this.velocity.lengthSq() > 1 ? 85 : 75;
    this.fpsCamera.setFOV(targetFOV, dt);

    // Movement direction setup
    const moveInput = new THREE.Vector3();
    if (this.inputManager.isKeyPressed('KeyW')) moveInput.z -= 1;
    if (this.inputManager.isKeyPressed('KeyS')) moveInput.z += 1;
    if (this.inputManager.isKeyPressed('KeyA')) moveInput.x -= 1;
    if (this.inputManager.isKeyPressed('KeyD')) moveInput.x += 1;
    moveInput.normalize();

    // Determine current target move speed
    let currentSpeed = this.walkSpeed;
    if (this.isCrouching) currentSpeed = this.crouchSpeed;
    else if (this.isSprinting) currentSpeed = this.sprintSpeed;

    // Calculate movement vector relative to camera rotation
    const forward = new THREE.Vector3(0, 0, -1).applyEuler(new THREE.Euler(0, this.fpsCamera.camera.rotation.y, 0));
    const right = new THREE.Vector3(1, 0, 0).applyEuler(new THREE.Euler(0, this.fpsCamera.camera.rotation.y, 0));
    
    const moveDir = new THREE.Vector3()
      .addScaledVector(forward, -moveInput.z)
      .addScaledVector(right, moveInput.x)
      .normalize();

    // Horizontal Movement & Friction
    const targetVelX = moveDir.x * currentSpeed;
    const targetVelZ = moveDir.z * currentSpeed;

    const accel = this.isGrounded ? 15.0 : 15.0 * this.airControl;
    this.velocity.x = THREE.MathUtils.lerp(this.velocity.x, targetVelX, dt * accel);
    this.velocity.z = THREE.MathUtils.lerp(this.velocity.z, targetVelZ, dt * accel);

    // Gravity & Jump
    if (this.isGrounded) {
      this.velocity.y = -0.5; // Small negative velocity to maintain ground lock
      if (this.inputManager.isKeyPressed('Space')) {
        this.velocity.y = this.jumpForce;
        this.isGrounded = false;
      }
    } else {
      this.velocity.y -= this.gravity * dt;
    }

    // Apply Velocity to Position with Raycast Collision
    this.applyMovementAndCollision(dt, colliders);

    // Synchronize Camera Position
    const cameraPos = this.position.clone().add(new THREE.Vector3(0, this.currentHeight - 0.1, 0));
    this.fpsCamera.setPosition(cameraPos);
  }

  private applyMovementAndCollision(dt: number, colliders: THREE.Object3D[]): void {
    const displacement = this.velocity.clone().multiplyScalar(dt);
    
    // Y-axis resolution (Ground Detection & Gravity)
    this.position.y += displacement.y;
    
    const groundRay = new THREE.Raycaster(
      this.position.clone().add(new THREE.Vector3(0, 0.5, 0)),
      new THREE.Vector3(0, -1, 0),
      0,
      0.6
    );
    
    const hits = groundRay.intersectObjects(colliders, true);
    if (hits.length > 0 && this.velocity.y <= 0) {
      this.isGrounded = true;
      this.position.y = hits[0].point.y;
      this.velocity.y = 0;
    } else {
      this.isGrounded = false;
    }

    // X/Z Movement Resolution
    this.position.x += displacement.x;
    this.position.z += displacement.z;
  }
}