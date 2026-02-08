import * as PIXI from "pixi.js";
import { Player } from "./Player";
import { getAnimationFrames } from "./TextureUtils";
import { DungeonMap } from "./Map";
import { Collectible } from "./Collectible";

const items: Collectible[] = [];
const inventory: { [key: string]: number } = {};
let potionCount = 0;

async function init() {
    // Get the game container
    const container = document.getElementById("pixi-content");
    if (!container) {
        console.error("Game container 'pixi-content' not found!");
        return;
    }

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

    container.appendChild(app.canvas);

    // Ready the textures
    const groundSheet = await PIXI.Assets.load("grounds.png");
    const dungeon = new DungeonMap(groundSheet, 1, 4, 12, 9);

    const itemSheet = await PIXI.Assets.load("pickup_items_animated.png");
    const potionTexture = getAnimationFrames(itemSheet, 2, 3, 16, 16);
    const potion = new Collectible(potionTexture, 300, 300, "Health Potion");

    const elfSheet = await PIXI.Assets.load("elf.png");
    const idleFrames = getAnimationFrames(elfSheet, 0, 3, 16, 16);
    const walkFrames = getAnimationFrames(elfSheet, 2, 3, 16, 16);
    const hero = new Player(idleFrames, walkFrames);

    // Add to canvas
    const world = new PIXI.Container();
    app.stage.addChild(world);
    world.addChild(dungeon.container);
    world.addChild(potion.sprite);
    world.addChild(hero.sprite);

    items.push(potion);

    app.ticker.add((time) => {
        if (app.screen.width === 0 || !hero.sprite) return;

        hero.update(time.deltaTime);

        items.forEach(item => {
            if (!item.isCollected) {
                const dx = hero.sprite.x - item.sprite.x;
                const dy = hero.sprite.y - item.sprite.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 20) {
                    item.collect();

                    const itemType = item.id;
                    inventory[itemType] = (inventory[itemType] || 0) + 1;
                }
            }
        });

        const targetX = (app.screen.width / 2) - hero.sprite.x;
        const targetY = (app.screen.height / 2) - hero.sprite.y;

        if (!isNaN(targetX) && !isNaN(targetY)) {
            world.x = targetX;
            world.y = targetY;
        }

        if (debugHud && hero.sprite) {
            let inventoryText = "";
            for (const [name, count] of Object.entries(inventory)) {
                inventoryText += `<br>${name}: ${count}`;
            }
            debugHud.innerHTML = `
                X: ${hero.sprite.x.toFixed(2)} | Y: ${hero.sprite.y.toFixed(2)}<br>
                Potions: ${potionCount}<br>
                Inventory: ${inventoryText || "Empty"}
            `;
        }
    });
}

init();
