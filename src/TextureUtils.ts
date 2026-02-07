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

export function getAnimationFrames(
    baseTexture: PIXI.Texture,
    row: number,
    frameCount: number,
    width: number,
    height: number
): PIXI.Texture[] {
    const frames: PIXI.Texture[] = [];
    for (let i = 0; i < frameCount; i++) {
        frames.push(new PIXI.Texture({
            source: baseTexture.source,
            frame: new PIXI.Rectangle(i * width, row * height, width, height)
        }));
    }
    return frames;
}