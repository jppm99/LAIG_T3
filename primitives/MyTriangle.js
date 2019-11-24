/**
 * MyTriangle
 * @constructor
 * @param scene - Reference to MyScene object
 * @param x1, y1, z1 - Coords of point nº1
 * @param x2, y2, z2 - Coords of point nº2
 * @param x3, y3, z3 - Coords of point nº3
 */

class MyTriangle extends CGFobject {
    constructor(scene, id, x1, y1, z1, x2, y2, z2, x3, y3, z3) {
        super(scene);

        //P1
        this.x1=x1;
        this.y1=y1;
        this.z1=z1;

        //P2
        this.x2=x2;
        this.y2=y2;
        this.z2=z2;

        //P3
        this.x3=x3;
        this.y3=y3;
        this.z3=z3;

        this.initBuffers();
    };

    initBuffers() {
        this.vertices = new Array();
        this.indices = new Array();
        this.normals = new Array();
        this.texCoords = new Array();

        this.vertices.push(this.x1, this.y1, this.z1); //P1
        this.vertices.push(this.x2, this.y2, this.z2); //P2
        this.vertices.push(this.x3, this.y3, this.z3); //P3

        this.indices.push(0, 1, 2);

        //------------------------------------
        //normals
        var A = [this.x1, this.y1, this.z1];
        var B = [this.x2, this.y2, this.z2];
        var C = [this.x3, this.y3, this.z3];
        var vecAC = [C[0] - A[0], C[1] - A[1], C[2] - A[2]];
        var vecAB = [B[0] - A[0], B[1] - A[1], B[2] - A[2]];
        var normalVec = [
            vecAB[1] * vecAC[2] - vecAC[1] * vecAB[2],
            -1 * (vecAB[0] * vecAC[2] - vecAC[0] * vecAB[2]),
            vecAB[0] * vecAC[1] - vecAC[0] * vecAB[1],
        ];

        for (let i = 0; i < 3; i++)
            this.normals.push(normalVec[0], normalVec[1], normalVec[2]);

        //------------------------------------
        //texCoords
        // a -> dist(P1, P2)
        var a = Math.sqrt((this.x2 - this.x1) * (this.x2 - this.x1) +
            (this.y2 - this.y1) * (this.y2 - this.y1) +
            (this.z2 - this.z1) * (this.z2 - this.z1));

        //b -> dist(P2, P3)
        var b = Math.sqrt((this.x3 - this.x2) * (this.x3 - this.x2) +
            (this.y3 - this.y2) * (this.y3 - this.y2) +
            (this.z3 - this.z2) * (this.z3 - this.z2));

        //c -> dist(P1, P3)
        var c = Math.sqrt((this.x1 - this.x3) * (this.x1 - this.x3) +
            (this.y1 - this.y3) * (this.y1 - this.y3) +
            (this.z1 - this.z3) * (this.z1 - this.z3));


        var cosAlpha=(a * a - b * b + c * c ) / (2 * a * c);
        //var cosBeta=(a * a + b * b - c * c ) / (2 * a * c);
        //var cosGama=(-(a * a) + b * b + c * c ) / (2 * a * c);



        var alpha=Math.acos(cosAlpha);

        this.triangleHeight=c * Math.sin(alpha);
        this.triangleBase= a;
        this.p3_projection_on_base=c*cosAlpha;


        this.texCoords.push(0,0); // for P1
        this.texCoords.push(1,0); // for P2
        this.texCoords.push(this.p3_projection_on_base/this.triangleBase,  Math.sin(alpha)); // for P3

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    /**
     * @method updateTexCoords
     * Updates the list of texture coordinates of the rectangle
     * @param lenght_s - Scale factor of applied texture to the primitive width
     * @param lenght_t - Scale factor of applied texture to the primitive height
     */
    updateTexCoords(lenght_s, lenght_t) {
        this.texCoords=[
            0 , 0,
            this.triangleBase/lenght_s , 0,
            this.p3_projection_on_base/lenght_s, this.triangleHeight/lenght_t,
        ];

        this.updateTexCoordsGLBuffers();
    }
}