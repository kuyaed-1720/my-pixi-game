import type { ICircle, IRectangle } from "./types";

export class Collision {
    /**
     * Checks if two rectangular hitboxes are overlapping.
     * Based on AABB (Axis-Aligned Bounding Box) logic
     * @param r1 The first rectangle
     * @param r2 The second rectangle
     * @returns True if they overlap, false otherwise.
     */
    public static check(r1: IRectangle, r2: IRectangle): boolean {
        return r1.x < r2.x + r2.width &&
            r1.x + r1.width > r2.x &&
            r1.y < r2.y + r2.height &&
            r1.y + r1.height > r2.y;
    }

    /**
     * Checks if two circles are overlapping.
     * Uses the Pythagorean theorem: a**2 + b**2 = c**2
     */
    public static checkCircle(a: ICircle, b: ICircle): boolean {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distanceSq = dx ** 2 + dy ** 2;
        const radiusSum = a.radius + b.radius;

        return distanceSq < (radiusSum ** 2);
    }
}