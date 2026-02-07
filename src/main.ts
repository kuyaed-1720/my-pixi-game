import * as PIXI from "pixi.js";
import { Player } from "./Player";
import { getFrame, getAnimationFrames } from "./TextureUtils";
import { DungeonMap } from "./Map";
import { Collectible } from "./Collectible";

const items: Collectible[] = [];

async function init() {
    // Get the game container
    const container = document.getElementById("pixi-content");
    if (!container) {
        console.error("Game container 'pixi-content' not found!");
        return;
    }

    // Initialize app
    const app = new PIXI.Application();
    await app.init({
        resizeTo: container,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
    });
    PIXI.TextureSource.defaultOptions.scaleMode = "nearest";

    container.appendChild(app.canvas);

    // Ready the textures
    const groundSheet = await PIXI.Assets.load("grounds.png");
    const dungeon = new DungeonMap(groundSheet, 1, 4, 12, 9);

    const itemSheet = await PIXI.Assets.load("pickup_items_animated.png");
    const potionTexture = getFrame(itemSheet, 2, 0, 16, 16);
    const potion = new Collectible(potionTexture, 300, 300, 'Health Potion');

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
        hero.update(time.deltaTime);

        world.x = (app.screen.width / 2) - hero.sprite.x;
        world.y = (app.screen.height / 2) - hero.sprite.y;

        items.forEach(item => {
            if (!item.isCollected) {
                const dx = hero.sprite.x - item.sprite.x;
                const dy = hero.sprite.y - item.sprite.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 20) {
                    item.collect();
                }
            }
        });
    });
}

init();
