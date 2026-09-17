export class InputManager {
  private keys: Map<string, boolean> = new Map();
  private mouseDeltaX = 0;
  private mouseDeltaY = 0;
  private isPointerLocked = false;

  constructor(private element: HTMLElement, private overlayElement: HTMLElement) {
    this.initListeners();
  }

  private initListeners(): void {
    window.addEventListener('keydown', (e) => this.keys.set(e.code, true));
    window.addEventListener('keyup', (e) => this.keys.set(e.code, false));

    this.overlayElement.addEventListener('click', () => {
      this.element.requestPointerLock();
    });

    document.addEventListener('pointerlockchange', () => {
      this.isPointerLocked = document.pointerLockElement === this.element;
      this.overlayElement.style.display = this.isPointerLocked ? 'none' : 'flex';
    });

    document.addEventListener('mousemove', (e) => {
      if (this.isPointerLocked) {
        this.mouseDeltaX += e.movementX;
        this.mouseDeltaY += e.movementY;
      }
    });
  }

  public isKeyPressed(code: string): boolean {
    return this.keys.get(code) || false;
  }

  public consumeMouseDelta(): { x: number; y: number } {
    const delta = { x: this.mouseDeltaX, y: this.mouseDeltaY };
    this.mouseDeltaX = 0;
    this.mouseDeltaY = 0;
    return delta;
  }

  public isLocked(): boolean {
    return this.isPointerLocked;
  }
}