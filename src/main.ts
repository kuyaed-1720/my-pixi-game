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
    hero.update(time.deltaTime);

    const centerX = app.screen.width / 2;
    const centery = app.screen.height / 2;

    world.x = centerX - hero.sprite.x;
    world.y = centery - hero.sprite.y;

    world.x += (centerX - hero.sprite.x - world.x) * 0.1;
  });
}

init();
