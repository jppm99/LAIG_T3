var DEGREE_TO_RAD = Math.PI / 180;
var CAMERA_ANIMATION_DURATION = 20;
var RUNNING_ANIMATION_DURATION = 8;

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

        this.scenario = 'Cabin';

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

        //Picking
        //Creating objects for each of the boards cells 4*4 board*4=64
        this.objects=[];
        for(let i =0; i < 64; i++){
            this.objects.push(new CGFplane(this));
        }
        this.pick = undefined;
        this.setPickEnabled(true);
        this.transparencyShader=new CGFshader(this.gl, "shaders/sc.vert", "shaders/transparency.frag");

        //AuxiliaryBoard To reach each Piece Id More easily
        this.pieceIDBoard=[
            [
                ["whitePieceNumber1-Of-board-up-left","whitePieceNumber2-Of-board-up-left","whitePieceNumber3-Of-board-up-left","whitePieceNumber4-Of-board-up-left"],
                ["empty","empty","empty","empty"],
                ["empty","empty","empty","empty"],
                ["blackPieceNumber1-Of-board-up-left","blackPieceNumber2-Of-board-up-left","blackPieceNumber3-Of-board-up-left","blackPieceNumber4-Of-board-up-left"]
            ],
            [
                ["whitePieceNumber1-Of-board-down-right","whitePieceNumber2-Of-board-down-right","whitePieceNumber3-Of-board-down-right","whitePieceNumber4-Of-board-down-right"],
                ["empty","empty","empty","empty"],
                ["empty","empty","empty","empty"],
                ["blackPieceNumber1-Of-board-down-right","blackPieceNumber2-Of-board-down-right","blackPieceNumber3-Of-board-down-right","blackPieceNumber4-Of-board-down-right"]
            ],
            [
                ["whitePieceNumber1-Of-board-down-left","whitePieceNumber2-Of-board-down-left","whitePieceNumber3-Of-board-down-left","whitePieceNumber4-Of-board-down-left"],
                ["empty","empty","empty","empty"],
                ["empty","empty","empty","empty"],
                ["blackPieceNumber1-Of-board-down-left","blackPieceNumber2-Of-board-down-left","blackPieceNumber3-Of-board-down-left","blackPieceNumber4-Of-board-down-left"]
            ],
            [
                ["whitePieceNumber1-Of-board-up-right","whitePieceNumber2-Of-board-up-right","whitePieceNumber3-Of-board-up-right","whitePieceNumber4-Of-board-up-right"],
                ["empty","empty","empty","empty"],
                ["empty","empty","empty","empty"],
                ["blackPieceNumber1-Of-board-up-right","blackPieceNumber2-Of-board-up-right","blackPieceNumber3-Of-board-up-right","blackPieceNumber4-Of-board-up-right"]
            ]
        ];
        this.resetPicking();

        //AuxiliaryBoard To reach each Cell Id More easily
        this.cellIDBoard=[
            [
                ["cell-1-1-up-left","cell-1-2-up-left","cell-1-3-up-left","cell-1-4-up-left"],
                ["cell-2-1-up-left","cell-2-2-up-left","cell-2-3-up-left","cell-2-4-up-left"],
                ["cell-3-1-up-left","cell-3-2-up-left","cell-3-3-up-left","cell-3-4-up-left"],
                ["cell-4-1-up-left","cell-4-2-up-left","cell-4-3-up-left","cell-4-4-up-left"]
            ],
            [
                ["cell-1-1-down-right","cell-1-2-down-right","cell-1-3-down-right","cell-1-4-down-right"],
                ["cell-2-1-down-right","cell-2-2-down-right","cell-2-3-down-right","cell-2-4-down-right"],
                ["cell-3-1-down-right","cell-3-2-down-right","cell-3-3-down-right","cell-3-4-down-right"],
                ["cell-4-1-down-right","cell-4-2-down-right","cell-4-3-down-right","cell-4-4-down-right"]
            ],
            [
                ["cell-1-1-down-left","cell-1-2-down-left","cell-1-3-down-left","cell-1-4-down-left"],
                ["cell-2-1-down-left","cell-2-2-down-left","cell-2-3-down-left","cell-2-4-down-left"],
                ["cell-3-1-down-left","cell-3-2-down-left","cell-3-3-down-left","cell-3-4-down-left"],
                ["cell-4-1-down-left","cell-4-2-down-left","cell-4-3-down-left","cell-4-4-down-left"]
            ],
            [
                ["cell-1-1-up-right","cell-1-2-up-right","cell-1-3-up-right","cell-1-4-up-right"],
                ["cell-2-1-up-right","cell-2-2-up-right","cell-2-3-up-right","cell-2-4-up-right"],
                ["cell-3-1-up-right","cell-3-2-up-right","cell-3-3-up-right","cell-3-4-up-right"],
                ["cell-4-1-up-right","cell-4-2-up-right","cell-4-3-up-right","cell-4-4-up-right"]
            ]
        ];

        this.runningAnimationDelay=0;
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

    async updateCamera(smooth){
        this.NormalCam.setPosition(this.camera_currPos);
        this.NormalCam.setTarget(this.camera_currTarget);

        this.gui.setActiveCamera(this.NormalCam);
    }

    logPicking(){
        if (this.pickMode == false) {
            if (this.pickResults != null && this.pickResults.length > 0) {
                for (var i = 0; i < this.pickResults.length; i++) {
                    var obj = this.pickResults[i][0];
                    if (obj) {
                        this.pick = this.pickResults[i][1];
                    }
                }
                this.pickResults.splice(0, this.pickResults.length);
            }
            else this.pick = undefined;
        }
        if(this.pick!==undefined) {
            console.log("Picked object: " + obj + ", with pick id " + this.pick);
        }
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

        // draw objects for picking
        this.setActiveShader(this.transparencyShader);

        //cycle that draws objects in line
        var initial_x=-1.6875;
        var initial_z=-1.6875;
        var position_delta=1.125;

        var board_number=1;

        this.pushMatrix();
        this.translate(-2.5, 0.5, -3);

        for(var lin=0; lin<4; lin++){
            for (var col = 0; col < 4; col++) {
                this.pushMatrix();
                this.translate(initial_x + col * position_delta, 0, initial_z + lin * position_delta);

                //Id for pickable objects must be >= 1
                this.registerForPick(board_number*100+lin*10+col, this.objects[(board_number-1)*16+lin*4+col]);
                this.objects[i].display();

                this.popMatrix();
            }
        }
        this.popMatrix();

        board_number++;

        this.pushMatrix();
        this.translate(2.5, 0.5, -3);

        for(var lin=0; lin<4; lin++) {
            for (var col = 0; col < 4; col++) {
                this.pushMatrix();
                this.translate(initial_x + col * position_delta, 0, initial_z + lin * position_delta);

                //Id for pickable objects must be >= 1
                this.registerForPick(board_number*100+lin*10+col, this.objects[(board_number-1)*16+lin*4+col]);
                this.objects[(board_number-1)*16+lin*4+col].display();

                this.popMatrix();
            }
        }
        this.popMatrix();

        board_number++;

        this.pushMatrix();
        this.translate(-2.5, 0.5, 3);

        for(var lin=0; lin<4; lin++) {
            for (var col = 0; col < 4; col++) {
                this.pushMatrix();
                this.translate(initial_x + col * position_delta, 0, initial_z + lin * position_delta);

                //Id for pickable objects must be >= 1
                this.registerForPick(board_number*100+lin*10+col, this.objects[(board_number-1)*16+lin*4+col]);
                this.objects[i].display();

                this.popMatrix();
            }
        }
        this.popMatrix();

        board_number++;

        this.pushMatrix();
        this.translate(2.5, 0.5, 3);

        for(var lin=0; lin<4; lin++) {
            for (var col = 0; col < 4; col++) {
                this.pushMatrix();
                this.translate(initial_x + col * position_delta, 0, initial_z + lin * position_delta);

                //Id for pickable objects must be >= 1
                this.registerForPick(board_number*100+lin*10+col, this.objects[(board_number-1)*16+lin*4+col]);
                this.objects[i].display();

                this.popMatrix();
            }
        }

        this.setActiveShader(this.defaultShader);
        this.popMatrix();

        // ---- END
    }

    // aka game loop
    display(){
        
        this.game.play();

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

        for(var component in this.graph.components){
            for(var runningAnimation in this.graph.components[component].runningAnimatons){
                this.graph.components[component].runningAnimatons[runningAnimation].update(this.deltaTime);
            }
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

    applyVisualChanges(move){
        let XI = move[0],
            YI = move[1],
            XF = move[2],
            YF = move[3];

        var correspondingIAnimation;
        var correspondingFAnimation;
        var moveTwoSpaces=false;
        if(Math.abs(XF-XI)>=3 || Math.abs(YF-YI)>=3)
            return;
        if(Math.abs(XF-XI)===2 || Math.abs(YF-YI)===2){
            moveTwoSpaces=true;
        }
        if(XI==XF){
            if(YF<YI){
                if(moveTwoSpaces){
                    correspondingIAnimation = "move-Up-Two";
                }else {
                    correspondingIAnimation = "move-Up-One";
                }
                correspondingFAnimation = "move-Up-One";
            }else{
                if(moveTwoSpaces){
                    correspondingIAnimation = "move-Down-Two";
                }else {
                    correspondingIAnimation = "move-Down-One";
                }
                correspondingFAnimation = "move-Down-One";
            }
        }else if(YI==YF){
            if(XF<XI){
                if(moveTwoSpaces){
                    correspondingIAnimation = "move-Left-Two";
                }else {
                    correspondingIAnimation = "move-Left-One";
                }
                correspondingFAnimation = "move-Left-One";
            }else{
                if(moveTwoSpaces){
                    correspondingIAnimation = "move-Right-Two";
                }else {
                    correspondingIAnimation = "move-Right-One";
                }
                correspondingFAnimation = "move-Right-One";
            }
        }else{
            if(XF<XI && YF<YI){
                if(moveTwoSpaces){
                    correspondingIAnimation = "move-Up-Left-Two";
                }else {
                    correspondingIAnimation = "move-Up-Left-One";
                }
                correspondingFAnimation = "move-Up-Left-One";
            }else if(XF>XI && YF<YI){
                if(moveTwoSpaces){
                    correspondingIAnimation = "move-Up-Right-Two";
                }else {
                    correspondingIAnimation = "move-Up-Right-One";
                }
                correspondingFAnimation = "move-Up-Right-One";
            }else if(XF<XI && YF>YI){
                if(moveTwoSpaces){
                    correspondingIAnimation = "move-Down-Left-Two";
                }else {
                    correspondingIAnimation = "move-Down-Left-One";
                }
                correspondingFAnimation = "move-Down-Left-One";
            }else{
                if(moveTwoSpaces){
                    correspondingIAnimation = "move-Down-Right-Two";
                }else {
                    correspondingIAnimation = "move-Down-Right-One";
                }
                correspondingFAnimation = "move-Down-Right-One";
            }
        }

        let valorInicial = this.visualBoardPos(XI, YI, "empty");
        let valorFinal="undefined";

        if(XF >= 0 && YF >= 0) {
            valorFinal=this.visualBoardPos(XF, YF, valorInicial);
        }

        if(valorInicial!=="empty"){
            this.graph.components[valorInicial].addRunningAnimation(correspondingIAnimation);
        }

        if(valorFinal!=="undefined" && valorFinal!=="empty"){
            this.graph.components[valorFinal].addRunningAnimation(correspondingFAnimation);
        }

    }


    visualBoardPos(X, Y, P) {
        let indice1;
        if(Y<5) {
            if(X<5) indice1 = 0;
            else indice1 = 1;
        }
        else {
            if(X<5) indice1 = 2;
            else indice1 = 3;
        }

        let indice2 = (Y-1) % 4;

        let indice3 = (X-1) % 4;

        let temp = this.pieceIDBoard[indice1][indice2][indice3];

        if(P != undefined) {
            this.pieceIDBoard[indice1][indice2][indice3] = P;
        }

        return temp;
    }

    disableSelectedMaterial(){
        for(let component in this.graph.components){
            this.graph.components[component].selectedByPicking(false);
        }
    }

    resetRunningAnimations(){
        for(let component in this.graph.components){
            this.graph.components[component].resetRunningAnimations();
        }
    }

    resetPicking(){
        this.pieceIDBoard=[
            [
                ["whitePieceNumber1-Of-board-up-left","whitePieceNumber2-Of-board-up-left","whitePieceNumber3-Of-board-up-left","whitePieceNumber4-Of-board-up-left"],
                ["empty","empty","empty","empty"],
                ["empty","empty","empty","empty"],
                ["blackPieceNumber1-Of-board-up-left","blackPieceNumber2-Of-board-up-left","blackPieceNumber3-Of-board-up-left","blackPieceNumber4-Of-board-up-left"]
            ],
            [
                ["whitePieceNumber1-Of-board-down-right","whitePieceNumber2-Of-board-down-right","whitePieceNumber3-Of-board-down-right","whitePieceNumber4-Of-board-down-right"],
                ["empty","empty","empty","empty"],
                ["empty","empty","empty","empty"],
                ["blackPieceNumber1-Of-board-down-right","blackPieceNumber2-Of-board-down-right","blackPieceNumber3-Of-board-down-right","blackPieceNumber4-Of-board-down-right"]
            ],
            [
                ["whitePieceNumber1-Of-board-down-left","whitePieceNumber2-Of-board-down-left","whitePieceNumber3-Of-board-down-left","whitePieceNumber4-Of-board-down-left"],
                ["empty","empty","empty","empty"],
                ["empty","empty","empty","empty"],
                ["blackPieceNumber1-Of-board-down-left","blackPieceNumber2-Of-board-down-left","blackPieceNumber3-Of-board-down-left","blackPieceNumber4-Of-board-down-left"]
            ],
            [
                ["whitePieceNumber1-Of-board-up-right","whitePieceNumber2-Of-board-up-right","whitePieceNumber3-Of-board-up-right","whitePieceNumber4-Of-board-up-right"],
                ["empty","empty","empty","empty"],
                ["empty","empty","empty","empty"],
                ["blackPieceNumber1-Of-board-up-right","blackPieceNumber2-Of-board-up-right","blackPieceNumber3-Of-board-up-right","blackPieceNumber4-Of-board-up-right"]
            ]
        ];
    }

    removeRunningAnimationDelay(){
        this.runningAnimationDelay-=1;
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}