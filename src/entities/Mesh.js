(function (Entity, MatrixUtils, MatrixStack) {

    EPSI.WebGL.entities.Mesh = Entity.extend({

        position: [1., 0., 0.],
        rotation: [0., 0., 0.],
        verticeBuffer: null,
        matrixStack: null,

        init: function (position) {
            this._super.apply(this, arguments);
            this.position = position || this.position;
            this.matrixStack = new MatrixStack();
        },

        build: function (gl) {
            this.verticeBuffer = gl.createBuffer();

            gl.bindBuffer(gl.ARRAY_BUFFER, this.verticeBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.getVertices()), gl.STATIC_DRAW);

            this.normalBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.getNormals()), gl.STATIC_DRAW);

            // Map the texture onto the cube's faces.

            this.textureCoordBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.getTextureCoordinates()), gl.STATIC_DRAW);


            this.vertexIndices = this.getVertexIndices();
            this.verticesIndexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.verticesIndexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.vertexIndices), gl.STATIC_DRAW);
        },

        getVertices: function () {
            return [];
        },

        getNormals: function () {
            return [];
        },

        getTextureCoordinates: function () {
            return [];
        },

        getVertexIndices: function () {
            return [];
        },

        beforeDraw: function (game) {
            game.viewMatrix = this.matrixStack.push(game.viewMatrix);
            game.viewMatrix = MatrixUtils.translate(game.viewMatrix, this.position);
            game.viewMatrix = MatrixUtils.rotate(game.viewMatrix, this.rotation);
        },

        draw: function (game) {
            this._super.apply(this, arguments);

            game.gl.bindBuffer(game.gl.ARRAY_BUFFER, this.verticeBuffer);
            game.gl.vertexAttribPointer(game.vertexPositionAttribute, 3, game.gl.FLOAT, false, 0, 0);

            // Texture coords

            game.gl.bindBuffer(game.gl.ARRAY_BUFFER, this.textureCoordBuffer);
            game.gl.vertexAttribPointer(game.textureCoordAttribute, 2, game.gl.FLOAT, false, 0, 0);

            // Normals

            game.gl.bindBuffer(game.gl.ARRAY_BUFFER, this.normalBuffer);
            game.gl.vertexAttribPointer(game.vertexNormalAttribute, 3, game.gl.FLOAT, false, 0, 0);

            // Texture map

            game.gl.activeTexture(game.gl.TEXTURE0);
            game.gl.bindTexture(game.gl.TEXTURE_2D, game.getTexture('cube-diffuse'));
            game.gl.uniform1i(game.gl.getUniformLocation(game.shaderProgram, "uSampler"), 0);

            // Draw

            game.gl.bindBuffer(game.gl.ELEMENT_ARRAY_BUFFER, this.verticesIndexBuffer);
            MatrixUtils.uniformize(game.gl, game.shaderProgram, game.perspectiveMatrix, game.viewMatrix);
            game.gl.drawElements(game.gl.TRIANGLES, this.vertexIndices.length, game.gl.UNSIGNED_SHORT, 0);
        },

        afterDraw: function (game) {
            game.viewMatrix = this.matrixStack.pop();
        }

    });

})(
    EPSI.WebGL.entities.Entity,
    EPSI.WebGL.utils.MatrixUtils,
    EPSI.WebGL.utils.MatrixStack
);

