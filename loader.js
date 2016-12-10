// CALLED BEFORE GAME, AFTER DATA/HELPER

var renderer = new PIXI.WebGLRenderer(1280, 720);
var divContainer = document.getElementById("container");
divContainer.appendChild(renderer.view);

var stage = new PIXI.Container();

var GAME = (function(){
    var gameStage = new PIXI.Container();
    var menuStage = new PIXI.Container();
    var confStage = new PIXI.Container();
    return {
        mode: "MODE",
        switch_to: function(newMode) {
            // destroying what needs to be destroyed
            switch (this.mode) {
                default:
                    break;
            }
            stage.removeChild(this.getCurrentStage());

            // build what needs to be built
            switch (newMode) {
                case this.menu:
                    DATA.play("office");
                default:
                    break;
            }
            stage.addChild(this.getStage(newMode));

            this.mode = newMode;
            return true;
        },
        getStage: function(mode) {
            switch (mode) {
                case this.menu:
                    return menuStage;
                case this.game:
                    return gameStage;
                case this.conf:
                    return confStage;
                default:
                    return null;
            }
        },
        getCurrentStage: function() {
            return this.getStage(this.mode);
        },
        // modes:
        menu: "MENU",
        game: "GAME",
        conf: "CONFIG"
    };
})();
