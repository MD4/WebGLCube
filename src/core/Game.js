(function (Camera, MatrixUtils) {
    EPSI.WebGL.core.Game = Class.extend({

        gl: null,
        shaderScripts: {},
        textures: {},
        shaders: {},
        meshes: [],
        camera: null,
        viewMatrix: null,
        lastRender: null,

        init: function (containerElement) {
            this.container = containerElement;
        },

        setShader: function (name, shaderScript) {
            this.shaderScripts[name] = shaderScript;
        },

        setTexture: function (name, image) {
            this.textures[name] = this.createTexture(image);
        },

        createTexture: function (image) {
            var texture = this.gl.createTexture();
            this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
            this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_NEAREST);
            this.gl.generateMipmap(this.gl.TEXTURE_2D);
            this.gl.bindTexture(this.gl.TEXTURE_2D, null);
            return texture;
        },

        compileShaderScript: function (name) {
            var shader;

            if (this.shaderScripts[name].type == 'x-shader/x-fragment') {
                shader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
            } else if (this.shaderScripts[name].type == 'x-shader/x-vertex') {
                shader = this.gl.createShader(this.gl.VERTEX_SHADER);
            } else {
                return null;
            }

            this.gl.shaderSource(shader, this.shaderScripts[name].script);
            this.gl.compileShader(shader);

            if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
                alert('An error occurred compiling the shaders: ' + this.gl.getShaderInfoLog(shader));
                return null;
            }

            return shader;
        },

        compileShaderScripts: function () {
            for (var shaderName in this.shaderScripts) {
                this.shaders[shaderName] = this.compileShaderScript(shaderName);
            }
        },

        getShader: function (name) {
            return this.shaders[name];
        },


        getTexture: function (name) {
            return this.textures[name];
        },

        initialize: function () {
            try {
                this.gl = this.container.getContext('experimental-webgl');
            }
            catch (e) {
                console.error('Unable to initialize WebGL. Your browser may not support it.', e);
                return false;
            }
            if (!this.gl) {
                return false;
            }

            this.gl.clearColor(0.3, 0.3, 0.4, 1.0);
            this.gl.clearDepth(1.0);
            this.gl.enable(this.gl.DEPTH_TEST);
            this.gl.depthFunc(this.gl.LEQUAL);

            this.camera = new Camera();

            this.compileShaderScripts();

            return true;
        },

        initializeShaders: function () {
            var fragmentShader = this.getShader('shader-fs');
            var vertexShader = this.getShader('shader-vs');

            this.shaderProgram = this.gl.createProgram();
            this.gl.attachShader(this.shaderProgram, vertexShader);
            this.gl.attachShader(this.shaderProgram, fragmentShader);
            this.gl.linkProgram(this.shaderProgram);

            if (!this.gl.getProgramParameter(this.shaderProgram, this.gl.LINK_STATUS)) {
                alert('Unable to initialize the shader program.');
            }

            this.gl.useProgram(this.shaderProgram);

            this.vertexPositionAttribute = this.gl.getAttribLocation(this.shaderProgram, 'aVertexPosition');
            this.gl.enableVertexAttribArray(this.vertexPositionAttribute);

            this.textureCoordAttribute = this.gl.getAttribLocation(this.shaderProgram, 'aTextureCoord');
            this.gl.enableVertexAttribArray(this.textureCoordAttribute);

            this.vertexNormalAttribute = this.gl.getAttribLocation(this.shaderProgram, "aVertexNormal");
            this.gl.enableVertexAttribArray(this.vertexNormalAttribute);
        },

        start: function () {
            if (!this.initialize(this.container)) {
                return false;
            }

            this.initializeShaders();

            this.lastRender = +new Date();

            requestAnimationFrame(this.loop.bind(this));

            return true;
        },

        loop: function (time) {
            var delta = (time - this.lastRender) / 16.66666667;
            var elapsedTime = time - this.lastRender;

            this.update(time, delta, elapsedTime);
            this.draw(time, delta, elapsedTime);

            this.lastRender = time;

            requestAnimationFrame(this.loop.bind(this));
        },

        draw: function (time, delta, elapsedTime) {
            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

            this.perspectiveMatrix = makePerspective(45, 1280.0 / 728.0, 0.1, 100.0);

            this.viewMatrix = MatrixUtils.identity();
            this.viewMatrix = MatrixUtils.translate(this.viewMatrix, this.camera.position);

            this.meshes.forEach(function (entity) {
                entity.beforeDraw(this, time, delta, elapsedTime);
                entity.draw(this, time, delta, elapsedTime);
                entity.afterDraw(this, time, delta, elapsedTime);
            }.bind(this));

        },

        update: function (time, delta, elapsedTime) {
            this.meshes.forEach(function (entity) {
                entity.update(time, delta, elapsedTime);
            }.bind(this));
        },

        addMesh: function (mesh) {
            mesh.build(this.gl);
            this.meshes.push(mesh);
        }

    });


})(
    EPSI.WebGL.entities.Camera,
    EPSI.WebGL.utils.MatrixUtils
);


/**
 * Shim
 */
window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();