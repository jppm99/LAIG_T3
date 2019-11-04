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
        this.scene=scene;
        this.keyframes = keyframes;

        this.currentKeyFrameIndex = 0;
        this.previousKeyFrameMatrix = mat4.create();

        this.transitionMatrix = mat4.create();
        this.subtract(this.transitionMatrix, this.keyframes[this.currentKeyFrameIndex].matrix, this.previousKeyFrameMatrix);
        this.AnimationMatrix = mat4.create();
    }


    update(currInstant) {
        if (this.currentKeyFrameIndex < this.keyframes.length) {

            if (currInstant > this.keyframes[this.currentKeyFrameIndex].instant) {
                this.previousKeyFrameMatrix = this.keyframes[this.currentKeyFrameIndex].matrix;
                this.currentKeyFrameIndex++;

                if (this.currentKeyFrameIndex < this.keyframes.length) {
                    this.subtract(this.transitionMatrix, this.keyframes[this.currentKeyFrameIndex].matrix, this.previousKeyFrameMatrix);
                    this.multiplyScalarAndAdd(this.AnimationMatrix, this.previousKeyFrameMatrix, this.transitionMatrix, currInstant / this.keyframes[this.currentKeyFrameIndex].instant);
                } else {
                    this.AnimationMatrix = this.previousKeyFrameMatrix;
                }

            } else {
               this.multiplyScalarAndAdd(this.AnimationMatrix, this.previousKeyFrameMatrix, this.transitionMatrix, currInstant / this.keyframes[this.currentKeyFrameIndex].instant);
            }
        }
    }

    apply() {
        this.scene.multMatrix(this.AnimationMatrix);
    }

    subtract(out, a, b) {
        out[0] = a[0] - b[0];
        out[1] = a[1] - b[1];
        out[2] = a[2] - b[2];
        out[3] = a[3] - b[3];
        out[4] = a[4] - b[4];
        out[5] = a[5] - b[5];
        out[6] = a[6] - b[6];
        out[7] = a[7] - b[7];
        out[8] = a[8] - b[8];
        out[9] = a[9] - b[9];
        out[10] = a[10] - b[10];
        out[11] = a[11] - b[11];
        out[12] = a[12] - b[12];
        out[13] = a[13] - b[13];
        out[14] = a[14] - b[14];
        out[15] = a[15] - b[15];
        return out;
    }

    multiplyScalarAndAdd(out, a, b, scale) {
        out[0] = a[0] + (b[0] * scale);
        out[1] = a[1] + (b[1] * scale);
        out[2] = a[2] + (b[2] * scale);
        out[3] = a[3] + (b[3] * scale);
        out[4] = a[4] + (b[4] * scale);
        out[5] = a[5] + (b[5] * scale);
        out[6] = a[6] + (b[6] * scale);
        out[7] = a[7] + (b[7] * scale);
        out[8] = a[8] + (b[8] * scale);
        out[9] = a[9] + (b[9] * scale);
        out[10] = a[10] + (b[10] * scale);
        out[11] = a[11] + (b[11] * scale);
        out[12] = a[12] + (b[12] * scale);
        out[13] = a[13] + (b[13] * scale);
        out[14] = a[14] + (b[14] * scale);
        out[15] = a[15] + (b[15] * scale);
        return out;
    }
}