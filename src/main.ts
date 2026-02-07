import * as PIXI from 'pixi.js';
import { Player } from './Player';
import { getFrame } from './TextureUtils';
import { DungeonMap } from './Map';

async function init() {
    // Get the game container
    const container = document.getElementById('pixi-content');
    if(!container) {
        console.error("Game container 'pixi-content' not found!");
        return;
    }

    // Initialize app
    const app =  new PIXI.Application();
    await app.init({
        resizeTo: container,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
    });
    PIXI.TextureSource.defaultOptions.scaleMode = 'nearest';

    container.appendChild(app.canvas);

    // Ready the textures
    const floorSheet = await PIXI.Assets.load('/public/grounds.png');
    const floorTexture = getFrame(floorSheet, 0, 0, 16, 16);
    const map = new DungeonMap(floorTexture, app.screen.width, app.screen.height);

    const entitySheet = await PIXI.Assets.load('/public/elf.png');
    const heroTexture = getFrame(entitySheet, 0, 0, 16, 16);
    const hero = new Player(heroTexture, 400, 400);

    // Add to canvas
    app.stage.addChild(map.floor);
    app.stage.addChild(hero.sprite);

    app.ticker.add((time) => {
        hero.update(time.deltaTime);
    })
}

init();