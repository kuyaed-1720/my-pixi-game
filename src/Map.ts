import * as PIXI from "pixi.js";
import { getFrame } from "./TextureUtils";

export class DungeonMap {
  public container: PIXI.Container;
  private tileSize: number = 64;

  constructor(
    sheet: PIXI.Texture,
    startCol: number,
    startRow: number,
    width: number,
    height: number,
  ) {
    this.container = new PIXI.Container();
    const tiles = {
      tl: getFrame(sheet, startCol, startRow, 16, 16),
      t: getFrame(sheet, startCol + 1, startRow, 16, 16),
      tr: getFrame(sheet, startCol + 2, startRow, 16, 16),
      l: getFrame(sheet, startCol, startRow + 1, 16, 16),
      c: getFrame(sheet, startCol + 1, startRow + 1, 16, 16),
      r: getFrame(sheet, startCol + 2, startRow + 1, 16, 16),
      bl: getFrame(sheet, startCol, startRow + 2, 16, 16),
      b: getFrame(sheet, startCol + 1, startRow + 2, 16, 16),
      br: getFrame(sheet, startCol + 2, startRow + 2, 16, 16),
    };

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let currentTex: PIXI.Texture;

        if (y === 0) {
          if (x === 0) currentTex = tiles.tl;
          else if (x === width - 1) currentTex = tiles.tr;
          else currentTex = tiles.t;
        } else if (y === height - 1) {
          if (x === 0) currentTex = tiles.bl;
          else if (x === width - 1) currentTex = tiles.br;
          else currentTex = tiles.b;
        } else {
          if (x === 0) currentTex = tiles.l;
          else if (x === width - 1) currentTex = tiles.r;
          else currentTex = tiles.c;
        }

        const tileSprite = new PIXI.Sprite(currentTex);
        tileSprite.x = x * this.tileSize;
        tileSprite.y = y * this.tileSize;
        tileSprite.scale.set(4);

        this.container.addChild(tileSprite);
      }
    }
  }
  // public floor: PIXI.TilingSprite

  // constructor(texture: PIXI.Texture, width: number, height: number) {
  //     this.floor = new PIXI.TilingSprite({
  //         texture: texture,
  //         width: width,
  //         height: height
  //     });

  //     this.floor.tileScale.set(4);
  // }
}
