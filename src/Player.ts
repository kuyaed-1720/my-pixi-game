import * as PIXI from 'pixi.js';

export class Player {
    public sprite: PIXI.Sprite;
    private speed: number = 5;
    private keys: Record<string, boolean> ={};

    constructor(texture: PIXI.Texture, startX: number, startY: number) {
        this.sprite = new PIXI.Sprite(texture);
        this.sprite.anchor.set(0.5);
        this.sprite.x = startX;
        this.sprite.y = startY;

        window.addEventListener('keydown', (e) => this.keys[e.code] = true);
        window.addEventListener('keyup', (e) => this.keys[e.code] = false);
    }

    public update(deltaTime: number) {
        const moveAmount = this.speed * deltaTime;

        if (this.keys['KeyW']) this.sprite.y -= moveAmount;
        if (this.keys['KeyS']) this.sprite.y += moveAmount;
        if (this.keys['KeyA']) {
            this.sprite.x -= moveAmount;
            this.sprite.scale.x = -1;
        }
        if (this.keys['KeyD']) {
            this.sprite.x += moveAmount;
            this.sprite.scale.x = 1;
        }
    }
}