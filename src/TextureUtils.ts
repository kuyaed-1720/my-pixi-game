import * as PIXI from 'pixi.js';

export function getFrame(
    baseTexture: PIXI.Texture,
    col: number,
    row: number,
    width: number,
    height: number,
): PIXI.Texture {
    PIXI.TextureSource.defaultOptions.scaleMode = 'nearest';
    const frame = new PIXI.Rectangle(col * width, row * height, width, height);
    return new PIXI.Texture({
        source: baseTexture.source,
        frame: frame
    });
}