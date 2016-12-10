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

function rtax( rx ) {
    return rx * WIDTH;
}

function rtay( ry ) {
    return ry * HEIGHT;
}

function getTexture(name) {
    return new PIXI.Sprite(PIXI.loader.resources[name].texture)
}

POINTS = (function() {
    function Point(x, y) {
        this.x = x;
        this.y = y;
        this.diff = function(p2) {
            return new Point(p2.x - this.x, p2.y - this.y);
        };
        this.length = function() {
            return Math.sqrt(Math.pow(this.x,2) + Math.pow(this.y,2));
        }
        this.dist = function(p2) {
            return this.diff(p2).length();
        }
    }
    return {
        ZERO: new Point(0,0),
        fromRel: function(rx, ry) {
            return new Point(rx*WIDTH, ry*HEIGHT);
        },
        fromAbs: function(x, y) {
            return new Point(x, y);
        },
        dist: function(p1, p2) {
            return p1.dist(p2);
        }
    }
})();

function Player(x, y) {
    this.pos = POINTS.fromAbs(x, y);
    KEY.add(KEY.w);
    KEY.add(KEY.a);
    KEY.add(KEY.s);
    KEY.add(KEY.d);

    this.sprite = getTexture("heroF1");
    this.speed = .1;
    this.persfac = .8;

    isDown = function(key) {
        return KEY.isDown(KEY[key]);
    }

    this.postfix = function() {
        let scalefactor = 0.8; // TODO WHY ISNT THIS WORKING??
        this.sprite.scale.set(scalefactor * GAME.scale.x, scalefactor * GAME.scale.y);
    }

    this.update = function() {
        this.sprite.position.set(this.pos.x, this.pos.y);
        if (isDown("a")) {
            this.pos.x -= deltaT * this.speed * GAME.scale.x;
        } else if (isDown("d")) {
            this.pos.x += deltaT * this.speed * GAME.scale.x;
        }
        if (isDown("w")) {
            this.pos.y -= deltaT * this.speed * this.persfac * GAME.scale.y;
        } else if (isDown("s")) {
            this.pos.y += deltaT * this.speed * this.persfac * GAME.scale.y;
        }
    }
}

var GAME = (function(){
    var gameStage = new PIXI.Container();
    var menuStage = new PIXI.Container();
    var confStage = new PIXI.Container();
    var backwall = HEIGHT / 5.1;
    return {
        mode: "SETUP",
        gameobjects: [],
        switch_to: function(newMode) {
            // destroying what needs to be destroyed
            DATA.stop_all();
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
                        var bg = getTexture("example");
                        bg.width = WIDTH;
                        bg.height = HEIGHT;
                        start_btn.position.set(HCENTER, VCENTER);
                        setting_btn.position.set(HCENTER, VCENTER+50);
                        menuStage.addChild(bg);
                        menuStage.addChild(start_btn);
                        menuStage.addChild(setting_btn);
                    }
                    DATA.play("menu");
                    break;
                case this.game:
                    gameStage.removeChildren();
                    var bg = getTexture("bg");
                    bg.width = WIDTH;
                    bg.height = HEIGHT;
                    bg.position.set(HCENTER, HEIGHT);
                    this.scale = {x: bg.scale.x, y: bg.scale.y};

                    var door = getTexture("bossdoor");
                    door.position.y = backwall;
                    door.position.x = HCENTER*1.65;
                    this.enterp = POINTS.fromAbs(door.position.x, door.position.y);

                    var ticket = getTexture("cardthing");
                    ticket.position.y = backwall - this.scale.y * 22;
                    ticket.position.x = door.position.x - this.scale.x * 80;

                    var shelf = getTexture("shelf");
                    shelf.position.y = backwall + this.scale.y * 12;
                    shelf.position.x = HCENTER/2;

                    var plant1 = getTexture("plant");
                    plant1.position.y = backwall + this.scale.y * 5;
                    plant1.position.x = HCENTER - this.scale.x * 10;

                    var plant2 = getTexture("plant");
                    plant2.position.y = VCENTER;
                    plant2.position.x = WIDTH - this.scale.x * 20;

                    var vase = getTexture("vase");
                    vase.position.y = VCENTER;
                    vase.position.x = this.scale.x * 20;

                    var printer = getTexture("printer");
                    printer.position.y = VCENTER * 1.5;
                    printer.position.x = this.scale.x * 20;

                    var fridge = getTexture("fridge");
                    fridge.position.y = HEIGHT - 30 * this.scale.y;
                    fridge.position.x = WIDTH - 20 * this.scale.x;

                    var trash1 = getTexture("trashcan");
                    trash1.position.y = HEIGHT - 10 * this.scale.y;
                    trash1.position.x = WIDTH - 20 * this.scale.x;

                    var trash2 = getTexture("trashcan");
                    trash2.position.y = rtay(.48);
                    trash2.position.x = rtax(.2);

                    var trash3 = getTexture("trashcan");
                    trash3.position.y = rtay(.87);
                    trash3.position.x = rtax(.625);

                    this.gameobjects = [
                        bg, door, ticket, shelf, plant1, plant2,
                        vase, printer, fridge, trash1, trash2, trash3
                    ];

                    function newWall(x, y, horizontal=true) {
                        let w = null;
                        if (horizontal) {
                            w = getTexture("wallH");
                        } else {
                            w = getTexture("wallV");
                        }
                        w.position.y = y;
                        w.position.x = x;
                        GAME.gameobjects.push(w);
                    }

                    newWall(rtax(.3),rtay(.48));
                    newWall(rtax(.375),rtay(.65),false);
                    newWall(rtax(.375),rtay(.8),false);
                    newWall(rtax(.3),rtay(.8));

                    newWall(rtax(.55),rtay(.48));
                    newWall(rtax(.7),rtay(.48));
                    newWall(rtax(.625),rtay(.65),false);
                    newWall(rtax(.625),rtay(.8),false);
                    newWall(rtax(.55),rtay(.8));
                    newWall(rtax(.7),rtay(.8));

                    let toadd = this.gameobjects;
                    this.player = new Player(rtax(.3), rtay(.55));
                    toadd.push(this.player.sprite);
                    for (var i in toadd) {
                        toadd[i].scale = this.scale;
                        toadd[i].anchor.set(0.5,1);
                        gameStage.addChild(toadd[i]);
                    }
                    toadd.pop();
                    GAME.player.postfix();
                    break;
                default:
                    break;
            }
            stage.addChild(this.getStage(newMode));

            cons("changed from mode ["+this.mode+"] to ["+newMode+"]");
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
