import * as THREE from 'three';
import { GameLoop } from './GameLoop';
import { InputManager } from './InputManager';
import { FPSCamera } from '../player/FPSCamera';
import { PlayerController } from '../player/PlayerController';
import { TestEnvironment } from '../maps/TestEnvironment';

export class Engine {
  private renderer: THREE.WebGLRenderer;
  private environment: TestEnvironment;
  private fpsCamera: FPSCamera;
  private player: PlayerController;
  private inputManager: InputManager;
  private gameLoop: GameLoop;

  constructor(container: HTMLElement, overlay: HTMLElement) {
    // Renderer setup
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(this.renderer.domElement);

    // Subsystem initialization
    this.environment = new TestEnvironment();
    this.fpsCamera = new FPSCamera(window.innerWidth / window.innerHeight);
    this.inputManager = new InputManager(this.renderer.domElement, overlay);
    this.player = new PlayerController(this.fpsCamera, this.inputManager);

    // Loop initialization
    this.gameLoop = new GameLoop(
      (dt) => this.update(dt),
      () => this.render()
    );

    window.addEventListener('resize', () => this.onWindowResize());
  }

  public start(): void {
    this.gameLoop.start();
  }

  private update(dt: number): void {
    this.player.update(dt, this.environment.colliders);
  }

  private render(): void {
    this.renderer.render(this.environment.scene, this.fpsCamera.camera);
  }

  private onWindowResize(): void {
    this.fpsCamera.updateAspect(window.innerWidth / window.innerHeight);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}