(function () {

    EPSI.WebGL.utils.ImageUtils = {

        getImage: function (url, callback) {
            var image = new Image();
            image.onload = function() {
                setTimeout(function() {
                    callback(image);
                }, 1000);
            };
            image.src = url;
        }

    };

})();


