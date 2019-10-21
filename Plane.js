class Plane extends CGFobject{

    constructor(scene, id, u, v) {
        super(scene);

        this.u = (u === undefined ? 20 : u);
        this.v = (v === undefined ? 20 : v);

        this.initBuffers();
    };

    initBuffers() {
        let surface =  new CGFnurbsSurface(1, // degree on U: 2 control vertexes U
            1, // degree on V: 2 control vertexes on V
            [	// U = 0
                [ // V = 0..1;
                    [-0.5,  0, 0.5, 1 ],
                    [-0.5, 0, -0.5, 1 ]

                ],
                // U = 1
                [ // V = 0..1
                    [ 0.5, 0, 0.5, 1 ],
                    [ 0.5, 0, -0.5, 1 ]
                ]
            ], // translation of surface
            [0,0,0]
        );

        this.plane = new CGFnurbsObject(this.scene, this.u, this.v, surface);
    }

    display() {
        this.plane.display();
    }
}