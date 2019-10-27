var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var AMBIENT_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX = 6;
var ANIMATIONS_INDEX = 7;
var PRIMITIVES_INDEX = 8;
var COMPONENTS_INDEX = 9;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * @constructor
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.nodes = [];

        this.idRoot = null;                    // The id of the root element.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // File reading 
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */
        this.reader.open('scenes/' + filename, this);
    }

    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "lxs")
            return "root tag <lxs> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        var error;

        // Processes each node, verifying errors.

        // <scene>
        var index;
        if ((index = nodeNames.indexOf("scene")) == -1)
            return "tag <scene> missing";
        else {
            if (index != SCENE_INDEX)
                this.onXMLMinorError("tag <scene> out of order " + index);

            //Parse scene block
            if ((error = this.parseScene(nodes[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseView(nodes[index])) != null)
                return error;
        }

        // <ambient>
        if ((index = nodeNames.indexOf("ambient")) == -1)
            return "tag <ambient> missing";
        else {
            if (index != AMBIENT_INDEX)
                this.onXMLMinorError("tag <ambient> out of order");

            //Parse ambient block
            if ((error = this.parseAmbient(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }
        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <transformations>
        if ((index = nodeNames.indexOf("transformations")) == -1)
            return "tag <transformations> missing";
        else {
            if (index != TRANSFORMATIONS_INDEX)
                this.onXMLMinorError("tag <transformations> out of order");

            //Parse transformations block
            if ((error = this.parseTransformations(nodes[index])) != null)
                return error;
        }

        // <animations>
        if ((index = nodeNames.indexOf("animations")) == -1)
            return "tag <animations> missing";
        else {
            if (index != ANIMATIONS_INDEX)
                this.onXMLMinorError("tag <animations> out of order");

            //Parse animations block
            if ((error = this.parseAnimations(nodes[index])) != null)
                return error;
        }

        // <primitives>
        if ((index = nodeNames.indexOf("primitives")) == -1)
            return "tag <primitives> missing";
        else {
            if (index != PRIMITIVES_INDEX)
                this.onXMLMinorError("tag <primitives> out of order");

            //Parse primitives block
            if ((error = this.parsePrimitives(nodes[index])) != null)
                return error;
        }

        // <components>
        if ((index = nodeNames.indexOf("components")) == -1)
            return "tag <components> missing";
        else {
            if (index != COMPONENTS_INDEX)
                this.onXMLMinorError("tag <components> out of order");

            //Parse components block
            if ((error = this.parseComponents(nodes[index])) != null)
                return error;
        }
        this.log("all parsed");
    }

    /**
     * Parses the <scene> block. 
     * @param {scene block element} sceneNode
     */
    parseScene(sceneNode) {

        // Get root of the scene.
        var root = this.reader.getString(sceneNode, 'root')
        if (root == null)
            return "no root defined for scene";

        this.idRoot = root;

        // Get axis length        
        var axis_length = this.reader.getFloat(sceneNode, 'axis_length');
        if (axis_length == null)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        this.referenceLength = axis_length || 1;

        this.log("Parsed scene");

        return null;
    }

    /**
     * Parses the <views> block.
     * @param {view block element} viewsNode
     */
    parseView(viewsNode) {

        // Get default view of the scene.
        var defaultView = this.reader.getString(viewsNode, 'default')
        if (defaultView == null)
            return "no default view defined for scene";

        this.defaultViewID = defaultView;

        var children = viewsNode.children;

        this.views=[];

        var grandChildren = [];
        var nodeNames = [];

        // Any number of views.
        for (var i = 0; i < children.length; i++) {

            // Storing views information
            var global = [];
            var attributeNames = [];

            //Check type of view
            if (children[i].nodeName != "perspective" && children[i].nodeName != "ortho") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            else {
                attributeNames.push(...["from", "to", "up"]);
            }

            // Get id of the current view.
            var viewId = this.reader.getString(children[i], 'id');
            if (viewId == null)
                return "no ID defined for view";

            // Checks for repeated IDs.
            if (this.views[viewId] != null)
                return "ID must be unique for each view (conflict: ID = " + viewId + ")";

            //Add type name to view info
            global.push(children[i].nodeName);

            var near = this.reader.getFloat(children[i], 'near');
            if (!(near != null && !isNaN(near)))
                return "unable to parse near of the view for ID = " + viewId;

            var far = this.reader.getFloat(children[i], 'far');
            if (!(far != null && !isNaN(far)))
                return "unable to parse far of the view for ID = " + viewId;

            //Add near and far values
            global.push(...[near, far]);

            if(children[i].nodeName == "perspective") {

                var angle = this.reader.getFloat(children[i], 'angle');
                if (!(angle != null && !isNaN(angle)))
                    return "unable to parse angle of the view for ID = " + viewId;

                //Add angle value to a perspective view
                global.push(angle);

            }else{

                var left = this.reader.getFloat(children[i], 'left');
                if (!(left != null && !isNaN(left)))
                    return "unable to parse left of the view for ID = " + viewId;

                var right = this.reader.getFloat(children[i], 'right');
                if (!(right != null && !isNaN(right)))
                    return "unable to parse right of the view for ID = " + viewId;

                var top = this.reader.getFloat(children[i], 'top');
                if (!(top != null && !isNaN(top)))
                    return "unable to parse top of the view for ID = " + viewId;

                var bottom = this.reader.getFloat(children[i], 'bottom');
                if (!(bottom != null && !isNaN(bottom)))
                    return "unable to parse bottom of the view for ID = " + viewId;

                //Add left, right, top and bottom values to a ortho view
                global.push(...[left, right, top, bottom]);

            }

            grandChildren = children[i].children;
            // Specifications for the current view.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            for (var j = 0; j < attributeNames.length; j++) {
                var attributeIndex = nodeNames.indexOf(attributeNames[j]);

                if(attributeNames[j]=="up" && attributeIndex == -1) {
                    global.push(...[0, 1, 0]);
                    continue;
                }

                if (attributeIndex != -1) {
                    var aux = this.parseCoordinates3D(grandChildren[attributeIndex], attributeNames[j] + " attribute for ID" + viewId);

                    if (!Array.isArray(aux))
                        return aux;

                    global.push(aux);
                }
                else
                    return "view " + attributeNames[i] + " undefined for ID = " + viewId;
            }

            this.views[viewId] = global;
        }

        this.log("Parsed views");
        return null;
    }

    /**
     * Parses the <ambient> node.
     * @param {ambient block element} ambientsNode
     */
    parseAmbient(ambientsNode) {

        var children = ambientsNode.children;

        this.ambient = [];
        this.background = [];

        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var ambientIndex = nodeNames.indexOf("ambient");
        var backgroundIndex = nodeNames.indexOf("background");

        var color = this.parseColor(children[ambientIndex], "ambient");
        if (!Array.isArray(color))
            return color;
        else
            this.ambient = color;

        color = this.parseColor(children[backgroundIndex], "background");
        if (!Array.isArray(color))
            return color;
        else
            this.background = color;

        this.log("Parsed ambient");

        return null;
    }

    /**
     * Parses the <light> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {
        var children = lightsNode.children;

        this.lights = [];
        var numLights = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of lights.
        for (var i = 0; i < children.length; i++) {

            // Storing light information
            var global = [];
            var attributeNames = [];
            var attributeTypes = [];

            //Check type of light
            if (children[i].nodeName != "omni" && children[i].nodeName != "spot") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            else {
                attributeNames.push(...["location", "ambient", "diffuse", "specular", "attenuation"]);
                attributeTypes.push(...["position", "color", "color", "color", "attenuation"]);
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

            // Light enable/disable
            var enableLight = true;
            var aux = this.reader.getBoolean(children[i], 'enabled');
            if (!(aux != null && !isNaN(aux) && (aux == true || aux == false)))
                this.onXMLMinorError("unable to parse value component of the 'enable light' field for ID = " + lightId + "; assuming 'value = 1'");

            enableLight = aux || 1;

            //Add enabled boolean and type name to light info
            global.push(enableLight);
            global.push(children[i].nodeName);

            grandChildren = children[i].children;
            // Specifications for the current light.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            for (var j = 0; j < attributeNames.length; j++) {
                var attributeIndex = nodeNames.indexOf(attributeNames[j]);

                if (attributeIndex != -1) {
                    if (attributeTypes[j] == "position")
                        var aux = this.parseCoordinates4D(grandChildren[attributeIndex], "light position for ID " + lightId);
                    else if (attributeTypes[j] == "color")
                        var aux = this.parseColor(grandChildren[attributeIndex], attributeNames[j] + " illumination for ID" + lightId);
                    else
                        var aux = this.parseAttenuation(grandChildren[attributeIndex], "attenuation block for light wit ID "+lightId);

                    if (!Array.isArray(aux))
                        return aux;

                    global.push(aux);
                }
                else
                    return "light " + attributeNames[j] + " undefined for ID = " + lightId;
            }

            // Gets the additional attributes of the spot light
            if (children[i].nodeName == "spot") {
                var angle = this.reader.getFloat(children[i], 'angle');
                if (!(angle != null && !isNaN(angle)))
                    return "unable to parse angle of the light for ID = " + lightId;

                var exponent = this.reader.getFloat(children[i], 'exponent');
                if (!(exponent != null && !isNaN(exponent)))
                    return "unable to parse exponent of the light for ID = " + lightId;

                var targetIndex = nodeNames.indexOf("target");

                // Retrieves the light target.
                var targetLight = [];
                if (targetIndex != -1) {
                    var aux = this.parseCoordinates3D(grandChildren[targetIndex], "target light for ID " + lightId);
                    if (!Array.isArray(aux))
                        return aux;

                    targetLight = aux;
                }
                else
                    return "light target undefined for ID = " + lightId;

                global.push(...[angle, exponent, targetLight])
            }

            this.lights[lightId] = global;
            numLights++;
        }

        if (numLights == 0)
            return "at least one light must be defined";
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        this.log("Parsed lights");
        return null;
    }

    /**
     * Parses the <textures> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {
        var children = texturesNode.children;

        this.textures = [];
        var numTextures = 0;

        // Any number of textures.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "texture") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current texture.
            var textureID = this.reader.getString(children[i], 'id');
            if (textureID == null)
                return "no ID defined for texture";

            // Checks for repeated IDs.
            if (this.textures[textureID] != null)
                return "ID must be unique for each texture (conflict: ID = " + textureID + ")";

            //Get File relative path
            var texturePath = this.reader.getString(children[i], 'file');
            if (texturePath == null)
                return "no Path defined for texture "+textureID;

            this.textures[textureID] = new CGFtexture(this.scene, "./" + texturePath);
            numTextures++;

        }
        if(numTextures<1)
            return "At least one texture must be defined";

        this.log("Parsed textures");
        return null;
    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        var children = materialsNode.children;

        this.materials = [];
        var numMaterials=0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of materials.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "material") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current material.
            var materialID = this.reader.getString(children[i], 'id');
            if (materialID == null)
                return "no ID defined for material";

            // Checks for repeated IDs.
            if (this.materials[materialID] != null)
                return "ID must be unique for each material (conflict: ID = " + materialID + ")";

            var materialShininess = this.reader.getString(children[i], 'shininess');
            if (materialShininess == null)
                return "no Shininess defined for material with ID " + materialID;

            grandChildren = children[i].children;
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }


            var emissionIndex = nodeNames.indexOf("emission");
            var ambientIndex = nodeNames.indexOf("ambient");
            var diffuseIndex = nodeNames.indexOf("diffuse");
            var specularIndex = nodeNames.indexOf("specular");

            var emissionCoords = [];
            var ambientCoords = [];
            var diffuseCoords = [];
            var specularCoords = [];

            //Emission
            if (emissionIndex  == -1)
                return "tag <emission> missing of material with ID " + materialID;
            else{
                emissionCoords = this.parseColor(grandChildren[emissionIndex], "emission block of material with ID "+ materialID);

                if (!Array.isArray(emissionCoords))
                    return emissionCoords;
            }

            //Ambient
            if (ambientIndex  == -1)
                return "tag <ambient> missing of material with ID " + materialID;
            else{
                ambientCoords = this.parseColor(grandChildren[ambientIndex], "ambient block of material with ID "+ materialID);

                if (!Array.isArray(ambientCoords))
                    return ambientCoords;
            }

            //Diffuse
            if (diffuseIndex  == -1)
                return "tag <diffuse> missing of material with ID " + materialID;
            else{
                diffuseCoords = this.parseColor(grandChildren[diffuseIndex], "diffuse block of material with ID "+ materialID);

                if (!Array.isArray(diffuseCoords))
                    return diffuseCoords;
            }

            //Specular
            if (specularIndex  == -1)
                return "tag <specular> missing of material with ID " + materialID;
            else{
                specularCoords = this.parseColor(grandChildren[specularIndex], "specular block of material with ID "+ materialID);

                if (!Array.isArray(specularCoords))
                    return specularCoords;
            }

            var material = new CGFappearance(this.scene);
            material.setShininess(materialShininess);
            material.setEmission(emissionCoords[0], emissionCoords[1], emissionCoords[2], emissionCoords[3]);
            material.setAmbient(ambientCoords[0], ambientCoords[1], ambientCoords[2], ambientCoords[3]);
            material.setDiffuse(diffuseCoords[0], diffuseCoords[1], diffuseCoords[2], diffuseCoords[3]);
            material.setSpecular(specularCoords[0], specularCoords[1], specularCoords[2], specularCoords[3]);

            this.materials[materialID]=material;
            numMaterials++;
        }
        if(numMaterials<1)
            return "At least one material must be defined";

        this.log("Parsed materials");
        return null;
    }

    /**
     * Parses the <transformations> block.
     * @param {transformations block element} transformationsNode
     */
    parseTransformations(transformationsNode) {
        var children = transformationsNode.children;

        this.transformations = [];

        var grandChildren = [];

        // Any number of transformations.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "transformation") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current transformation.
            var transformationID = this.reader.getString(children[i], 'id');
            if (transformationID == null)
                return "no ID defined for transformation";

            // Checks for repeated IDs.
            if (this.transformations[transformationID] != null)
                return "ID must be unique for each transformation (conflict: ID = " + transformationID + ")";

            grandChildren = children[i].children;
            // Specifications for the current transformation.

            var transfMatrix = mat4.create();

            for (var j = 0; j < grandChildren.length; j++) {
                switch (grandChildren[j].nodeName) {
                    case 'translate':
                        var coordinates = this.parseCoordinates3D(grandChildren[j], "translate transformation for ID " + transformationID);
                        if (!Array.isArray(coordinates))
                            return coordinates;

                        transfMatrix = mat4.translate(transfMatrix, transfMatrix, coordinates);
                        break;
                    case 'scale':
                        var coordinates = this.parseCoordinates3D(grandChildren[j], "scale transformation for ID " + transformationID);
                        if (!Array.isArray(coordinates))
                            return coordinates;

                        transfMatrix = mat4.scale(transfMatrix, transfMatrix, coordinates);
                        break;
                    case 'rotate':
                        // axis
                        var axis = this.reader.getString(grandChildren[j], 'axis');
                        if (axis == null)
                            return "unable to parse axis of the rotate transformation for ID " + transformationID;

                        // angle
                        var angle = this.reader.getFloat(grandChildren[j], 'angle');
                        if (!(angle != null && !isNaN(angle)))
                            return "unable to parse angle of the rotate transformation for ID " + transformationID;

                        switch(axis){
                            case "x":
                                transfMatrix= mat4.rotateX(transfMatrix, transfMatrix, angle*DEGREE_TO_RAD);
                                break;
                            case "y":
                                transfMatrix= mat4.rotateY(transfMatrix, transfMatrix, angle*DEGREE_TO_RAD);
                                break;
                            case "z":
                                transfMatrix= mat4.rotateZ(transfMatrix, transfMatrix, angle*DEGREE_TO_RAD);
                                break;
                            default:
                                break;
                        }
                        break;
                    default:
                        return "tag "+grandChildren[j].nodeName+" not recognised in transformation "+ transformationID;
                }
            }
            this.transformations[transformationID] = transfMatrix;
        }

        this.log("Parsed transformations");
        return null;
    }


    /**
     * Parses the <animations> block.
     * @param {animations block element} animationsNode
     */
    parseAnimations(animationsNode) {
        var children = animationsNode.children;

        this.animations = [];

        var grandChildren = [];
        var grandgrandChildren = [];
        var nodeNames = [];

        // Any number of animations.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "animation") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current animation.
            var animationID = this.reader.getString(children[i], 'id');
            if (animationID == null)
                return "no ID defined for animationID";

            // Checks for repeated IDs.
            if (this.animations[animationID] != null)
                return "ID must be unique for each animation (conflict: ID = " + animationID + ")";

            grandChildren = children[i].children;
            if(grandChildren.length<1)
                return "animation with Id "+animationID +" doesn't have any keyframes";

            // Any number of keyframes.
            var keyframes=[];
            var prev_instant=-1;
            for(var j = 0; j < grandChildren.length; j++) {

                if (grandChildren[j].nodeName != "keyframe") {
                    this.onXMLMinorError("unknown tag <" + grandChildren[j].nodeName + ">");
                    continue;
                }

                // Get instant of the current keyframe.
                var instant = this.reader.getFloat(grandChildren[j], 'instant');
                if (!(instant != null && !isNaN(instant)))
                    return "unable to parse instant of keyframe for animation with ID " + animationID;

                if(instant < 0)
                    return "instant can not be inferior to zero. Conflict on animation with ID " + animationID;

                // Checks if this keyframe is in the right order (instant>prev_instants).
                if(instant <= prev_instant )
                    return "keyframes are out of order for animation with ID "+animationID;

                prev_instant=instant;

                //Parse the Animation Matrix
                grandgrandChildren = grandChildren[j].children;

                nodeNames = [];
                for(var k=0; k < grandgrandChildren.length; k++){
                    nodeNames.push(grandgrandChildren[k].nodeName);
                }

                var translateIndex = nodeNames.indexOf("translate");
                var rotateIndex = nodeNames.indexOf("rotate");
                var scaleIndex = nodeNames.indexOf("scale");

                var keyframeMatrix = mat4.create();

                if(translateIndex == -1)
                    return "tag <translate> missing from keyframe with instant "+ instant + " from animation with id "+animationID;
                else{
                    var coordinates = this.parseCoordinates3D(grandgrandChildren[translateIndex], "translate transformation for keyframe with "+ instant +" from animation with ID " + animationID);
                    if (!Array.isArray(coordinates))
                        return coordinates;

                    keyframeMatrix = mat4.translate(keyframeMatrix, keyframeMatrix, coordinates);
                }

                if(rotateIndex == -1)
                    return "tag <rotate> missing from keyframe with instant "+ instant + " from animation with id "+animationID;
                else{
                    // angle_x
                    var angle_x = this.reader.getFloat(grandgrandChildren[rotateIndex], 'angle_x');
                    if (!(angle_x != null && !isNaN(angle_x)))
                        return "unable to parse angle_x of the rotate transformation for keyframe with "+ instant +" from animation with ID " + animationID;

                    // angle_y
                    var angle_y = this.reader.getFloat(grandgrandChildren[rotateIndex], 'angle_y');
                    if (!(angle_y != null && !isNaN(angle_y)))
                        return "unable to parse angle_y of the rotate transformation for keyframe with "+ instant +" from animation with ID " + animationID;

                    // angle_z
                    var angle_z = this.reader.getFloat(grandgrandChildren[rotateIndex], 'angle_z');
                    if (!(angle_z != null && !isNaN(angle_z)))
                        return "unable to parse angle_z of the rotate transformation for keyframe with "+ instant +" from animation with ID " + animationID;

                    keyframeMatrix= mat4.rotateX(keyframeMatrix, keyframeMatrix, angle_x*DEGREE_TO_RAD);
                    keyframeMatrix= mat4.rotateY(keyframeMatrix, keyframeMatrix, angle_y*DEGREE_TO_RAD);
                    keyframeMatrix= mat4.rotateZ(keyframeMatrix, keyframeMatrix, angle_z*DEGREE_TO_RAD);
                }

                if(scaleIndex == -1)
                    return "tag <scale> missing from keyframe with instant "+ instant + " from animation with id "+animationID;
                else{
                    var coordinates = this.parseCoordinates3D(grandgrandChildren[scaleIndex], "scale transformation for keyframe with "+ instant +" from animation with ID " + animationID);
                    if (!Array.isArray(coordinates))
                        return coordinates;

                    keyframeMatrix = mat4.scale(keyframeMatrix, keyframeMatrix, coordinates);
                }

                keyframes.push(new KeyFrame(instant, keyframeMatrix));
            }

            var animation = new KeyframeAnimation(this.scene, keyframes);

            this.animations[animationID]= animation;
        }

        this.log("Parsed animations");
        return null;
    }


    /**
     * Parses the <primitives> block.
     * @param {primitives block element} primitivesNode
     */
    parsePrimitives(primitivesNode) {
        var children = primitivesNode.children;

        this.primitives = [];

        var grandChildren = [];

        // Any number of primitives.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "primitive") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current primitive.
            var primitiveId = this.reader.getString(children[i], 'id');
            if (primitiveId == null)
                return "no ID defined for texture";

            // Checks for repeated IDs.
            if (this.primitives[primitiveId] != null)
                return "ID must be unique for each primitive (conflict: ID = " + primitiveId + ")";

            grandChildren = children[i].children;

            // Validate the primitive type
            if (grandChildren.length != 1 ||
                (grandChildren[0].nodeName != 'rectangle' && grandChildren[0].nodeName != 'triangle' &&
                    grandChildren[0].nodeName != 'cylinder' && grandChildren[0].nodeName != 'sphere' &&
                    grandChildren[0].nodeName != 'torus' && grandChildren[0].nodeName != 'patch' &&
                    grandChildren[0].nodeName != 'cylinder2' && grandChildren[0].nodeName != 'plane')) {
                return "There must be exactly 1 primitive type (rectangle, triangle, cylinder, sphere, torus, cylinder2, patch or plane)"
            }

            // Specifications for the current primitive.
            var primitiveType = grandChildren[0].nodeName;

            // Retrieves the primitive coordinates.
            if (primitiveType == 'rectangle') {
                // x1
                var x1 = this.reader.getFloat(grandChildren[0], 'x1');
                if (!(x1 != null && !isNaN(x1)))
                    return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;

                // y1
                var y1 = this.reader.getFloat(grandChildren[0], 'y1');
                if (!(y1 != null && !isNaN(y1)))
                    return "unable to parse y1 of the primitive coordinates for ID = " + primitiveId;

                // x2
                var x2 = this.reader.getFloat(grandChildren[0], 'x2');
                if (!(x2 != null && !isNaN(x2) && x2 > x1))
                    return "unable to parse x2 of the primitive coordinates for ID = " + primitiveId;

                // y2
                var y2 = this.reader.getFloat(grandChildren[0], 'y2');
                if (!(y2 != null && !isNaN(y2) && y2 > y1))
                    return "unable to parse y2 of the primitive coordinates for ID = " + primitiveId;

                var rect = new MyRectangle(this.scene, primitiveId, x1, x2, y1, y2);

                this.primitives[primitiveId] = rect;

            } else if (primitiveType == 'cylinder' || primitiveType == 'cylinder2') {
                //base
                var base = this.reader.getFloat(grandChildren[0], 'base');
                if (!(base != null && !isNaN(base)))
                    return "unable to parse base of the primitive coordinates for ID = " + primitiveId;

                // top
                var top = this.reader.getFloat(grandChildren[0], 'top');
                if (!(top != null && !isNaN(top)))
                    return "unable to parse top of the primitive coordinates for ID = " + primitiveId;

                // height
                var height = this.reader.getFloat(grandChildren[0], 'height');
                if (!(height != null && !isNaN(height)))
                    return "unable to parse height of the primitive coordinates for ID = " + primitiveId;

                // slices
                var slices = this.reader.getInteger(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices)))
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

                // stacks
                var stacks = this.reader.getInteger(grandChildren[0], 'stacks');
                if (!(stacks != null && !isNaN(stacks)))
                    return "unable to parse stacks of the primitive coordinates for ID = " + primitiveId;

                var cylinder;
                if(primitiveType == 'cylinder')
                    cylinder = new MyCylinder(this.scene, primitiveId, base, top, height, slices, stacks);
                else
                    cylinder= new MyCylinder2(this.scene, primitiveId, base, top, height, slices, stacks);

                this.primitives[primitiveId] = cylinder;

            }else if (primitiveType == 'triangle') {
                // x1
                var x1 = this.reader.getFloat(grandChildren[0], 'x1');
                if (!(x1 != null && !isNaN(x1)))
                    return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;

                // y1
                var y1 = this.reader.getFloat(grandChildren[0], 'y1');
                if (!(y1 != null && !isNaN(y1)))
                    return "unable to parse y1 of the primitive coordinates for ID = " + primitiveId;

                // z1
                var z1 = this.reader.getFloat(grandChildren[0], 'z1');
                if (!(z1 != null && !isNaN(z1)))
                    return "unable to parse z1 of the primitive coordinates for ID = " + primitiveId;


                // x2
                var x2 = this.reader.getFloat(grandChildren[0], 'x2');
                if (!(x2 != null && !isNaN(x2)))
                    return "unable to parse x2 of the primitive coordinates for ID = " + primitiveId;

                // y2
                var y2 = this.reader.getFloat(grandChildren[0], 'y2');
                if (!(y2 != null && !isNaN(y2)))
                    return "unable to parse y2 of the primitive coordinates for ID = " + primitiveId;

                // z2
                var z2 = this.reader.getFloat(grandChildren[0], 'z2');
                if (!(z2 != null && !isNaN(z2)))
                    return "unable to parse z2 of the primitive coordinates for ID = " + primitiveId;


                // x3
                var x3 = this.reader.getFloat(grandChildren[0], 'x3');
                if (!(x3 != null && !isNaN(x3)))
                    return "unable to parse x3 of the primitive coordinates for ID = " + primitiveId;

                // y3
                var y3 = this.reader.getFloat(grandChildren[0], 'y3');
                if (!(y3 != null && !isNaN(y3)))
                    return "unable to parse y3 of the primitive coordinates for ID = " + primitiveId;

                // z3
                var z3 = this.reader.getFloat(grandChildren[0], 'z3');
                if (!(z3 != null && !isNaN(z3)))
                    return "unable to parse z3 of the primitive coordinates for ID = " + primitiveId;

                var triangle = new MyTriangle(this.scene, primitiveId, x1, y1, z1, x2, y2, z2, x3, y3, z3);

                this.primitives[primitiveId] = triangle;


            }else if (primitiveType == 'sphere') {
                //radius
                var radius = this.reader.getFloat(grandChildren[0], 'radius');
                if (!(radius != null && !isNaN(radius)))
                    return "unable to parse radius of the primitive coordinates for ID = " + primitiveId;

                // slices
                var slices = this.reader.getInteger(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices)))
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

                // stacks
                var stacks = this.reader.getInteger(grandChildren[0], 'stacks');
                if (!(stacks != null && !isNaN(stacks)))
                    return "unable to parse stacks of the primitive coordinates for ID = " + primitiveId;

                var sphere = new MySphere(this.scene, primitiveId, radius, slices, stacks);

                this.primitives[primitiveId] = sphere;

            }else if (primitiveType == 'torus') {
                //inner
                var inner = this.reader.getFloat(grandChildren[0], 'inner');
                if (!(inner != null && !isNaN(inner)))
                    return "unable to parse inner of the primitive coordinates for ID = " + primitiveId;

                //outer
                var outer = this.reader.getFloat(grandChildren[0], 'outer');
                if (!(outer != null && !isNaN(outer)))
                    return "unable to parse outer of the primitive coordinates for ID = " + primitiveId;

                // slices
                var slices = this.reader.getInteger(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices)))
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

                // loops
                var loops = this.reader.getInteger(grandChildren[0], 'loops');
                if (!(loops != null && !isNaN(loops)))
                    return "unable to parse loops of the primitive coordinates for ID = " + primitiveId;

                var torus = new MyTorus(this.scene, primitiveId, inner, outer, slices, loops);

                this.primitives[primitiveId] = torus;

            }else if (primitiveType == 'plane'){
                // npartsU
                var npartsU = this.reader.getInteger(grandChildren[0], 'npartsU');
                if (!(npartsU != null && !isNaN(npartsU)))
                    return "unable to parse npartsU of the primitive coordinates for ID = " + primitiveId;

                // npartsV
                var npartsV = this.reader.getInteger(grandChildren[0], 'npartsV');
                if (!(npartsV != null && !isNaN(npartsV)))
                    return "unable to parse npartsV of the primitive coordinates for ID = " + primitiveId;

                var plane = new MyPlane(this.scene, primitiveId, npartsU, npartsV);

                this.primitives[primitiveId] = plane;

            }else if(primitiveType == 'patch'){
                // npointsU
                var npointsU = this.reader.getInteger(grandChildren[0], 'npointsU');
                if (!(npointsU != null && !isNaN(npointsU)))
                    return "unable to parse npointsU of the primitive coordinates for ID = " + primitiveId;

                // npointsV
                var npointsV = this.reader.getInteger(grandChildren[0], 'npointsV');
                if (!(npointsV != null && !isNaN(npointsV)))
                    return "unable to parse npointsV of the primitive coordinates for ID = " + primitiveId;

                // npartsU
                var npartsU = this.reader.getInteger(grandChildren[0], 'npartsU');
                if (!(npartsU != null && !isNaN(npartsU)))
                    return "unable to parse npartsU of the primitive coordinates for ID = " + primitiveId;

                // npartsV
                var npartsV = this.reader.getInteger(grandChildren[0], 'npartsV');
                if (!(npartsV != null && !isNaN(npartsV)))
                    return "unable to parse npartsV of the primitive coordinates for ID = " + primitiveId;

                // controlpoints
                var controlpoints = [];
                var n_controlpoints=0;

                var grandgrandChildren=grandChildren[0].children;
                for (var k = 0; k < grandgrandChildren.length; k++) {
                    if(grandgrandChildren[k].nodeName!= "controlpoint"){
                        this.onXMLMinorError("unknown tag <" + grandgrandChildren[k].nodeName + "> (only tag <controlpoint> allowed)");
                        continue;
                    }

                    var aux = this.parseControlPoint(grandgrandChildren[k], "controlpoint for primitive with ID " + primitiveId);
                    if (!Array.isArray(aux))
                        return aux;

                    controlpoints.push(aux);
                    n_controlpoints++;
                }if( n_controlpoints != npointsU * npointsV){
                    return "primitive patch whith id "+primitiveId+" doesn't have the correct number of controlpoints. (Expected: "+ npointsU*npointsV+" Declared: "+n_controlpoints+")";
                }

                var patch = new MyPatch(this.scene, primitiveId, npointsU, npointsV, npartsU, npartsV, controlpoints);

                this.primitives[primitiveId] = patch;

            }
            else {
                return "primitive type not recognised = " + primitiveType;
            }
        }

        this.log("Parsed primitives");
        return null;
    }

    /**
   * Parses the <components> block.
   * @param {components block element} componentsNode
   */
    parseComponents(componentsNode) {
        var children = componentsNode.children;

        this.components = [];

        var grandChildren = [];
        var grandgrandChildren = [];
        var nodeNames = [];

        // Any number of components.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "component") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current component.
            var componentID = this.reader.getString(children[i], 'id');
            if (componentID == null)
                return "no ID defined for componentID";

            // Checks for repeated IDs.
            if (this.components[componentID] != null)
                return "ID must be unique for each component (conflict: ID = " + componentID + ")";

            grandChildren = children[i].children;

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }


            // Transformations
            var transformationIndex = nodeNames.indexOf("transformation");

            var component_transformationref;
            var transformationref_flag= false;
            var transfMatrix = mat4.create();

            if (transformationIndex  == -1)
                return "tag <transformation> missing";
            else {
                grandgrandChildren=grandChildren[transformationIndex].children;
                for (var k = 0; k < grandgrandChildren.length; k++) {
                    switch (grandgrandChildren[k].nodeName) {
                        case 'transformationref':
                            var transformationref = this.reader.getString(grandgrandChildren[k], 'id');
                            if (transformationref == null)
                                return "unable to parse transformationref of the component with ID " + componentID;
                            if(this.transformations[transformationref] == null)
                                return "transformation with ID "+transformationref+" wasn't declared in block <transformations> but is referenced in component with id " +componentID;
                            if(grandgrandChildren.length!=1)
                                return "only one transformationref is allowed or multiple translate/rotate/scale instructions, this is broken by component with ID "+componentID;
                            component_transformationref=transformationref;
                            transformationref_flag=true;
                            break;

                        case 'translate':
                            var coordinates = this.parseCoordinates3D(grandgrandChildren[k], "translate transformation for component with ID " + componentID);
                            if (!Array.isArray(coordinates))
                                return coordinates;

                            transfMatrix = mat4.translate(transfMatrix, transfMatrix, coordinates);
                            break;
                        case 'scale':
                            var coordinates = this.parseCoordinates3D(grandgrandChildren[k], "scale transformation for component with ID " + componentID);
                            if (!Array.isArray(coordinates))
                                return coordinates;

                            transfMatrix = mat4.scale(transfMatrix, transfMatrix, coordinates);
                            break;
                        case 'rotate':
                            // axis
                            var axis = this.reader.getString(grandgrandChildren[k], 'axis');
                            if (axis == null)
                                return "unable to parse axis of the rotate transformation for component with ID " + componentID;

                            // angle
                            var angle = this.reader.getFloat(grandgrandChildren[k], 'angle');
                            if (!(angle != null && !isNaN(angle)))
                                return "unable to parse angle of the rotate transformation for component with ID " + componentID;

                            switch(axis){
                                case "x":
                                    transfMatrix= mat4.rotateX(transfMatrix, transfMatrix, angle*DEGREE_TO_RAD);
                                    break;
                                case "y":
                                    transfMatrix= mat4.rotateY(transfMatrix, transfMatrix, angle*DEGREE_TO_RAD);
                                    break;
                                case "z":
                                    transfMatrix= mat4.rotateZ(transfMatrix, transfMatrix, angle*DEGREE_TO_RAD);
                                    break;
                                default:
                                    break;
                            }
                            break;
                        default:
                            return "tag "+grandgrandChildren[k].nodeName+" not recognised in transformation for component with ID " + componentID;

                    }
                }
            }
            if(!transformationref_flag){

                var new_transformationID= componentID;
                var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                for ( var counter = 0; counter < characters.length; counter++ ) {
                    new_transformationID +=characters.charAt(Math.floor(Math.random() * characters.length));
                }

                component_transformationref=new_transformationID;
                this.transformations[new_transformationID]=transfMatrix;
            }


            // Animation
            var animationRefIndex = nodeNames.indexOf("animationref");
            if (animationRefIndex  != -1){
                // Get animationId of the current component.
                var animationRef = this.reader.getString(grandChildren[animationRefIndex], 'id');
                if (animationRef == null)
                    return "no ID defined for animationref of component with Id "+ componentID;
            }


            // Materials
            var materialsIndex = nodeNames.indexOf("materials");
            var materialref=[];
            var numMaterialref=0;

            if (materialsIndex== -1)
                return "tag <materials> missing";
            else {
                grandgrandChildren=grandChildren[materialsIndex].children;
                for (var k = 0; k < grandgrandChildren.length; k++) {
                    if(grandgrandChildren[k].nodeName!= "material"){
                        this.onXMLMinorError("unknown tag <" + grandgrandChildren[k].nodeName + "> (only tag <material> allowed)");
                        continue;
                    }

                    var aux = this.reader.getString(grandgrandChildren[k], 'id');
                    if (aux == null)
                        return "unable to parse materialref of the component with ID " + componentID;
                    if(this.materials[aux] == null && aux!="inherit")
                        return "material with ID "+aux+" wasn't declared in block <materials> but is referenced in component with id " +componentID;

                    materialref[numMaterialref]=aux;
                    numMaterialref++;
                }
                if(numMaterialref<1){
                    return "component with ID "+componentID+" doesn't have a valid material defined";
                }

                if(componentID==this.idRoot && materialref.length==1 && materialref[0]=="inherit")
                    return "component root ("+this.idRoot+") must have a defined material (can not be inherit)";
            }

            // Texture
            var textureIndex = nodeNames.indexOf("texture");
            if (textureIndex == -1)
                return "tag <texture> missing";
            else {
                var textureref, length_s, length_t;

                textureref = this.reader.getString(grandChildren[textureIndex], 'id');
                if (textureref == null)
                    return "unable to parse texture of the component with ID " + componentID;
                if(this.textures[textureref] == null && textureref!="inherit" && textureref!="none")
                    return "texture with ID "+textureref+" wasn't declared in block <textures> but is referenced in component with id " +componentID;

                if(textureref!="inherit" && textureref!="none"){

                    // length_s
                    length_s = this.reader.getFloat(grandChildren[textureIndex], 'length_s');
                    if (!(length_s != null && !isNaN(length_s)))
                        return "unable to parse length_s of the texture of the component with ID " + componentID;

                    // length_t
                    length_t = this.reader.getFloat(grandChildren[textureIndex], 'length_t');
                    if (!(length_t != null && !isNaN(length_t)))
                        return "unable to parse length_t of the texture of the component with ID " + componentID;

                }else{
                    length_s=1;
                    length_t=1;
                }
            }

            // Children
            var childrenIndex = nodeNames.indexOf("children");
            var component_primitiverefs=[];
            var component_componenterefs=[];

            if (childrenIndex == -1)
                return "tag <children> missing";
            else {
                grandgrandChildren=grandChildren[childrenIndex].children;
                if(grandgrandChildren.length==0)
                    return "no children declared for component with ID " + componentID;
                for (var j = 0; j < grandgrandChildren.length; j++) {
                    switch (grandgrandChildren[j].nodeName) {
                        case 'componentref':
                            var componentref = this.reader.getString(grandgrandChildren[j], 'id');
                            if (componentref == null)
                                return "unable to parse componentref of the component with ID " + componentID;
                            component_componenterefs.push(componentref);
                            break;
                        case 'primitiveref':
                            var primitiveref = this.reader.getString(grandgrandChildren[j], 'id');
                            if (primitiveref == null)
                                return "unable to parse primitiveref of the component with ID " + componentID;
                            if(this.primitives[primitiveref] == null)
                                return "primitive with ID "+primitiveref+" wasn't declared in block <primitives> but is referenced in component with id " +componentID;
                            component_primitiverefs.push(primitiveref);
                            break;
                    }
                }
            }
            var sceneComponent=new SceneComponent(this, componentID, this.scene, component_componenterefs, component_primitiverefs, component_transformationref, materialref, textureref, length_s, length_t, animationRef);
            this.components[componentID] = sceneComponent;
        }
    }


    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates3D(node, messageError) {
        var position = [];

        // x
        var x = this.reader.getFloat(node, 'x');
        if (!(x != null && !isNaN(x)))
            return "unable to parse x-coordinate of the " + messageError;

        // y
        var y = this.reader.getFloat(node, 'y');
        if (!(y != null && !isNaN(y)))
            return "unable to parse y-coordinate of the " + messageError;

        // z
        var z = this.reader.getFloat(node, 'z');
        if (!(z != null && !isNaN(z)))
            return "unable to parse z-coordinate of the " + messageError;

        position.push(...[x, y, z]);

        return position;
    }


    /**
     * Parse the coordinates for a controlpoint of a patch
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseControlPoint(node, messageError){
        var position = [];

        // x
        var x = this.reader.getFloat(node, 'xx');
        if (!(x != null && !isNaN(x)))
            return "unable to parse x-coordinate of the " + messageError;

        // y
        var y = this.reader.getFloat(node, 'yy');
        if (!(y != null && !isNaN(y)))
            return "unable to parse y-coordinate of the " + messageError;

        // z
        var z = this.reader.getFloat(node, 'zz');
        if (!(z != null && !isNaN(z)))
            return "unable to parse z-coordinate of the " + messageError;

        position.push(...[x, y, z]);

        return position;
    }


    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates4D(node, messageError) {
        var position = [];

        //Get x, y, z
        position = this.parseCoordinates3D(node, messageError);

        if (!Array.isArray(position))
            return position;


        // w
        var w = this.reader.getFloat(node, 'w');
        if (!(w != null && !isNaN(w)))
            return "unable to parse w-coordinate of the " + messageError;

        position.push(w);

        return position;
    }

    /**
     * Parse the color components from a node
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseColor(node, messageError) {
        var color = [];

        // R
        var r = this.reader.getFloat(node, 'r');
        if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
            return "unable to parse R component of the " + messageError;

        // G
        var g = this.reader.getFloat(node, 'g');
        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
            return "unable to parse G component of the " + messageError;

        // B
        var b = this.reader.getFloat(node, 'b');
        if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
            return "unable to parse B component of the " + messageError;

        // A
        var a = this.reader.getFloat(node, 'a');
        if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
            return "unable to parse A component of the " + messageError;

        color.push(...[r, g, b, a]);

        return color;
    }

    /**
     * Parse the attenuation from a node
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseAttenuation(node, messageError) {
        var attenuation = [];

        // constant
        var constant = this.reader.getFloat(node, 'constant');
        if (!(constant != null && !isNaN(constant)))
            return "unable to parse constant of the " + messageError;

        // linear
        var linear = this.reader.getFloat(node, 'linear');
        if (!(linear != null && !isNaN(linear)))
            return "unable to parse linear of the " + messageError;

        // quadratic
        var quadratic = this.reader.getFloat(node, 'quadratic');
        if (!(quadratic != null && !isNaN(quadratic)))
            return "unable to parse quadratic of the " + messageError;

        attenuation.push(...[constant, linear, quadratic]);

        return attenuation;
    }

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }

    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {

        //To test the parsing/creation of the primitives, call the display function directly
        //this.primitives['demoRectangle'].display();
        //this.primitives['demoCylinder'].display();
        //this.primitives['demoTriangle'].display();
        //this.primitives['demoSphere'].display();
        //this.primitives['demoTorus'].display();

        this.components[this.idRoot].display("inherit", "none", 1, 1);
    }
}