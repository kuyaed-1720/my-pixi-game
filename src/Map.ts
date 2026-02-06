import * as PIXI from 'pixi.js';

export class DungeonMap {
    public floor: PIXI.TilingSprite

    constructor(texture: PIXI.Texture, width: number, height: number) {
        this.floor = new PIXI.TilingSprite({
            texture: texture,
            width: width,
            height: height
        });

        this.floor.tileScale.set(4);
    }
}