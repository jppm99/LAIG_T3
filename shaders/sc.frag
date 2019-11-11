#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform float time;
uniform sampler2D uSampler;
uniform float height, width;

float lineSize = 0.01;
float lineIntensity = 0.7;

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


void main() {

	vec2 batota = vec2(1.0, 1.0);

	batota.x = 1920.0 / width;
	batota.y = 1080.0 / height;

	vec2 correctedTC = vec2(vTextureCoord.x / batota.x, vTextureCoord.y / batota.y);

	vec4 ogTex = texture2D(uSampler, correctedTC);

	float dist = ((vTextureCoord.x - 0.5) * (vTextureCoord.x - 0.5)) + ((vTextureCoord.y - 0.5) * (vTextureCoord.y - 0.5));

	float sombra = dist / 2.0;

	for(int i = 0; i < 3; i++){
		ogTex[i] = maior(ogTex[i] - sombra, 0.0);
	}


	if(mod(vTextureCoord.y - time) < lineSize) {
		for(int i = 0; i < 3; i++) {
			ogTex[i] = menor(1.0, ogTex[i] + (lineIntensity - mod(vTextureCoord.y - time) - lineSize));
		}
	}


	gl_FragColor = ogTex;
}
