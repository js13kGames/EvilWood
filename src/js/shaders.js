function gl_getFragmentShaderGLSL() {
  return '#ifdef GL_ES\n' +
    'precision highp float;\n' +
    '#endif\n' +
    'varying vec2 vTextureCoord;\n' +
    'varying vec3 vLightWeighting;\n' +
    'uniform sampler2D uSampler;\n' +
    'void main(void) {\n' +
        'vec4 textureColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));\n' +
        'gl_FragColor = vec4(textureColor.rgb * vLightWeighting, textureColor.a);\n' +
    '}';
};

function gl_getVertexShaderGLSL() {
  return 'attribute vec3 aVertexPosition;\n' +
    'attribute vec3 aVertexNormal;\n' +
    'attribute vec2 aTextureCoord;\n' +

    'uniform mat4 uMVMatrix;\n' +
    'uniform mat4 uPMatrix;\n' +
    'uniform mat3 uNMatrix;\n' +

    'uniform vec3 uAmbientColor;\n' +

    'uniform vec3 uPointLightingLocation;\n' +
    'uniform vec3 uPointLightingColor;\n' +

    'uniform bool uUseLighting;\n' +

    'varying vec2 vTextureCoord;\n' +
    'varying vec3 vLightWeighting;\n' +

    'void main(void) {\n' +
        'vec4 mvPosition = uMVMatrix * vec4(aVertexPosition, 1.0);\n' +
        'gl_Position = uPMatrix * mvPosition;\n' +
        'vTextureCoord = aTextureCoord;\n' +

        'if (!uUseLighting) {\n' +
            'vLightWeighting = vec3(1.0, 1.0, 1.0);\n' +
        '} else {\n' +
            'vec3 lightDirection = normalize(uPointLightingLocation - mvPosition.xyz);\n' +

            'vec3 transformedNormal = uNMatrix * aVertexNormal;\n' +
            'float directionalLightWeighting = max(dot(transformedNormal, lightDirection), 0.0);\n' +
            'vLightWeighting = uAmbientColor + uPointLightingColor * directionalLightWeighting;\n' +
        '}\n' +
    '}'
};