(function (Entity) {

    EPSI.WebGL.entities.Camera = Entity.extend({

        position: [0., 0., 0.],

        init: function (position) {
            this._super.apply(this, arguments);
            this.position = position || this.position;
        }

    });

})(
    EPSI.WebGL.entities.Entity
);

