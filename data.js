// IMAGES TO LOAD INTO PIXI
var IMAGES = [];
var DATA = (function() {
    var prefix = "resources/";
    return {
        add: function(img, name) {
            IMAGES[IMAGES.length]=[img,name];
        },
        run: function(callback) {
            let loader = PIXI.loader;
            for ( let i = 0; i < IMAGES.length; i++ ){
                loader = loader.add(prefix + IMAGES[i][0], IMAGES[i][0]);
            }
            loader.load(callback);
        }
    };
})();

DATA.add("office.png", "office");
