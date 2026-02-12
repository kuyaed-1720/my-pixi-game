export interface IEntityStats {
    hp: number;
    maxHp: number;
    atk: number;
    speed: number;
    acceleration: number;
    deceleration: number;
}

export const DEFAULT_ENTITY_STATS: IEntityStats = {
    hp: 100,
    maxHp: 100,
    atk: 10,
    speed: 20,
    acceleration: 1.5,
    deceleration: 0.5
}