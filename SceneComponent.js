/**
 * SceneComponent
 * @constructor
 * @param graph - Reference to MySceneGraph object
 * @param scene - Reference to XMLscene object
 * @param id - Component ID
 * @param transformationId - ID of transformation applied to this component
 * @param children_components - IDs of children components
 * @param children_primitives - IDs of primitives that compose this component
 * @param materials_refs - IDs of material that will/can be applied to the component
 * @param texture_ref - ID of texture that will/can be applied to the component
 * @param length_s - texture scale factor
 * @param length_t - texture scale factor
 * @param animation_ref - ID of animation applied to the component
 */

class SceneComponent {
    constructor(graph,id, scene, children_components, children_primitives, transformationId, materials_refs, texture_ref, length_s, length_t, animation_ref){
        this.graph=graph;
        this.scene=scene;
        this.transformationId=transformationId;

        this.children_components=children_components;
        this.children_primitives=children_primitives;

        this.materials_refs=materials_refs;
        this.texture_ref=texture_ref;
        this.length_s=length_s;
        this.length_t=length_t;

        this.animation_ref=animation_ref;
    }

    display(inherited_material, inherited_texture, inherited_lenght_s, inherited_lenght_t){

        var curr_material = this.materials_refs[this.scene.mCounter % this.materials_refs.length];
        var curr_texture = this.texture_ref;
        var curr_lenght_s = this.length_s;
        var curr_lenght_t = this.length_t ;

        if(this.materials_refs=="inherit")
            curr_material = inherited_material;
        else if(inherited_material!="inherit")
            this.graph.materials[inherited_material].setTexture(null);

        if(this.texture_ref=="inherit") {
            curr_texture  = inherited_texture;
            curr_lenght_s = inherited_lenght_s;
            curr_lenght_t = inherited_lenght_t;
        }

        this.scene.pushMatrix();

        if(this.transformationId!=null) {
           this.scene.multMatrix(this.graph.transformations[this.transformationId]);
        }

        if(this.animation_ref!=null){
            this.graph.animations[this.animation_ref].apply();
        }

        //Apply texture if required or remove it if not
        if(curr_texture!="none"){
            this.graph.materials[curr_material].setTexture(this.graph.textures[curr_texture]);
        }else{
           this.graph.materials[curr_material].setTexture(null);
        }

        //Apply material
        this.graph.materials[curr_material].apply();

        for(var k=0; k < this.children_primitives.length; k++){
            this.graph.primitives[this.children_primitives[k]].updateTexCoords(curr_lenght_s, curr_lenght_t);
            this.graph.primitives[this.children_primitives[k]].display();
        }

        for(var i=0; i < this.children_components.length; i++){
            this.graph.components[this.children_components[i]].display(curr_material, curr_texture, curr_lenght_s, curr_lenght_t);
        }

        this.scene.popMatrix();
    }
}