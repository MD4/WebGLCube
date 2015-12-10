(function () {

    EPSI.WebGL.utils.MatrixUtils = {

        identity: function () {
            return Matrix.I(4);
        },

        multiply: function (firstMatrix, secondMatrix) {
            return firstMatrix.x(secondMatrix);
        },

        translate: function (matrix, translation) {
            return this.multiply(
                matrix,
                Matrix.Translation(
                    $V([
                        translation[0],
                        translation[1],
                        translation[2]
                    ])
                ).ensure4x4()
            );
        },

        uniformize: function (gl, shaderProgram, perspectiveMatrix, matrix) {
            var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
            gl.uniformMatrix4fv(pUniform, false, new Float32Array(perspectiveMatrix.flatten()));

            var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
            gl.uniformMatrix4fv(mvUniform, false, new Float32Array(matrix.flatten()));

            var normalMatrix = matrix.inverse();
            normalMatrix = normalMatrix.transpose();
            var nUniform = gl.getUniformLocation(shaderProgram, "uNormalMatrix");
            gl.uniformMatrix4fv(nUniform, false, new Float32Array(normalMatrix.flatten()));
        },

        multiRotate: function (matrix, angle, rotate) {
            var rotationMatrix = Matrix.Rotation(
                angle,
                $V([
                    rotate[0],
                    rotate[1],
                    rotate[2]
                ])
            ).ensure4x4();
            return this.multiply(matrix, rotationMatrix);
        },

       rotate: function (matrix, rotate) {
            var result = this.multiRotate(matrix, rotate[0], [1, 0, 0]);
           result = this.multiRotate(result, rotate[1], [0, 1, 0]);
           return this.multiRotate(result, rotate[2], [0, 0, 1]);
        }

    };

})();

