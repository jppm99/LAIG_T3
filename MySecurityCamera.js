class MySecurityCamera extends CGFobject {
    constructor(scene) {
        super(scene);
        this.scene = scene;
        this.initBuffers();
    }

    initBuffers() {
        this.rectangle = new MyRectangle(this.scene, undefined, 0.5, 1, -1, -0.5);
    }

    display() {
        this.rectangle.display();
    }
}