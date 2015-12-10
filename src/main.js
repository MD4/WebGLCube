(function (Game, Cube, ShadersUtils, ImageUtils) {

    window.start = function () {
        var RotatingCube = Cube.extend({
            update: function (time, delta, elapsedTime) {
                this._super();

                this.rotation[0] += Math.sin(time / 4000) * 0.01 * delta;
                this.rotation[1] += 0.01 * delta;

                this.position[0] = Math.cos(time / 1000);
                this.position[2] = Math.sin(time / 1000);
            }
        });

        var cube = new RotatingCube();

        var containerElement = document.querySelector('canvas#container');
        var shaderFsElement = document.querySelector('script#shader-fs');
        var shaderVsElement = document.querySelector('script#shader-vs');

        var game = new Game(containerElement);


        game.setShader('shader-fs', ShadersUtils.getShader(shaderFsElement));
        game.setShader('shader-vs', ShadersUtils.getShader(shaderVsElement));

        game.start();

        ImageUtils.getImage('res/textures/cube-diffuse.jpg', function (image) {
            game.setTexture('cube-diffuse', image);

            game.addMesh(cube);

            game.camera.position = [0., 0., -6.];
        });

    };

})(
    EPSI.WebGL.core.Game,
    EPSI.WebGL.entities.Cube,
    EPSI.WebGL.utils.ShadersUtils,
    EPSI.WebGL.utils.ImageUtils
);