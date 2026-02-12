import { Application, Assets, Container, TextureSource } from "pixi.js";
import { DungeonMap } from "./Map";
import type { IEntityStats } from "./types/entityStats";
import { Player } from "./Player";
import { Enemy } from "./Enemy";

const enemies: Enemy[] = [];

async function init() {
    // Get the game container
    const container = document.getElementById("pixi-content");
    if (!container) {
        console.error("Game container 'pixi-content' not found!");
        return;
    }

    // For live information while in debug mode
    const debugHud = document.getElementById('debug-hud');

    // Initialize app
    const app = new Application();
    await app.init({
        resizeTo: container,
        resolution: 1,
        autoDensity: true,
        antialias: true,
        preference: 'webgl'
    });
    TextureSource.defaultOptions.scaleMode = "nearest";
    app.stage.scale.set(1);

    // Add the application to the game container
    container.appendChild(app.canvas);

    // Load the spritesheets
    const groundSheet = await Assets.load("grounds.png");
    const playerSheet = await Assets.load('elf.json');
    const slimeSheet = await Assets.load('slime.json');

    // Create the map
    const dungeon = new DungeonMap(groundSheet, 1, 4, 12, 9);

    const heroStats: IEntityStats = {
        hp: 200,
        maxHp: 200,
        atk: 25,
        speed: 30,
        acceleration: 2.5,
        deceleration: 4
    };

    const slimeStats: IEntityStats = {
        hp: 300,
        maxHp: 300,
        atk: 20,
        speed: 25,
        acceleration: 0,
        deceleration: 0
    };

    const hero = new Player(playerSheet.animations, heroStats);

    // Add to canvas
    const world = new Container();
    app.stage.addChild(world);
    world.addChild(dungeon.container);
    world.addChild(hero);

    const slimeCount = 4;
    for (let i = 0; i < slimeCount; i++) {
        const slime = new Enemy(slimeSheet.animations, slimeStats, hero);
        slime.sprite.x = 200 + (1 * 100);
        slime.sprite.y = 200 + (i * 100);

        enemies.push(slime);
        world.addChild(slime);
    }

    // Update the game
    // app.ticker.maxFPS = 60;
    app.ticker.add((time) => {
        if (app.screen.width === 0 || !hero.sprite) return;
        world.children.sort((a, b) => a.y - b.y);

        hero.update(time.deltaTime);
        hero.drawHitbox(0x00ff00);

        enemies.forEach(enemy => {
            enemy.update(time.deltaTime);
            enemy.drawHitbox(0xff0000);

            if (checkCollision(hero.getBounds(), enemy.getBounds())) {
                hero.takeDamage(enemy.stats['atk']);
            }
        });

        const targetX = (app.screen.width / 2) - hero.sprite.x;
        const targetY = (app.screen.height / 2) - hero.sprite.y;

        if (!isNaN(targetX) && !isNaN(targetY)) {
            world.x = targetX;
            world.y = targetY;
        }

        // Update debug hud contents
        if (debugHud && !hero.isDestroyed) {
            debugHud.innerHTML = hero.getPlayerSummary();
        }
    });
}

function checkCollision(rect1: any, rect2: any) {
    return (
        rect1.x < rect2.x + rect1.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}

init();