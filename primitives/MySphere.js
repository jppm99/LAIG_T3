/**
 * MySphere
 * @constructor
 * @param scene - Reference to MyScene object
 * @param radius - Radius of the sphere
 * @param slices - Number of divisions along the rotation
 * @param stacks - Number of divisions along the height(z-axis)
 */

class MySphere extends CGFobject {
    constructor(scene, id, radius, slices, stacks) {
        super(scene);
        this.radius = radius;
        this.stacks = stacks;
        this.slices = slices;

        this.initBuffers();
    };

    initBuffers() {
        this.vertices = new Array();
        this.indices = new Array();
        this.normals = new Array();
        this.texCoords = new Array();

        var slices_Degree = 2 * Math.PI / this.slices;
        var stacks_Degree = Math.PI / this.stacks;
        var current_Radius;

        for (var i = 0; i < this.stacks; i++) {
            current_Radius = i * stacks_Degree;
            for (var j = 0; j < this.slices; j++) {
                //vertices and normals
                this.vertices.push(
                    this.radius * Math.sin(current_Radius) * Math.cos(j * slices_Degree),
                    this.radius * Math.sin(current_Radius) * Math.sin(j * slices_Degree),
                    this.radius * Math.cos(current_Radius));

                this.normals.push(this.radius * Math.sin(current_Radius) * Math.cos(j * slices_Degree), this.radius * Math.sin(current_Radius) * Math.sin(j * slices_Degree), this.radius * Math.cos(current_Radius));

                this.vertices.push(
                    this.radius * Math.sin(current_Radius + stacks_Degree) * Math.cos(j * slices_Degree),
                    this.radius * Math.sin(current_Radius + stacks_Degree) * Math.sin(j * slices_Degree),
                    this.radius * Math.cos(stacks_Degree * (i + 1)));

                this.normals.push(this.radius * Math.sin(current_Radius + stacks_Degree) * Math.cos(j * slices_Degree), this.radius * Math.sin(current_Radius + stacks_Degree) * Math.sin(j * slices_Degree), this.radius * Math.cos(stacks_Degree * (i + 1))); //Normals in line with the vertexes

                //this.texCoords.push(0.5 + Math.cos(j * slices_Degree) * Math.sin(current_Radius), 1 - (0.5 + Math.sin(j * slices_Degree) * Math.sin(current_Radius)));
                //this.texCoords.push(0.5 + Math.cos(j * slices_Degree) * Math.sin((i + 1) * stacks_Degree), 1 - (0.5 + Math.sin(j * slices_Degree) * Math.sin((i + 1) * stacks_Degree)));

                var vectord1=[-1*(this.radius * Math.sin(current_Radius) * Math.cos(j * slices_Degree)), -1*(this.radius * Math.sin(current_Radius) * Math.sin(j * slices_Degree)),-1*(this.radius * Math.cos(current_Radius))];
                var vectord2=[-1*(this.radius * Math.sin(current_Radius + stacks_Degree) * Math.cos(j * slices_Degree)), -1*(this.radius * Math.sin(current_Radius + stacks_Degree) * Math.sin(j * slices_Degree)),-1*(this.radius * Math.cos(stacks_Degree * (i + 1)))];

                this.texCoords.push(0.5 + Math.atan2(vectord1[1], vectord1[3])/2*Math.PI, 0.5 - Math.asin(vectord1[2])/Math.PI);
                this.texCoords.push(0.5 + Math.atan2(vectord2[1], vectord2[3])/2*Math.PI, 0.5 - Math.asin(vectord2[2])/Math.PI);

                this.indices.push((i * 2 * this.slices) + (2 * j) + 0);
                this.indices.push((i * 2 * this.slices) + (2 * j) + 1);
                this.indices.push((i * 2 * this.slices) + (((2 * j) + 3) % (this.slices * 2)));

                this.indices.push((i * 2 * this.slices) + (((2 * j) + 2) % (this.slices * 2)));
                this.indices.push((i * 2 * this.slices) + (((2 * j) + 0) % (this.slices * 2))); //This doesn't need integer division
                this.indices.push((i * 2 * this.slices) + (((2 * j) + 3) % (this.slices * 2)));
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