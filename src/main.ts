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

        hero.update(time.deltaTime);

        enemies.forEach(enemy => {
            enemy.update(time.deltaTime);
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

// if (enemy && !enemy.isDestroyed) {
//     const dx = hero.sprite.x - enemy.sprite.x;
//     const dy = hero.sprite.y - enemy.sprite.y;
//     const distance = Math.sqrt(dx * dx + dy * dy);

//     if (distance < 50 && hero.isAttacking) {
//         enemy.takeDamage(50);
//     }
// }

// items.forEach(item => {
//     if (!item.isCollected) {
//         const dx = hero.sprite.x - item.sprite.x;
//         const dy = hero.sprite.y - item.sprite.y;
//         const distance = Math.sqrt(dx * dx + dy * dy);

//         if (distance < 20) {
//             const itemType = item.id;
//             if (inventory.addItem(itemType)) {
//                 item.collect();
//             }
//         }
//     }
// });
//     let inventoryText = inventory.getSummary();

//     let enemyText = '';

// if (enemy && !enemy.isDestroyed) { enemyText = `X: ${enemy.sprite.x} Y: ${enemy.sprite.y} | ${enemy.health}`; }

//         Inventory: ${inventoryText}<br>
//         Enemy: ${enemyText};

init();
