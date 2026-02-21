import { Application, Container, Text, TextStyle, Ticker } from "pixi.js";

export class UI {
    private container: Container;
    private app: Application;

    private static damageStyle = new TextStyle({
        fontFamily: 'Arial',
        fontSize: 20,
        fill: '#cd201d',
        stroke: { color:'#000000', width: 1 },
        fontWeight: 'bold',
    });

    constructor(app: Application, container: Container) {
        this.app = app;
        this.container = container;
        this.app.stage.addChild(this.container);
    }

    /**
     * Creates a floating damage number that cleans itself up.
     */
    public showDamage(x: number, y: number, amount: number) {
        const pop = new Text({
            text: amount.toString(),
            style: UI.damageStyle
        });

        pop.x = x;
        pop.y = y;
        this.container.addChild(pop);

        let elapsed = 0;
        const duration = 60;

        const ticker = (delta: Ticker) => {
            elapsed += delta.deltaTime;
            // pop.y -= 1.2 * delta.deltaTime;
            pop.alpha -= 0.02 * delta.deltaTime;

            if (pop.alpha <= 0 || elapsed >= duration) {
                this.app.ticker.remove(ticker);
                pop.destroy();
            }
        };

        this.app.ticker.add(ticker);
    }
}