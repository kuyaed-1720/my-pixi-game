import { Application, Assets, Container, TextureSource } from "pixi.js";
import { DungeonMap } from "./Map";
import { Player } from "./Player";
import { Enemy } from "./Enemy";
import { Collision } from "./Collision";

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

    const heroStats = {
        hp: 200,
        maxHp: 200,
        atk: 25,
        speed: 30,
        acceleration: 2.5,
        deceleration: 4,
        damageCooldown: 60
    };

    const slimeStats = {
        hp: 300,
        maxHp: 300,
        atk: 20,
        speed: 25,
        acceleration: 0,
        deceleration: 0,
        damageCooldown: 40
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
        slime.x = 200 + (1 * 100);
        slime.y = 200 + (i * 100);

        enemies.push(slime);
        world.addChild(slime);
    }

    // Update the game
    app.ticker.add((time) => {
        if (app.screen.width === 0 || !hero) return;
        world.children.sort((a, b) => a.y - b.y);

        hero.update(time.deltaTime);

        hero.performAttack(enemies);

        enemies.forEach(enemy => {
            if (enemy.stats.hp <= 0) return;
            enemy.update(time.deltaTime);

            if (Collision.checkCircle(hero.getCollisionCircle(), enemy.getCollisionCircle())) {
                hero.takeDamage(enemy.stats['atk'], enemy);
            }
        });

        const targetX = (app.screen.width / 2) - hero.x;
        const targetY = (app.screen.height / 2) - hero.y;

        if (!isNaN(targetX) && !isNaN(targetY)) {
            world.x = targetX;
            world.y = targetY;
        }

        // Update debug hud contents
        if (debugHud && !hero.isDestroyed) {
            debugHud.innerHTML = `
            ${hero.getPlayerSummary()}
            `;
        }
    });
}

init();