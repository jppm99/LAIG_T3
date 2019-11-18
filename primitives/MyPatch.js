class MyPatch extends CGFobject{
    constructor(scene, id, nPU, nPV, nPartsU, nPartsV, points){
        super(scene);

        this.nPU = nPU;
        this.nPV = nPV;

        this.nPartsU = nPartsU;
        this.nPartsV = nPartsV;

        this.points = points;

        this.initBuffers();
    }

    initBuffers() {
        let w = [1];
        let vf = [];
        let vt = [];
        let counter = 0;

        for(var key in this.points){
            if(this.points.hasOwnProperty(key)){
                counter++;

                vt.push(this.points[key].concat(w));

                if(counter % this.nPV === 0){
                    vf.push(vt);
                    vt = [];
                }

            }
        }

        let surface = new CGFnurbsSurface(this.nPU-1,
            this.nPV-1,
            vf
            ,
            [0,0,0]
        );

        this.patch = new CGFnurbsObject(this.scene, this.nPartsU, this.nPartsV, surface);
    }

    display(){
        this.patch.display();
    }

    updateTexCoords(length_s, length_t) {
        this.updateTexCoordsGLBuffers();
    }
}