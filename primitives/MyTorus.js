/**
 * MyTorus
 * @constructor
 * @param scene - Reference to MyScene object
 * @param inner - Radius of the inner loops side
 * @param outer - Radius of the outer loop (center of inner loop - origin)
 * @param slices - Number of divisions along the inner loops
 * @param loops - Number of divisions along the outer loop
 */

class MyTorus extends CGFobject {
    constructor(scene, id, inner, outer, slices, loops) {
        super(scene);
        this.inner=inner;
        this.outer=outer;
        this.slices = slices;
        this.loops = loops;

        this.initBuffers();
    };

    initBuffers() {
        this.vertices = new Array();
        this.indices = new Array();
        this.normals = new Array();
        this.texCoords = new Array();

        var ang_circle = (2 * Math.PI) / this.slices;
        var ang_between_circles = (2 * Math.PI) / this.loops;
        var texS = 1 / this.loops;
        var texT = 1 / this.slices;

        for (var i = 0; i <= this.loops; i++) {
            for (var j = 0; j <= this.slices; j++) {
                var v = i * ang_between_circles;//theta
                var u = j * ang_circle;//phi

                var x= (this.outer+this.inner * Math.cos(v))*Math.cos(u);
                var y= (this.outer+this.inner * Math.cos(v))*Math.sin(u);
                var z= this.inner * Math.sin(v);

                var s = 1 - i * texS;
                var t = 1 - j * texT;

                this.vertices.push(x, y, z);
                this.normals.push(x, y, z);

                this.texCoords.push(s, t);
            }
        }

        for (var i = 0; i < this.loops; i++) {
            for (var j = 0; j < this.slices; j++) {
                var first = i * (this.slices + 1) + j;
                var second = first + this.slices;

                this.indices.push(first, second + 2, second + 1);
                this.indices.push(first, first + 1, second + 2);
            }
        }

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
        //this.texCoords = [...coords];
        this.updateTexCoordsGLBuffers();
    }
}