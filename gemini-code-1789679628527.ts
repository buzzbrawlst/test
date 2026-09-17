export class HUD {
  private healthEl: HTMLElement;
  private shieldEl: HTMLElement;
  private weaponEl: HTMLElement;
  private buildModeEl: HTMLElement;

  constructor() {
    const hudContainer = document.createElement('div');
    hudContainer.id = 'hud';
    hudContainer.innerHTML = `
      <style>
        #hud {
          position: absolute;
          bottom: 20px;
          left: 20px;
          right: 20px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          pointer-events: none;
          font-family: monospace;
          color: white;
          text-shadow: 1px 1px 2px black;
        }
        .stat-box { background: rgba(0,0,0,0.5); padding: 10px 15px; border-radius: 6px; }
        .bar { width: 150px; height: 10px; background: #333; margin-top: 4px; border-radius: 3px; }
        .fill-hp { height: 100%; background: #22c55e; width: 100%; }
        .fill-shield { height: 100%; background: #3b82f6; width: 100%; }
      </style>
      <div class="stat-box">
        <div>HEALTH: <span id="hp-val">100</span></div>
        <div class="bar"><div id="hp-bar" class="fill-hp"></div></div>
        <div style="margin-top: 8px;">SHIELD: <span id="shield-val">100</span></div>
        <div class="bar"><div id="shield-bar" class="fill-shield"></div></div>
      </div>
      <div class="stat-box" style="text-align: right;">
        <div id="build-mode-text" style="color: #60a5fa; font-weight: bold;">MODE: COMBAT (Q to switch)</div>
        <div id="weapon-name" style="font-size: 18px; margin-top: 5px;">Assault Rifle</div>
      </div>
    `;
    document.body.appendChild(hudContainer);

    this.healthEl = document.getElementById('hp-val')!;
    this.shieldEl = document.getElementById('shield-val')!;
    this.weaponEl = document.getElementById('weapon-name')!;
    this.buildModeEl = document.getElementById('build-mode-text')!;
  }

  public update(hp: number, shield: number, weaponName: string, isBuilding: boolean): void {
    this.healthEl.innerText = Math.max(0, Math.ceil(hp)).toString();
    this.shieldEl.innerText = Math.max(0, Math.ceil(shield)).toString();
    this.weaponEl.innerText = weaponName;
    this.buildModeEl.innerText = isBuilding ? 'MODE: BUILDING (Q to exit | F1/F2 Wall/Floor)' : 'MODE: COMBAT (Q to Build)';
  }
}