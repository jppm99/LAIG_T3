/**
 * KeyFrame
 * @constructor
 * @param instant - Instant in seconds of the Keyframe
 * @param matrix - Matrix that represents the status of the object
 * */

class KeyFrame {
    constructor(instant, matrix){
        this.instant=instant;
        this.matrix=matrix;
    }
}