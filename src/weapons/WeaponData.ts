export interface WeaponStats {
  id: string;
  name: string;
  damage: number;
  headshotMultiplier: number;
  fireRate: number; // Rounds per second
  magazineSize: number;
  reloadTime: number; // Seconds
  spread: number;
  recoilX: number;
  recoilY: number;
  range: number;
}

export const WEAPONS: Record<string, WeaponStats> = {
  assault_rifle: {
    id: 'assault_rifle',
    name: 'Assault Rifle',
    damage: 30,
    headshotMultiplier: 1.5,
    fireRate: 8,
    magazineSize: 30,
    reloadTime: 2.2,
    spread: 0.02,
    recoilX: 0.005,
    recoilY: 0.012,
    range: 150,
  },
  shotgun: {
    id: 'shotgun',
    name: 'Pump Shotgun',
    damage: 85,
    headshotMultiplier: 1.75,
    fireRate: 0.9,
    magazineSize: 5,
    reloadTime: 3.5,
    spread: 0.08,
    recoilX: 0.02,
    recoilY: 0.04,
    range: 30,
  },
  sniper: {
    id: 'sniper',
    name: 'Bolt Sniper',
    damage: 110,
    headshotMultiplier: 2.5,
    fireRate: 0.5,
    magazineSize: 1,
    reloadTime: 2.8,
    spread: 0.001,
    recoilX: 0.01,
    recoilY: 0.05,
    range: 300,
  },
};
