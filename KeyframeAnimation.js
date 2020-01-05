/**
 * KeyframeAnimation
 * @constructor
 * @param scene - Reference to MyScene object
 * @param keyframes - Array of objects of type KeyFrame
 *
 * @update
 * @param currInstant - Time in seconds since the start of scene render.
 * */
class KeyframeAnimation extends Animation {
    constructor(scene, keyframes) {
        super();
        this.scene = scene;
        this.keyframes = keyframes;

        this.animationDone=false;
        this.currentKeyFrameIndex = 0;

        this.time=0;

        this.inicial_translate_coords=[0,0,0];
        this.inicial_rotate_coords=[0,0,0];
        this.inicial_scale_coords=[1,1,1];
        this.previousInstant=0;


        this.calculateFactors();

        this.animation_translate_coords=[0,0,0];
        this.animation_rotate_coords=[0,0,0];
        this.animation_scale_coords=[1,1,1];
        this.AnimationMatrix = mat4.create();
    }

    update(currInstant) {
        this.time += currInstant;

        if(this.animationDone || this.time<0) return;

        if(this.time > this.keyframes[this.currentKeyFrameIndex].instant){

            this.inicial_translate_coords=this.keyframes[this.currentKeyFrameIndex].translate_coords;
            this.inicial_rotate_coords=this.keyframes[this.currentKeyFrameIndex].rotate_coords;
            this.inicial_scale_coords=this.keyframes[this.currentKeyFrameIndex].scale_coords;
            this.previousInstant=this.keyframes[this.currentKeyFrameIndex].instant;

            this.currentKeyFrameIndex++;

            if (this.currentKeyFrameIndex >= this.keyframes.length) {
                this.animationDone=true;
                this.scene.runningAnimationDelay-=RUNNING_ANIMATION_DURATION;
                return;
            }

            this.calculateFactors();
        }

        this.calculateAnimationValues();
    }

    calculateFactors(){
        this.deltaTime=(this.keyframes[this.currentKeyFrameIndex].instant-this.previousInstant)/this.scene.SCENE_UPDATE_PERIOD;

        this.translateFactor=[
            (this.keyframes[this.currentKeyFrameIndex].translate_coords[0]-this.inicial_translate_coords[0])/this.deltaTime,
            (this.keyframes[this.currentKeyFrameIndex].translate_coords[1]-this.inicial_translate_coords[1])/this.deltaTime,
            (this.keyframes[this.currentKeyFrameIndex].translate_coords[2]-this.inicial_translate_coords[2])/this.deltaTime
        ];

        this.rotateFactor=[
            (this.keyframes[this.currentKeyFrameIndex].rotate_coords[0]-this.inicial_rotate_coords[0])/this.deltaTime,
            (this.keyframes[this.currentKeyFrameIndex].rotate_coords[1]-this.inicial_rotate_coords[1])/this.deltaTime,
            (this.keyframes[this.currentKeyFrameIndex].rotate_coords[2]-this.inicial_rotate_coords[2])/this.deltaTime
        ];

        this.scaleFactor=[
            Math.pow(this.keyframes[this.currentKeyFrameIndex].scale_coords[0] / this.inicial_scale_coords[0], 1/this.deltaTime),
            Math.pow(this.keyframes[this.currentKeyFrameIndex].scale_coords[1] / this.inicial_scale_coords[1], 1/this.deltaTime),
            Math.pow(this.keyframes[this.currentKeyFrameIndex].scale_coords[2] / this.inicial_scale_coords[2], 1/this.deltaTime)
        ];
    }

    calculateAnimationValues(){
        var currDeltaTime=(this.time-this.previousInstant)/this.scene.SCENE_UPDATE_PERIOD;

        if(this.time<0)
            currDeltaTime=0;

        //translation
        this.animation_translate_coords[0]=this.translateFactor[0]*currDeltaTime+this.inicial_translate_coords[0];
        this.animation_translate_coords[1]=this.translateFactor[1]*currDeltaTime+this.inicial_translate_coords[1];
        this.animation_translate_coords[2]=this.translateFactor[2]*currDeltaTime+this.inicial_translate_coords[2];

        //rotation
        this.animation_rotate_coords[0]=this.rotateFactor[0]*currDeltaTime+this.inicial_rotate_coords[0];
        this.animation_rotate_coords[1]=this.rotateFactor[1]*currDeltaTime+this.inicial_rotate_coords[1];
        this.animation_rotate_coords[2]=this.rotateFactor[2]*currDeltaTime+this.inicial_rotate_coords[2];

        //scale
        this.animation_scale_coords[0]=this.inicial_scale_coords[0]*Math.pow(this.scaleFactor[0], currDeltaTime);
        this.animation_scale_coords[1]=this.inicial_scale_coords[1]*Math.pow(this.scaleFactor[1], currDeltaTime);
        this.animation_scale_coords[2]=this.inicial_scale_coords[2]*Math.pow(this.scaleFactor[2], currDeltaTime);
    }

    apply() {
        this.AnimationMatrix = mat4.create();

        mat4.translate(this.AnimationMatrix, this.AnimationMatrix, this.animation_translate_coords);

        mat4.rotateX(this.AnimationMatrix, this.AnimationMatrix, this.animation_rotate_coords[0]);
        mat4.rotateY(this.AnimationMatrix, this.AnimationMatrix, this.animation_rotate_coords[1]);
        mat4.rotateZ(this.AnimationMatrix, this.AnimationMatrix, this.animation_rotate_coords[2]);

        mat4.scale(this.AnimationMatrix, this.AnimationMatrix, this.animation_scale_coords);

        this.scene.multMatrix(this.AnimationMatrix);
    }
}