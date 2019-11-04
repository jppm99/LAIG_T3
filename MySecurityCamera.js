class MySecurityCamera extends CGFobject {
    constructor(scene) {
        super(scene);
        this.scene = scene;
        this.initBuffers();
    }

    initBuffers() {
        this.rectangle = new MyRectangle(this.scene, undefined, 0, -1, 0, -1);
    }

    display() {
        //super.display();
    }
}