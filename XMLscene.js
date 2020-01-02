var DEGREE_TO_RAD = Math.PI / 180;
var CAMERA_ANIMATION_DURATION = 20;

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
        this.setPickEnabled(true);

        this.game = new Game(this);

        this.mCounter = 0;
        this.selectedView = 'BlackSide';
        this.lastSelectedView = 'BlackSide';

        this.black = 'Human';
        this.white = 'Human';

        this.y = 0;

        //Camera Animation
        this.camera_animationStart=false;

        this.camera_oldPos=[];
        this.camera_oldTarget=[];

        this.camera_posStep=[];
        this.camera_targetStep=[];

        this.camera_currPos=[];
        this.camera_currTarget=[];

        this.camera_newPos=[];
        this.camera_newTarget=[];
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

        this.selectedView = this.graph.defaultViewID;
        //this.rttView = this.graph.defaultViewID;

        //this.securityCamera = new MySecurityCamera(this);
        //this.updateCamera();

        this.NormalCam = new CGFcamera(this.graph.views[this.selectedView][3] * DEGREE_TO_RAD, this.graph.views[this.selectedView][1], this.graph.views[this.selectedView][2], this.graph.views[this.selectedView][4], this.graph.views[this.selectedView][5]);
        this.gui.setActiveCamera(this.NormalCam);

        this.camera_oldPos=[...this.graph.views[this.selectedView][4]];
        this.camera_oldTarget=[...this.graph.views[this.selectedView][5]];

        this.camera_currPos=[...this.graph.views[this.selectedView][4]];
        this.camera_currTarget=[...this.graph.views[this.selectedView][5]];

        this.camera_newPos=[...this.graph.views[this.selectedView][4]];
        this.camera_newTarget=[...this.graph.views[this.selectedView][5]];

        //this.scShader = new CGFshader(this.gl, "shaders/sc.vert", "shaders/sc.frag");

        this.sceneInited = true;
    }
    

    moveCamera() {
        // Kinda TODO
    }

    async updateCamera(smooth){
        //console.log("*********** Changed View to " + this.selectedView + " ***********");

        // uncomment to log current view parameters
        //for(var key in this.graph.views[this.selectedView]) if(this.graph.views[this.selectedView].hasOwnProperty(key)) console.log("KEY: " + key + " -- VALUE: " + this.graph.views[this.selectedView][key]);

        let view = this.graph.views[this.selectedView];

        if (view[0] == 'perspective')
            if (smooth == true) {
                let animDuration = 1; // camera transition duration in seconds
                let frames = animDuration / (this.SCENE_UPDATE_PERIOD/1000);

                let currTarget = [this.NormalCam.target[0], this.NormalCam.target[1], this.NormalCam.target[2]];
                let currPos = [this.NormalCam.position[0], this.NormalCam.position[1], this.NormalCam.position[2]];

                for (let i = 0 ; i < frames ; i++) {
                    let step = [(view[4][0] - this.NormalCam.position[0]) / (frames-i), (view[4][1] - this.NormalCam.position[1]) / (frames-i), (view[4][2] - this.NormalCam.position[2]) / (frames-i)];

                    let targetSteps = [(view[5][0] - this.NormalCam.target[0]) / (frames-i), (view[5][1] - this.NormalCam.target[1]) / (frames-i), (view[5][2] - this.NormalCam.target[2]) / (frames-i)];

                    currTarget[0] += targetSteps[0];
                    currTarget[1] += targetSteps[1];
                    currTarget[2] += targetSteps[2];

                    currPos[0] += step[0];
                    currPos[1] += step[1];
                    currPos[2] += step[2];

                    this.NormalCam.setPosition(currPos);
                    this.NormalCam.setTarget(currTarget);
                    await this.sleep(this.SCENE_UPDATE_PERIOD);
                }
                this.NormalCam.setPosition(view[4]);
                this.NormalCam.setTarget(view[5]);
            }

            else {
                this.NormalCam = new CGFcamera(view[3] * DEGREE_TO_RAD, view[1], view[2], view[4], view[5]);
            }
        this.gui.setActiveCamera(this.NormalCam);
    }

    /**
     * Displays the scene.
     */
    render() {
        // ---- BEGIN Background, camera and axis setup

        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        this.camera = this.NormalCam;
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

    // aka game loop
    display(){
        //this.game.play();
        this._display();
    }

    _display() {
        if (!this.sceneInited) {
            return;
        }

        let update;

        if(this.lastSelectedView != this.selectedView){
            this.camera_newPos=[...this.graph.views[this.selectedView][4]];
            this.camera_newTarget=[...this.graph.views[this.selectedView][5]];

            this.camera_oldPos=[this.NormalCam.position[0], this.NormalCam.position[1], this.NormalCam.position[2]];
            this.camera_oldTarget=[this.NormalCam.target[0], this.NormalCam.target[1], this.NormalCam.target[2]];

            this.calculateCameraSteps();
            this.camera_animation=true;
        }

        // NORMAL
        if(this.camera_animation){
            this.updateCamera(true);
        }
        this.render();

        // -----
        /*this.rtt.bind();

        this.gl.disable(this.gl.DEPTH_TEST);
        this.setActiveShader(this.scShader);
        this.y += 0.01;
        this.scShader.setUniformsValues({time : this.y % 1, height : this.gl.canvas.height, width : this.gl.canvas.width});
        this.securityCamera.display();
        this.setActiveShader(this.defaultShader);
        this.gl.enable(this.gl.DEPTH_TEST);*/
    }

    update(currTime) {
        super.update(currTime);

        this.lastTime = this.lastTime || 0.0;
        this.deltaTime = currTime - this.lastTime || 0.0;
        this.lastTime = currTime;

        this.deltaTime = this.deltaTime/1000; //in seconds

        if (!this.sceneInited)
            return;

        if(this.camera_animation) {
            this.calculateCameraValues(currTime);
        }else{
            this.camera_animationStart=currTime;
        }

        for(var animation in this.graph.animations){
            this.graph.animations[animation].update(this.deltaTime);
        }

    }

    calculateCameraSteps(){
        let deltaTime = (CAMERA_ANIMATION_DURATION *100) / (this.SCENE_UPDATE_PERIOD);

        this.camera_posStep = [
            (this.camera_newPos[0]-this.camera_oldPos[0])/ deltaTime,
            (this.camera_newPos[1]-this.camera_oldPos[1])/ deltaTime,
            (this.camera_newPos[2]-this.camera_oldPos[2])/ deltaTime
        ];
        this.camera_targetStep= [(this.camera_newTarget[0]-this.camera_oldTarget[0])/deltaTime, (this.camera_newTarget[1]-this.camera_oldTarget[1])/deltaTime, (this.camera_newTarget[2]-this.camera_oldTarget[2])/deltaTime];
    }

    calculateCameraValues(currTime){

        var currDeltaTime=(currTime-this.camera_animationStart)/this.SCENE_UPDATE_PERIOD;

        if(currDeltaTime>CAMERA_ANIMATION_DURATION){
            this.lastSelectedView = this.selectedView;
            this.camera_oldPos=[...this.camera_newPos];
            this.camera_oldTarget=[...this.camera_newTarget];
            this.camera_currPos=[...this.camera_newPos];
            this.camera_currTarget=[...this.camera_newTarget];
            this.camera_animation = false;
            return;
        }

        this.camera_currPos[0] = this.camera_posStep[0]*currDeltaTime+this.camera_oldPos[0];
        this.camera_currPos[1] = this.camera_posStep[1]*currDeltaTime+this.camera_oldPos[1];
        this.camera_currPos[2] = this.camera_posStep[2]*currDeltaTime+this.camera_oldPos[2];

        this.camera_currTarget[0] = this.camera_targetStep[0]*currDeltaTime+this.camera_oldTarget[0];
        this.camera_currTarget[1] = this.camera_targetStep[1]*currDeltaTime+this.camera_oldTarget[1];
        this.camera_currTarget[2] = this.camera_targetStep[2]*currDeltaTime+this.camera_oldTarget[2];
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}