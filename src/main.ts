import { Application, Assets, Container, TextureSource } from "pixi.js";
import { DungeonMap } from "./Map";
import { Entity } from "./Entity";
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
    const enemyHud = document.getElementById('enemy-hud');

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
        atk: 50,
        speed: 30,
        acceleration: 2.5,
        deceleration: 4,
        damageCooldown: 6
    };

    const slimeStats = {
        hp: 500,
        maxHp: 500,
        atk: 20,
        speed: 25,
        acceleration: 0,
        deceleration: 0,
        damageCooldown: 4
    };

    const hero = new Player(playerSheet.animations, heroStats);

    // Add to canvas
    const world = new Container();
    world.sortableChildren = true;
    app.stage.addChild(world);
    world.addChild(dungeon.container);
    world.addChild(hero);

    const slimeCount = 4;
    for (let i = 0; i < slimeCount; i++) {
        const slime = new Enemy(slimeSheet.animations, slimeStats, hero);
        slime.x = 200 + (1 * 100);
        slime.y = 200 + (i * 100);

        const p = document.createElement('p');
        p.id = `enemy${i}`;
        slime.stats.id = i;
        p.innerHTML = ``;
        if (enemyHud) enemyHud.appendChild(p);

        enemies.push(slime);
        world.addChild(slime);
    }

    // Update the game
    app.ticker.add((time) => {
        if (app.screen.width === 0) return;
        const dt = Math.min(time.deltaTime, 0.1);

        hero.update(dt);

        hero.performAttack(enemies);

        while (Entity.deadQueue.length > 0) {
            const corpse = Entity.deadQueue.pop();
            if (corpse?.entityType === 'enemy') {
                const enemyCorpse = corpse as Enemy;
                const index = enemies.indexOf(enemyCorpse!);
                if (index > -1) {
                    enemies.splice(index, 1);
                }
            }
        }

        enemies.forEach(enemy => {
            if (enemy.stats.hp <= 0) return;
            enemy.update(dt);

            if (hero && !hero.isDestroyed) {
            if (Collision.checkCircle(hero.getCollisionCircle(), enemy.getCollisionCircle())) {
                hero.takeDamage(enemy.stats.atk, enemy);
            }
            }
        });

        if (hero && !hero.isDestroyed) {
            const targetX = (app.screen.width / 2) - hero.x;
            const targetY = (app.screen.height / 2) - hero.y;

            if (!isNaN(targetX) && !isNaN(targetY)) {
                world.x = targetX;
                world.y = targetY;
            }
        }

        // Update debug hud contents
        if (debugHud && !hero.isDestroyed) {
            debugHud.innerHTML = `
            ${hero.getPlayerSummary()}
            `;
            enemies.forEach(enemy => {
                const distanceX = hero.x - enemy.x;
                const distanceY = hero.y - enemy.y;
                const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

                if (enemyHud && enemy.getStats() >= distance) {
                    enemyHud.innerHTML = `${enemy.getEnemySummary()}`;
                }
            });
        }
    });
}

init();