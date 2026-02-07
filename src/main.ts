import * as PIXI from "pixi.js";
import { Player } from "./Player";
import { getAnimationFrames } from "./TextureUtils";
import { DungeonMap } from "./Map";

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

    const elfSheet = await PIXI.Assets.load("elf.png");
    const idleFrames = getAnimationFrames(elfSheet, 0, 3, 16, 16);
    const walkFrames = getAnimationFrames(elfSheet, 2, 3, 16, 16);
    const hero = new Player(idleFrames, walkFrames);

    // Add to canvas
    const world = new PIXI.Container();
    app.stage.addChild(world);
    world.addChild(dungeon.container);
    world.addChild(hero.sprite);

    app.ticker.add((time) => {
        if (app.screen.width === 0 || !hero.sprite) return;

        hero.update(time.deltaTime);

        const targetX = (app.screen.width / 2) - hero.sprite.x;
        const targetY = (app.screen.height / 2) - hero.sprite.y;

        if (!isNaN(targetX) && !isNaN(targetY)) {
            world.x = targetX;
            world.y = targetY;
        }

        if (debugHud && hero.sprite) {
            debugHud.innerText = `X: ${hero.sprite.x.toFixed(2)} | Y: ${hero.sprite.y.toFixed(2)}`;
        }
    });
}

init();
