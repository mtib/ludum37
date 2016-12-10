// CALLED BEFORE GAME, AFTER DATA/HELPER
var WIDTH = 1280;
var HEIGHT = 720;

var VCENTER = HEIGHT/2;
var HCENTER = WIDTH/2;

var renderer = new PIXI.WebGLRenderer(WIDTH, HEIGHT, { antialias: false } );
PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;
var divContainer = document.getElementById("container");
divContainer.appendChild(renderer.view);

var stage = new PIXI.Container();

function newText( text, callback=null, font="sans-serif", size=24, fill=0x000000, align="center", click=null) {
    let tmp = new PIXI.Text(text, {fontFamily: font, fontSize: size, fill: fill, align: align});
    tmp.anchor.set(0.5, 0.5);
    if ( callback !== null ) {
        tmp.interactive = true;
        tmp.click = callback;
    }
    return tmp;
}

var GAME = (function(){
    var gameStage = new PIXI.Container();
    var menuStage = new PIXI.Container();
    var confStage = new PIXI.Container();
    return {
        mode: "SETUP",
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
                    if (menuStage.children.length == 0) {
                        var start_btn = newText("Start", function(e){GAME.switch_to(GAME.game)});
                        var setting_btn = newText("Settings");
                        var bg = new PIXI.Sprite(PIXI.loader.resources.example.texture);
                        bg.width = WIDTH;
                        bg.height = HEIGHT;
                        start_btn.position.set(HCENTER, VCENTER);
                        setting_btn.position.set(HCENTER, VCENTER+50);
                        menuStage.addChild(bg);
                        menuStage.addChild(start_btn);
                        menuStage.addChild(setting_btn);
                    }
                    DATA.play("office");
                default:
                    break;
            }
            stage.addChild(this.getStage(newMode));

            cons("changed from mode ["+this.mode+"] to ["+newMode+"]");
            DATA.stop_all();
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
