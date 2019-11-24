var DEGREE_TO_RAD = Math.PI / 180;

/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface 
     */
    constructor(myinterface) {
        super();

        this.interface = myinterface;
        this.SCENE_UPDATE_PERIOD=100;
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.sceneInited = false;

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);

        this.setUpdatePeriod(this.SCENE_UPDATE_PERIOD);

        this.mCounter = 0;
        this.selectedView = 'defaultCamera';
        this.lastSelectedView = 'defaultCamera';
        this.rttView = 'defaultCamera';
        this.lastRttView = 'defaultCamera';

        this.rtt = new CGFtextureRTT(this, 1920, 1080);
        this.y = 0;
    }

    increaseM() {
        return ++this.mCounter;
    }

    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        var i = 0;
        // Lights index.
        this.lightsStatus = [];
        var names = [];

        // Reads the lights from the scene graph.
        for (var key in this.graph.lights) {
            if (i >= 8)
                break;              // Only eight lights allowed by WebGL.

            if (this.graph.lights.hasOwnProperty(key)) {
                var light = this.graph.lights[key];

                names.push(key);

                this.lights[i].setPosition(light[2][0], light[2][1], light[2][2], light[2][3]);
                this.lights[i].setAmbient(light[3][0], light[3][1], light[3][2], light[3][3]);
                this.lights[i].setDiffuse(light[4][0], light[4][1], light[4][2], light[4][3]);
                this.lights[i].setSpecular(light[5][0], light[5][1], light[5][2], light[5][3]);

                this.lights[i].setConstantAttenuation(light[6][0]);
                this.lights[i].setLinearAttenuation(light[6][1]);
                this.lights[i].setQuadraticAttenuation(light[6][2]);

                if (light[1] == "spot") {
                    this.lights[i].setSpotCutOff(light[7]);
                    this.lights[i].setSpotExponent(light[8]);
                    this.lights[i].setSpotDirection(light[9][0], light[9][1], light[9][2]);
                }

                this.lights[i].setVisible(true);
                if (light[0]) {
                    this.lightsStatus.push(true);
                    this.lights[i].enable();
                }
                else {
                    this.lights[i].disable();
                    this.lightsStatus.push(false);
                }

                this.lights[i].update();

                i++;
            }
        }

        this.interface.addLights(i, names);

    }

    setDefaultAppearance() {
        this.setAmbient(0.2, 0.4, 0.8, 1.0);
        this.setDiffuse(0.2, 0.4, 0.8, 1.0);
        this.setSpecular(0.2, 0.4, 0.8, 1.0);
        this.setShininess(10.0);
    }
    /** Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {
        this.axis = new CGFaxis(this, this.graph.referenceLength);

        this.gl.clearColor(this.graph.background[0], this.graph.background[1], this.graph.background[2], this.graph.background[3]);

        this.setGlobalAmbientLight(this.graph.ambient[0], this.graph.ambient[1], this.graph.ambient[2], this.graph.ambient[3]);

        this.initLights();

        this.viewKeys = [];
        for(var key in this.graph.views){
            if(this.graph.views.hasOwnProperty(key)){
                this.viewKeys.push(key);
            }
        }

        this.interface.addViews(this.viewKeys);
        this.interface.addSCViews(this.viewKeys);

        this.selectedView = this.graph.defaultViewID;
        this.rttView = this.graph.defaultViewID;

        this.securityCamera = new MySecurityCamera(this);
        this.updateCamera(false, true);

        this.scShader = new CGFshader(this.gl, "shaders/sc.vert", "shaders/sc.frag");

        this.sceneInited = true;
    }

    updateCamera(rtt, update){
        //console.log("*********** Changed View to " + this.selectedView + " ***********");

        // uncomment to log current view parameters
        //for(var key in this.graph.views[this.selectedView]) if(this.graph.views[this.selectedView].hasOwnProperty(key)) console.log("KEY: " + key + " -- VALUE: " + this.graph.views[this.selectedView][key]);

        if(update) {
            let view = this.graph.views[(rtt ? this.rttView : this.selectedView)];

            if (view[0] == 'perspective')
                if(rtt)
                    this.RTTcam = new CGFcamera(view[3] * DEGREE_TO_RAD, view[1], view[2], view[4], view[5]);
                else
                    this.NormalCam = new CGFcamera(view[3] * DEGREE_TO_RAD, view[1], view[2], view[4], view[5]);
            else
                if(rtt)
                    this.RTTcam = new CGFcameraOrtho(view[3], view[4], view[6], view[5], view[1], view[2], view[7], view[8], (view[9] == undefined ? vec3.fromValues(0, 1, 0) : view[9]));
                else
                    this.NormalCam = new CGFcameraOrtho(view[3], view[4], view[6], view[5], view[1], view[2], view[7], view[8], (view[9] == undefined ? vec3.fromValues(0, 1, 0) : view[9]));
        }

        if(!rtt) this.gui.setActiveCamera(this.NormalCam);
    }

    /**
     * Displays the scene.
     */
    render(rtt) {
        // ---- BEGIN Background, camera and axis setup

        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        if(rtt) this.camera = this.RTTcam;
        else this.camera = this.NormalCam;
        this.gui.setActiveCamera(this.camera);


        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply each light current state
        for(var i = 0; i < (this.lightsStatus.length <= 8 ? this.lightsStatus.length : 8); i++ ) {
            if(this.lightsStatus[i] == true)
                this.lights[i].enable();
            else
                this.lights[i].disable();

            this.lights[i].update();
        }


        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        this.pushMatrix();
        this.axis.display();

        for (var i = 0; i < this.lights.length; i++) {
            this.lights[i].setVisible(true);
            //this.lights[i].enable();
        }

        // Draw axis
        this.setDefaultAppearance();

        // Displays the scene (MySceneGraph function).
        this.graph.displayScene();

        this.popMatrix();

        // ---- END
    }

    display() {
        if (!this.sceneInited) {
            return;
        }

        let update;

        // RTT  -> last rtt comparison added for performance reasons
        if(this.lastRttView === this.rttView) update = false;
        else {
            this.lastRttView = this.rttView;
            update = true;
        }
        this.updateCamera(true, true);
        this.rtt.attachToFrameBuffer();
        this.render(true);

        // NORMAL
        if(this.lastSelectedView === this.selectedView) update = false;
        else {
            this.lastSelectedView = this.selectedView;
            update = true;
        }
        this.updateCamera(false, update);
        this.rtt.detachFromFrameBuffer();
        this.render(false);

        // -----
        this.rtt.bind();

        this.gl.disable(this.gl.DEPTH_TEST);
        this.setActiveShader(this.scShader);
        this.y += 0.01;
        this.scShader.setUniformsValues({time : this.y % 1, height : this.gl.canvas.height, width : this.gl.canvas.width});
        this.securityCamera.display();
        this.setActiveShader(this.defaultShader);
        this.gl.enable(this.gl.DEPTH_TEST);
    }

    update(currTime) {
        super.update(currTime);

        this.lastTime = this.lastTime || 0.0;
        this.deltaTime = currTime - this.lastTime || 0.0;
        this.lastTime = currTime;

        this.deltaTime = this.deltaTime/1000; //in seconds

        if (!this.sceneInited)
            return;

        for(var animation in this.graph.animations){
            this.graph.animations[animation].update(this.deltaTime);
        }

    }
}