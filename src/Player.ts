import * as PIXI from "pixi.js";
import { Entity } from "./Entity";

export class Player extends Entity {
    private animations: Record<string, PIXI.AnimatedSprite>;
    private currentState: string = 'idle';
    private speed: number = 3;
    private keys: Record<string, boolean> = {};

    constructor(animations: Record<string, PIXI.AnimatedSprite>, health: number, id: string) {
        super(animations['idle'], health, id);
        this.sprite.scale.set(4);
        this.sprite.anchor.set(0.5);
        this.animations = animations;
        this.sprite.animationSpeed = 0.1;
        this.playAnimation('idle');

        window.addEventListener("keydown", (e) => (this.keys[e.code] = true));
        window.addEventListener("keyup", (e) => (this.keys[e.code] = false));
    }

    public update(deltaTime: number) {
        let moveX = 0;
        let moveY = 0;
        let isMoving = false;

        // Capture direction
        if (this.keys["KeyW"]) {
            moveY -= 1;
            isMoving = true;
        }
        if (this.keys["KeyS"]) {
            moveY += 1;
            isMoving = true;
        }
        if (this.keys["KeyA"]) {
            moveX -= 1;
            isMoving = true;
        }
        if (this.keys["KeyD"]) {
            moveX += 1;
            isMoving = true;
        }
        if (this.keys["Space"]) {
            this.attack();
        }

        // Normalise speed
        if (isMoving) {
            const length = Math.sqrt(moveX * moveX + moveY * moveY);

            if (length > 0) {
                const velocityX = (moveX / length) * this.speed;
                const velocityY = (moveY / length) * this.speed;

                this.sprite.x += velocityX * deltaTime;
                this.sprite.y += velocityY * deltaTime;
            }

            // Handle sprite flipping
            if (moveX !== 0) this.sprite.scale.x = moveX > 0 ? 4 : -4;
        }

        if (isMoving) this.currentState = 'walk';
        else this.currentState = 'idle';

        this.playAnimation(this.currentState);
    }

    public playAnimation(key: string) {
        if (this.currentState === key) return;

        this.container.removeChild(this.sprite);
        this.sprite.stop();

        this.currentState = key;
        this.sprite = this.animations[key];

        this.container.addChild(this.sprite);
        this.sprite.play();
    }

    private attack() {
        this.playAnimation('attack');
        this.sprite.onComplete = () => {
            this.playAnimation('idle');
        }
    }
}
