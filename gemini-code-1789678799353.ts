import { Engine } from './core/Engine';

window.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('app') as HTMLElement;
  const overlay = document.getElementById('instructions') as HTMLElement;

  if (container && overlay) {
    const engine = new Engine(container, overlay);
    engine.start();
  }
});