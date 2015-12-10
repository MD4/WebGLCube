(function () {

    EPSI.WebGL.utils.MatrixStack = Class.extend({

        stack: [],

        init: function () {
            this.stack = [];
        },

        push: function (matrix, transform) {
            if (transform) {
                this.stack.push(transform.dup());
                return transform.dup();
            }
            this.stack.push(matrix.dup());
            return matrix;
        },

        pop: function () {
            if (!this.stack.length) {
                throw("Can't pop from an empty matrix stack.");
            }
            return this.stack.pop();
        }

    });

})();

