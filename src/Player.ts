import * as PIXI from "pixi.js";

export class Player {
  public sprite: PIXI.AnimatedSprite;
  private animations: { idle: PIXI.Texture[]; walk: PIXI.Texture[] };
  private speed: number = 3;
  private keys: Record<string, boolean> = {};

  constructor(idleFrames: PIXI.Texture[], walkFrames: PIXI.Texture[]) {
    this.animations = { idle: idleFrames, walk: walkFrames };
    this.sprite = new PIXI.AnimatedSprite(this.animations.idle);
    this.sprite.scale.set(4);
    this.sprite.anchor.set(0.5);
    this.sprite.animationSpeed = 0.1;
    this.sprite.play();

    window.addEventListener("keydown", (e) => (this.keys[e.code] = true));
    window.addEventListener("keyup", (e) => (this.keys[e.code] = false));
  }

  public update(deltaTime: number) {
    let isMoving = false;
    const moveAmount = this.speed * deltaTime;

    if (this.keys["KeyW"]) {
      this.sprite.y -= moveAmount;
      isMoving = true;
    }
    if (this.keys["KeyS"]) {
      this.sprite.y += moveAmount;
      isMoving = true;
    }
    if (this.keys["KeyA"]) {
      this.sprite.x -= moveAmount;
      this.sprite.scale.x = -4;
      isMoving = true;
    }
    if (this.keys["KeyD"]) {
      this.sprite.x += moveAmount;
      this.sprite.scale.x = 4;
      isMoving = true;
    }

    if (isMoving && this.sprite.textures !== this.animations.walk) {
      this.sprite.textures = this.animations.walk;
      this.sprite.play();
    } else if (!isMoving && this.sprite.textures !== this.animations.idle) {
      this.sprite.textures = this.animations.idle;
      this.sprite.play();
    }
  }
}
