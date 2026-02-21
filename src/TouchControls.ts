import { Application, Container, FederatedPointerEvent, Graphics } from "pixi.js";

export class TouchControls extends Container {
    public direction = { x: 0, y: 0 };
    private joystick: Graphics;
    private knob: Graphics;
    private attackBtn: Graphics;
    public isAttacking: boolean = false;
    private isDragging: boolean = false;

    constructor(app: Application) {
        const screenHeight = app.screen.height;
        super();
        // base
        this.joystick = new Graphics();
        this.joystick.zIndex = 1000;
        this.joystick.fill({ color: 0xffffff, alpha: 0.2 });
        this.joystick.setStrokeStyle({
            color: 0xffffff,
            alpha: 0.5
        }).circle(0, 0, 60).fill().stroke();
        this.joystick.position.set(100, screenHeight - 100);
        // knob
        this.knob = new Graphics();
        this.knob.setStrokeStyle({
            color: 0xffffff,
            alpha: 0.5
        }).circle(0, 0, 30).stroke();
        this.joystick.addChild(this.knob);
        app.stage.addChild(this.joystick);

        this.attackBtn = new Graphics();
        this.attackBtn.zIndex = 999;
        this.attackBtn.fill({ color: 0xff4444, alpha: 0.5 });
        this.attackBtn.setStrokeStyle({
            color: 0xff4444,
            alpha: 0.5
        }).circle(0, 0, 40).fill().stroke();
        this.attackBtn.position.set(app.screen.width - 100, screenHeight - 100);
        this.attackBtn.eventMode = 'static';
        this.attackBtn.on('pointerdown', () => {
            this.isAttacking = true;
            this.attackBtn.alpha = 1.0;
        });
        this.attackBtn.on('pointerup', () => {
            this.isAttacking = false;
            this.attackBtn.alpha = 0.5;
        });
        this.attackBtn.on('pointerupoutside', () => {
            this.isAttacking = false;
            this.attackBtn.alpha = 0.5;
        });
        app.stage.addChild(this.attackBtn);

        this.joystick.eventMode = 'static';
        this.joystick.on('pointerdown', () => { this.isDragging = true; this.joystick.getBounds(); });
        app.stage.eventMode = 'static';
        app.stage.hitArea = app.screen;
        app.stage.on('pointermove', (e) => {
            if (this.isDragging) {
                this.handleMove(e);
            }
        });
        app.stage.on('pointerup', () => this.handleUp());
        app.stage.on('pointerupoutside', () => this.handleUp());
        // window.addEventListener('pointerup', () => this.handleUp());
        // window.addEventListener('pointermove', (e) => this.handleMove(e));
    }

    public onResize(width: number, height: number) {
        const margin = width < 500 ? 75 : 100;
        this.joystick.x = margin;
        this.joystick.y = height - margin;
        this.attackBtn.position.set(this.joystick.x + margin * 2, height - margin);
    }

    private handleMove(e: FederatedPointerEvent) {
        if (!this.isDragging) return;

        const dx = e.global.x - this.joystick.x;
        const dy = e.global.y - this.joystick.y;
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