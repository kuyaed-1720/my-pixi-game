import * as PIXI from "pixi.js";
import { Player } from "./Player";
import { getAnimationFrames } from "./TextureUtils";
import { DungeonMap } from "./Map";
import { Collectible } from "./Collectible";
import { Inventory } from "./Inventory";
import { Entity } from "./Entity";

const items: Collectible[] = [];
const inventory: Inventory = new Inventory(3);

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
    const app = new PIXI.Application();
    await app.init({
        resizeTo: container,
        resolution: 1,
        autoDensity: true,
        antialias: true
    });
    PIXI.TextureSource.defaultOptions.scaleMode = "nearest";
    app.stage.scale.set(1);

    // Add the application to the game container
    container.appendChild(app.canvas);

    // Load the spritesheets
    const groundSheet = await PIXI.Assets.load("grounds.png");
    const itemSheet = await PIXI.Assets.load("pickup_items_animated.png");
    const elfSheet = await PIXI.Assets.load("elf.png");

    // Ready the animation frames
    const coinTexture = getAnimationFrames(itemSheet, 0, 3, 16, 16);
    const keyTexture = getAnimationFrames(itemSheet, 1, 3, 16, 16);
    const potionTexture = getAnimationFrames(itemSheet, 2, 3, 16, 16);
    const bombTexture = getAnimationFrames(itemSheet, 3, 3, 16, 16);
    const idleFrames = getAnimationFrames(elfSheet, 0, 3, 16, 16);
    const walkFrames = getAnimationFrames(elfSheet, 2, 4, 16, 16);
    const attackFrames = getAnimationFrames(elfSheet, 4, 5, 16, 16);

    // Create the map
    const dungeon = new DungeonMap(groundSheet, 1, 4, 12, 9);

    // Create items with animations
    const coin = new Collectible(coinTexture, 100, 100, "Coin");
    const bomb = new Collectible(bombTexture, 200, 100, "Bomb");
    const potion = new Collectible(potionTexture, 300, 100, "Potion");
    const key = new Collectible(keyTexture, 400, 100, "Key");
    const key2 = new Collectible(keyTexture, 200, 300, "Key");

    // Create the player and initialize the animations
    const animations = {
        idle: new PIXI.AnimatedSprite(idleFrames),
        walk: new PIXI.AnimatedSprite(walkFrames),
        attack: new PIXI.AnimatedSprite(attackFrames)
    };
    const hero = new Player(animations, 200, 'hero');
    const enemy = new Entity(animations['idle'], 200, 'enemy');
    enemy.sprite.x = 300;
    enemy.sprite.y = 300;
    enemy.sprite.scale.set(4);
    enemy.sprite.anchor.set(0.5);
    enemy.sprite.play();

    // Add to canvas
    const world = new PIXI.Container();
    app.stage.addChild(world);
    world.addChild(dungeon.container);
    world.addChild(potion.sprite);
    world.addChild(coin.sprite);
    world.addChild(bomb.sprite);
    world.addChild(key.sprite);
    world.addChild(key2.sprite);
    world.addChild(hero.container);
    world.addChild(enemy.container);

    // Add items to list of collectibles
    items.push(potion);
    items.push(key);
    items.push(key2);
    items.push(coin);
    items.push(bomb);

    // Update the game
    app.ticker.add((time) => {
        if (app.screen.width === 0 || !hero.sprite) return;

        hero.update(time.deltaTime);

        // if (enemy && !enemy.isDestroyed) {
        //     const dx = hero.sprite.x - enemy.sprite.x;
        //     const dy = hero.sprite.y - enemy.sprite.y;
        //     const distance = Math.sqrt(dx * dx + dy * dy);

        //     if (distance < 50) {
        //         enemy.takeDamage(50);
        //     }
        // }

        items.forEach(item => {
            if (!item.isCollected) {
                const dx = hero.sprite.x - item.sprite.x;
                const dy = hero.sprite.y - item.sprite.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 20) {
                    const itemType = item.id;
                    if (inventory.addItem(itemType)) {
                        item.collect();
                    }
                }
            }
        });

        const targetX = (app.screen.width / 2) - hero.sprite.x;
        const targetY = (app.screen.height / 2) - hero.sprite.y;

        if (!isNaN(targetX) && !isNaN(targetY)) {
            world.x = targetX;
            world.y = targetY;
        }

        // Update debug hud contents
        if (debugHud && hero.sprite) {
            let inventoryText = inventory.getSummary();

            let enemyText = '';

            if (enemy && !enemy.isDestroyed) { enemyText = `X: ${enemy.sprite.x} Y: ${enemy.sprite.y} | ${enemy.health}`; }

            debugHud.innerHTML = `
                X: ${hero.sprite.x.toFixed(2)} | Y: ${hero.sprite.y.toFixed(2)}<br>
                Inventory: ${inventoryText}<br>
                Enemy: ${enemyText};
            `;
        }
    });
}

init();
