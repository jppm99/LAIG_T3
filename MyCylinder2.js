class MyCylinder2 extends CGFobject{

    constructor(scene, id, base, top, height, slices, stacks) {
        super(scene);

        this.slices = slices;
        this.bradius = base;
        this.tradius = top;
        this.height = height;
        this.stacks = stacks;

        this.initBuffers();
    };

    initBuffers() {

        var r2s2 = Math.sqrt(2) / 2;

        let surface = new CGFnurbsSurface(8, // degree on U: 9 control vertexes U
            1, // degree on V: 2 control vertexes on V
            [	// U = 0
                [ // V = 0..1;
                    [ this.bradius/2, 0, 0, 1 ],
                    [ this.tradius/2,  this.height, 0, 1 ]

                ],
                // U = 1
                [ // V = 0..1
                    [ this.bradius/2, 0, this.bradius/2, r2s2 ],
                    [ this.tradius/2,  this.height, this.tradius/2, r2s2 ]
                ],
                // U = 2
                [ // V = 0..1
                    [ 0, 0, this.bradius/2, 1 ],
                    [ 0,  this.height, this.tradius/2, 1 ]
                ],
                // U = 3
                [  // V = 0..1
                    [ -this.bradius/2, 0, this.bradius/2, r2s2 ],
                    [ -this.tradius/2,  this.height, this.tradius/2, r2s2 ]
                ],
                // U = 4
                [ // V = 0..1
                    [ -this.bradius/2, 0, 0, 1 ],
                    [ -this.tradius/2,  this.height, 0, 1 ]
                ],
                // U = 5
                [  // V = 0..1
                    [ -this.bradius/2, 0, -this.bradius/2, r2s2 ],
                    [ -this.tradius/2,  this.height, -this.tradius/2, r2s2 ]
                ],
                // U = 6
                [ // V = 0..1
                    [ 0, 0, -this.bradius/2, 1 ],
                    [ 0,  this.height, -this.tradius/2, 1 ]
                ],
                // U = 7
                [  // V = 0..1
                    [ this.bradius/2, 0, -this.bradius/2, r2s2 ],
                    [ this.tradius/2,  this.height, -this.tradius/2, r2s2 ]
                ],
                // U = 8
                [ // V = 0..1
                    [ this.bradius/2, 0, 0, 1 ],
                    [ this.tradius/2,  this.height, 0, 1 ]
                ]
            ], // translation of surface
            [0,0,0]
        );

        this.cylinder = new CGFnurbsObject(this.scene, this.slices, this.stacks, surface);
    }

    display() {
        this.scene.pushMatrix();
        this.scene.translate(0.15, 0.15, 0);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.scene.scale(-1, -1, -1);
        this.cylinder.display();
        this.scene.popMatrix();
    }
}