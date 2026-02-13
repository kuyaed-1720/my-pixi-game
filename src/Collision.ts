export interface IRectangle {
    x: number;
    y: number;
    width: number;
    height: number;
}

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
}