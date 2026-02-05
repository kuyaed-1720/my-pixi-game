import * as PIXI from 'pixi.js';

async function setup() {
    const app =  new PIXI.Application();

    await app.init({
        width: 800,
        height: 600,
        backgroundColor: 0x1099bb,
        antialias: true
    });

    document.body.appendChild(app.canvas);

    const texture = await PIXI.Assets.load('https://pixijs.com/assets/bunny.png');

    const bunny = new PIXI.Sprite(texture);

    bunny.anchor.set(0.5);

    bunny.x = app.screen.width / 2;
    bunny.y = app.screen.height / 2;

    app.stage.addChild(bunny);

    app.ticker.add((time) => {
        bunny.rotation += time.deltaTime;
    });
}

setup();