import * as PIXI from 'pixi.js';
import { Player } from './Player';
import { getFrame } from './TextureUtils';

async function init() {
    const app =  new PIXI.Application();
    await app.init({ width: 800, height: 600 });
    document.body.appendChild(app.canvas);

    const entitySheet = await PIXI.Assets.load('/public/elf.png');
    const heroTexture = getFrame(entitySheet, 0, 0, 16, 16);
    const hero = new Player(heroTexture, 400, 300);
    app.stage.addChild(hero.sprite);

    app.ticker.add((time) => {
        hero.update(time.deltaTime);
    })
}

init();