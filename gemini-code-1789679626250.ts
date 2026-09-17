import * as THREE from 'three';

export class BotAI {
  public mesh: THREE.Mesh;
  public health = 100;
  public shield = 50;
  private moveSpeed = 4.5;
  private fireTimer = 0;

  constructor(public position: THREE.Vector3, private scene: THREE.Scene) {
    const geo = new THREE.CapsuleGeometry(0.5, 1.8, 4, 8);
    const mat = new THREE.MeshStandardMaterial({ color: 0xef4444 });
    this.mesh = new THREE.Mesh(geo, mat);
    this.mesh.position.copy(position);
    this.mesh.castShadow = true;
    this.scene.add(this.mesh);
  }

  public update(dt: number, targetPos: THREE.Vector3, onShoot: (origin: THREE.Vector3, dir: THREE.Vector3) => void): void {
    if (this.health <= 0) return;

    // Strafe and move towards player
    const dirToPlayer = targetPos.clone().sub(this.mesh.position);
    dirToPlayer.y = 0; // Lock rotation to Y axis
    const distance = dirToPlayer.length();
    dirToPlayer.normalize();

    // Maintain combat distance (~8 meters)
    if (distance > 8) {
      this.mesh.position.addScaledVector(dirToPlayer, this.moveSpeed * dt);
    } else if (distance < 5) {
      this.mesh.position.addScaledVector(dirToPlayer, -this.moveSpeed * dt);
    }

    this.mesh.lookAt(targetPos.x, this.mesh.position.y, targetPos.z);

    // Shooting logic
    this.fireTimer += dt;
    if (this.fireTimer >= 0.8 && distance < 25) {
      this.fireTimer = 0;
      const shootOrigin = this.mesh.position.clone().add(new THREE.Vector3(0, 1.2, 0));
      const shootDir = targetPos.clone().sub(shootOrigin).normalize();
      onShoot(shootOrigin, shootDir);
    }
  }

  public takeDamage(amount: number): boolean {
    if (this.shield > 0) {
      this.shield -= amount;
      if (this.shield < 0) {
        this.health += this.shield;
        this.shield = 0;
      }
    } else {
      this.health -= amount;
    }

    if (this.health <= 0) {
      this.scene.remove(this.mesh);
      return true; // Destroyed
    }
    return false;
  }
}