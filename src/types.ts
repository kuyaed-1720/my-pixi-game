/**
 * types.ts
 * Central definition for all game data structures.
 */

import type { Texture } from "pixi.js";

/**
 * Represents a collection of textures mapped by animation state name.
 */
export type AnimationMap = {
    [key: string]: Texture[]
};

/**
 * Defines a circular area for high-performance procimity and collision checks.
 */
export interface ICircle {
    x: number;
    y: number;
    radius: number;
}

/**
 * Core attributes for any living entity in the game.
 */
export interface IEntityStats {
    /** Current health points; entity dies if reaches 0. */
    hp: number;
    /** Maximum health capacity. */
    maxHp: number;
    /** Damage dealth to others on contact. */
    atk: number;
    /** Base movement speed. */
    speed: number;
    /** Speed increase until reachies max speed. */
    acceleration: number;
    /** Speed decrease until reaches 0. */
    deceleration: number;
}

/**
 * Geometric definition for rectangular collision detection.
 */
export interface IRectangle {
    /** X coordinate in world space. */
    x: number;
    /** Y coordinate in world space. */
    y: number;
    /** Scaled width of the object. */
    width: number;
    /** Scaled height of the object. */
    height: number;
}

/**
 * Simple 2D coordinate or vector representation.
 */
export interface IVector2D {
    x: number;
    y: number;
}