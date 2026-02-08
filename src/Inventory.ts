// import * as PIXI from 'pixi.js';
interface inventoryItem { id: string, qty: number };

export class Inventory {
    public items: inventoryItem[] = [];
    public capacity: number;

    constructor(capacity: number) {
        this.capacity = capacity;
    }

    public addItem(itemId: string) {
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].id === itemId) {
                // Will add code for if item max count is reached
                this.items[i].qty++;
                return true;
            }
        }

        if (this.slots() !== 0) {
            this.items.push({ id: itemId, qty: 1 });
            return true;
        }

        return false;
    }

    private slots() {
        return this.capacity - this.items.length;
    }

    public getSummary(): string {
        if (this.items.length === 0) return "Empty";

        return this.items
            .map(item => `${item.id}: x${item.qty}`)
            .join('<br>');
    }
}