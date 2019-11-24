/**
 * KeyFrame
 * @constructor
 * @param instant - Instant in seconds of the Keyframe
 * @param translate_coords - Translation values of keyframe
 * @param rotate_coords - Rotation values of keyframe
 * @param scale_coords - Scale values of keyframe
 * */

class KeyFrame {
    constructor(instant, translate_coords, rotate_coords, scale_rotate){
        this.instant=instant;
        this.translate_coords=translate_coords;
        this.rotate_coords=rotate_coords;
        this.scale_coords=scale_rotate;
    }
}