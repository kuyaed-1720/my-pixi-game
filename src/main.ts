import * as PIXI from 'pixi.js';
import { Player } from './Player';

async function init() {
    const app =  new PIXI.Application();

    await app.init({
        width: 800,
        height: 600,
    });

    document.body.appendChild(app.canvas);

    const texture = await PIXI.Assets.load('/public/elf.png');
    const hero = new Player(texture, 400, 300);
    app.stage.addChild(hero.sprite);

    app.ticker.add((time) => {
        hero.update(time.deltaTime);
    })
}

init();