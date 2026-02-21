import { Application, Container, Graphics } from "pixi.js";

export class TouchControls extends Container {
    public direction = { x: 0, y: 0 };
    private joystick: Graphics;
    private knob: Graphics;
    // private attack: Graphics;
    private isDragging: boolean = false;

    constructor(app: Application) {
        const screenHeight = app.screen.height;
        super();
        // base
        this.joystick = new Graphics();
        this.joystick.setStrokeStyle({
            color: 0xffffff,
            alpha: 0.2
        }).circle(0, 0, 60).stroke();
        this.joystick.position.set(100, screenHeight - 100);
        // knob
        this.knob = new Graphics();
        this.knob.setStrokeStyle({
            color: 0xffffff,
            alpha: 0.5
        }).circle(0, 0, 30).stroke();
        this.joystick.addChild(this.knob);
        app.stage.addChild(this.joystick);

        this.joystick.eventMode = 'static';
        this.joystick.on('pointerdown', () => this.isDragging = true);
        window.addEventListener('pointerup', () => this.handleUp());
        window.addEventListener('pointermove', (e) => this.handleMove(e));
    }

    public onResize(width: number, height: number) {
        const margin = width < 500 ? 60 : 100;
        this.joystick.x = margin;
        this.joystick.y = height - margin;
    }

    private handleMove(e: PointerEvent) {
        if (!this.isDragging) return;

        const dx = e.clientX - this.joystick.x;
        const dy = e.clientY - this.joystick.y;
        const dist = Math.sqrt(dx ** 2 + dy ** 2);
        const maxDist = 60;

        const angle = Math.atan2(dy, dx);
        const limitDist = Math.min(dist, maxDist);

        this.knob.x = Math.cos(angle) * limitDist;
        this.knob.y = Math.sin(angle) * limitDist;

        this.direction.x = this.knob.x / maxDist;
        this.direction.y = this.knob.y / maxDist;
    }

    private handleUp() {
        this.isDragging = false;
        this.knob.position.set(0, 0);
        this.direction.x = 0;
        this.direction.y = 0;
    }
}