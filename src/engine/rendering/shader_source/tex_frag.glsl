precision mediump float;
uniform sampler2D sampler;
varying vec2 vUV;

void main(void) {
    gl_FragColor = texture2D(sampler, vUV);
}