// CALLED BEFORE GAME, AFTER DATA/HELPER

var renderer = new PIXI.WebGLRenderer(1280, 720);
var divContainer = document.getElementById("container");
divContainer.appendChild(renderer.view);

var stage = new PIXI.Container();

var GAME = (function(){
    

    return {
        mode: "MODE",
        switch_to: function(newMode) {
            // TODO handle switching;
            this.mode = newMode;
            return true;
        },
        // modes:
        menu: "MENU",
        game: "GAME",
        conf: "CONFIG"
    };
})();
