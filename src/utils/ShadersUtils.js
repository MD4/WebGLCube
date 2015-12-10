(function () {

    EPSI.WebGL.utils.ShadersUtils = {

        getShader: function (shaderElement) {
            if (!shaderElement) {
                return null;
            }

            var theSource = '';
            var currentChild = shaderElement.firstChild;

            while (currentChild) {
                if (currentChild.nodeType == 3) {
                    theSource += currentChild.textContent;
                }

                currentChild = currentChild.nextSibling;
            }

            return {
                type: shaderElement.type,
                script: theSource
            };
        }

    };

})();


