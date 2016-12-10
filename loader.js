// CALLED BEFORE GAME, AFTER DATA/HELPER
var WIDTH = 1280;
var HEIGHT = 720;

var VCENTER = HEIGHT/2;
var HCENTER = WIDTH/2;

var renderer = new PIXI.WebGLRenderer(WIDTH, HEIGHT, { antialias: false, roundPixels: true } );
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

    this.sprite = getTexture("heroF1");
    this.speed = .1;
    this.persfac = .8;

    isDown = function(key) {
        return KEY.isDown(KEY[key]);
    }

    getPlayer = function(fname) {
        let t = getTexture(fname);
        let scalefactor = 0.8;
        t.scale.set(scalefactor * GAME.scale.x, scalefactor * GAME.scale.y);
        t.anchor.set(0.5,1);
        return t;
    }

    this.downSprites = [
        getPlayer("heroF1"), getPlayer("heroF2")
    ];
    this.sideSprites = [
        getPlayer("heroS1"), getPlayer("heroS2")
    ];
    this.upSprites = [
        getPlayer("heroB1"), getPlayer("heroB2")
    ];

    this.allSprites = [
        this.upSprites,
        this.sideSprites,
        this.downSprites,
    ];

    this.postfix = function() {
        let scalefactor = 0.8;
        this.sprite.scale.set(scalefactor * GAME.scale.x, scalefactor * GAME.scale.y);
        this.sprite.anchor.set(0.5,1);
    }

    this.show = this.downSprites;
    this.currentindex = 0;
    let animmax = 20;
    this.animstate = animmax;
    this.currentface = 2;

    this.flip = function(undo = false) {
        if (undo) {
            for (var i = 0; i < this.show.length; i++) {
                this.show[i].scale.x = Math.abs(this.show[i].scale.x);
            }
        } else {
            for (var i = 0; i < this.show.length; i++) {
                this.show[i].scale.x = -1 * Math.abs(this.show[i].scale.x);
            }
        }
    }

    this.switch_sprite_array = function(to) {
        GAME.getCurrentStage().removeChild(this.sprite);
        switch (to) {
            case 0:
                this.show = this.upSprites;
                break;
            case 1:
                this.show = this.sideSprites;
                break;
            case 2:
                this.show = this.downSprites;
                break;
            case 3:
                this.show = this.sideSprites;
                break;
        }
        this.sprite = this.show[this.currentindex];

        if (to == 1) {
            this.flip(false);
        } else {
            this.flip(true);
        }
        GAME.getCurrentStage().addChild(this.sprite);
        this.currentface = to;
    }

    this.update = function() {
        this.sprite.position.set(this.pos.x, this.pos.y);
        let n = -1;
        if (isDown("a")) {
            this.pos.x -= deltaT * this.speed * GAME.scale.x;
            this.animstate -= 1;
            n = 3;
        } else if (isDown("d")) {
            this.pos.x += deltaT * this.speed * GAME.scale.x;
            this.animstate -= 1;
            n = 1;
        }
        if (isDown("w")) {
            this.pos.y -= deltaT * this.speed * this.persfac * GAME.scale.y;
            this.animstate -= 1;
            n = 0;
        } else if (isDown("s")) {
            this.pos.y += deltaT * this.speed * this.persfac * GAME.scale.y;
            this.animstate -= 1;
            n = 2;
        }
        if ( n >= 0 && n != this.currentface ) {
            this.switch_sprite_array(n);
        }
        if ( this.animstate < 0 ) {
            GAME.getCurrentStage().removeChild(this.sprite);
            this.animstate = animmax;
            this.currentindex = (this.currentindex + 1) % this.show.length;
            this.sprite = this.show[this.currentindex];
            GAME.getCurrentStage().addChild(this.sprite);
        }
        for ( var i = 0; i < this.allSprites.length; i++ ) {
            for ( var j = 0; j < this.allSprites[i].length; j++) {
                this.allSprites[i][j].position.set(this.pos.x, this.pos.y);
            }
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

                    this.clock = {};
                    this.clock.hours = newText("5", null, "sans-serif", 20, 0x2EAA01);
                    this.clock.minutes = newText("00", null, "sans-serif", 20, 0x2EAA01);
                    this.clock.hours.position.set(rtax(.649), rtay(.0632));
                    this.clock.minutes.position.set(rtax(.665), rtay(.0632));

                    this.clock.setTime = function(hours, minutes) {
                        this.hours.text = hours;
                        this.minutes.text = ('0'+minutes).slice(-2);
                    }

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
                    gameStage.addChild(this.clock.hours);
                    gameStage.addChild(this.clock.minutes);
                    GAME.player.postfix();
                    DATA.play("office");
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


var pointlist = (function() {
    let c1 = .128; // ✓
    let c2 = .428; // ✓
    let c3 = .852; // ✓
    let r1 = .313; // ✓
    let r2 = .594; // ✓
    let r3 = .970; // ✓
    return [
        POINTS.fromRel(c1, r1), // 0 c1 top
        POINTS.fromRel(c1, r2), // 1 c1 middle
        POINTS.fromRel(c1, r3), // 2 c1 bottom

        POINTS.fromRel(.27, r2), // 3 q1

        POINTS.fromRel(c2, r1), // 4
        POINTS.fromRel(c2, r2), // 5
        POINTS.fromRel(c2, r3), // 6

        POINTS.fromRel(c2+.1, r2), // 7 q2

        POINTS.fromRel(c3, r1), // 8
        POINTS.fromRel(c3, r2), // 9
        POINTS.fromRel(c3, r3), // 10

        POINTS.fromRel(c3-.12, r2), // 11 q3

        POINTS.fromRel(.666,.228) // 12 ticket maschine
    ];
})();

var adjlist = (function() {
    return [
        [0, 1, 4],
        [1, 0, 3, 2],
        [2, 1, 6],
        [3, 1],
        [4, 5, 0, 12],
        [5, 4, 6, 7],
        [6, 5, 2, 10],
        [7, 5],
        [8, 4, 12, 9],
        [9, 8, 10, 11],
        [10, 9, 6],
        [11, 9],
        [12, 4, 8]
    ];
})();

function getPossibleNext(index){
    return adjlist[index][getRandomInt(0,adjlist[index].length)];
}

function _test_move(index) {
    num = getPossibleNext(index);
    GAME.player.pos = pointlist[num];
    return num;
}

function start_test(iterations=20, sleep=1, n=12) {
    if (iterations > 0) {
        n = _test_move(n);
        setTimeout(function(){ start_test(iterations-1, sleep, n); }, sleep*1000);
    }
}
