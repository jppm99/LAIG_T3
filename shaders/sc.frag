#ifdef GL_ES
precision highp float;
#endif

uniform float time;
varying vec2 vTextureCoord;
uniform sampler2D uSampler;

float menor(float x, float y) {
    if(x<y) return x;
    else return y;
}

float maior(float x, float y) {
    if(x>y) return x;
    else return y;
}

float mod(float x) {
    if(x<0.0) return -x;
    else return x;
}

float lineSize = 0.01;
float lineIntensity = 0.7;

void main() {

	 vec4 ogTex = texture2D(uSampler, vTextureCoord / 1.13);

	 float dist = ((vTextureCoord.x - 0.5) * (vTextureCoord.x - 0.5)) + ((vTextureCoord.y - 0.5) * (vTextureCoord.y - 0.5));

	 float sombra = dist / 2.0;

	 for(int i = 0; i < 3; i++){
	    ogTex[i] = maior(ogTex[i] - sombra, 0.0);
	 }


	 if(mod(vTextureCoord.y - time) < lineSize) {
	    for(int i = 0; i < 3; i++){
	        ogTex[i] = menor(1.0, ogTex[i] + (lineIntensity - mod(vTextureCoord.y - time) - lineSize));
	    }
	 }


	 gl_FragColor = ogTex;
}
