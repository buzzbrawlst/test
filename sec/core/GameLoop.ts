export class GameLoop {
  private lastTime = 0;
  private isRunning = false;

  constructor(
    private updateCallback: (dt: number) => void,
    private renderCallback: () => void
  ) {}

  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    requestAnimationFrame(this.loop);
  }

  public stop(): void {
    this.isRunning = false;
  }

  private loop = (currentTime: number): void => {
    if (!this.isRunning) return;

    const dt = Math.min((currentTime - this.lastTime) / 1000, 0.1); // Cap dt to prevent huge leaps
    this.lastTime = currentTime;

    this.updateCallback(dt);
    this.renderCallback();

    requestAnimationFrame(this.loop);
  };
}
