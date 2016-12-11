var renderer = new PIXI.autoDetectRenderer(WIDTH, HEIGHT, { antialias: false, roundPixels: true } );
PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;
var divContainer = document.getElementById("container");
divContainer.appendChild(renderer.view);
var stage = new PIXI.Container();

var GAME = (function(){
    var gameStage = new PIXI.Container();
    var menuStage = new PIXI.Container();
    var confStage = new PIXI.Container();
    var backwall = HEIGHT / 5.1;
    var gobj = null;
    return {
        mode: "SETUP",
        gameobjects: [],
        regen_gobj: function() {
            gobj.destroy();
            gobj = new PIXI.Graphics();
            gobj.lineStyle(4,0xB2FF58);
            this.getCurrentStage().addChild(gobj);
            return gobj;
        },
        pushGameObj: function(sprite) {
            if ( this.getStage("GAME").children.length == 0 ) {
                this.getStage("GAME").addChild(sprite);
                return 0;
            } else {
                for ( var i = 0; i < this.getStage("GAME").children.length; i++ ) {
                    if ( this.getStage("GAME").getChildAt(i).position.y > sprite.position.y ) {
                        this.getStage("GAME").addChildAt(sprite, i);
                        return i;
                    }
                }
                this.getStage("GAME").addChild(sprite);
                return this.getStage("GAME").children.length-1
            }
        },
        getBackY: function() { return backwall; },
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
                        var start_btn = newText("Start", function(e){GAME.switch_to(GAME.game)}, 46);
                        var setting_btn = newText("Settings", null, 46);
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
                    gobj = new PIXI.Graphics();
                    var bg = getTexture("bg");
                    bg.width = WIDTH;
                    bg.height = HEIGHT;
                    this.pushGameObj(bg);
                    this.scale = {x: bg.scale.x, y: bg.scale.y};

                    var door = getTexture("bossdoor");
                    door.position.y = backwall;
                    door.position.x = HCENTER*1.65;
                    this.enterp = POINTS.fromAbs(door.position.x, door.position.y);

                    this.clock = {};
                    this.clock.hours = newText("", null, 20, 0x2EAA01);
                    this.clock.minutes = newText("", null, 20, 0x2EAA01);
                    this.clock.hours.position.set(rtax(.649), rtay(.065));
                    this.clock.minutes.position.set(rtax(.665), rtay(.065));

                    this.clock.setTime = function(hours, minutes) {
                        this.time = hours*60+minutes;
                        this.hours.text = hours.toString();
                        this.minutes.text = ('0'+minutes).slice(-2);
                    }
                    this.clock.setTime(0, 0);
                    this.clock.add = function(minutes) {
                        this.time += minutes;
                        this.minutes.text = ('0'+this.time % 60).slice(-2);
                        this.hours.text = Math.floor(this.time/60).toString();
                    }
                    // this will break, when doing more complex rendering stuffs
                    // https://github.com/pixijs/pixi.js/issues/3373
                    //
                    // window.setInterval(function(){
                    //     this.add(1);
                    // }.bind(this.clock), 1000);

                    var ticket = getTexture("cardthing");
                    ticket.position.y = backwall - this.scale.y * 22;
                    ticket.position.x = door.position.x - this.scale.x * 80;
                    ticket.scale = this.scale;
                    ticket.anchor.set(0.5,1);
                    gameStage.addChild(ticket);

                    var shelf = getTexture("shelf");
                    shelf.position.y = backwall + this.scale.y * 12;
                    shelf.position.x = HCENTER/2;
                    shelf.hideable = true;
                    shelf.tall = true;

                    var plant1 = getTexture("plant");
                    plant1.position.y = backwall + this.scale.y * 5;
                    plant1.position.x = HCENTER - this.scale.x * 10;
                    plant1.hideable = true;
                    plant1.tall = true;

                    var plant2 = getTexture("plant");
                    plant2.position.y = VCENTER;
                    plant2.position.x = WIDTH - this.scale.x * 20;
                    plant2.hideable = true;
                    plant2.tall = true;

                    var vase = getTexture("vase");
                    vase.position.y = VCENTER;
                    vase.position.x = this.scale.x * 20;
                    vase.hideable = true;
                    vase.tall = true;

                    var printer = getTexture("printer");
                    printer.position.y = VCENTER * 1.5;
                    printer.position.x = this.scale.x * 20;
                    printer.hideable = true;
                    printer.tall = true;

                    var fridge = getTexture("fridge");
                    fridge.position.y = HEIGHT - 30 * this.scale.y;
                    fridge.position.x = WIDTH - 20 * this.scale.x;
                    fridge.hideable = true;
                    fridge.tall = true;

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
                        door, shelf, plant1, plant2,
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
                        w.tall = true;
                        GAME.gameobjects.push(w);
                    }

                    function newTable(rx, ry, horizontal=false) {
                        let t = null;
                        if (horizontal) {
                            t = getTexture("tabelH");
                        } else {
                            t = getTexture("tabelV");
                        }
                        t.position.y = rtay(ry);
                        t.position.x = rtax(rx);
                        t.hideable = true;
                        GAME.gameobjects.push(t);
                    }

                    newWall(rtax(.3),rtay(.48));
                    newWall(rtax(.375),rtay(.65),false);
                    newWall(rtax(.375),rtay(.8),false);
                    newTable(.3,.57,true);
                    newWall(rtax(.3),rtay(.8));

                    newWall(rtax(.55),rtay(.48));
                    newWall(rtax(.7),rtay(.48));
                    newTable(.59,.66);
                    newTable(.66,.66);
                    newWall(rtax(.625),rtay(.65),false);
                    newWall(rtax(.625),rtay(.8),false);
                    newWall(rtax(.55),rtay(.8));
                    newWall(rtax(.7),rtay(.8));

                    let borderbox_show = false;
                    for (var i in this.gameobjects) {
                        this.gameobjects[i].scale = this.scale;
                        this.gameobjects[i].anchor.set(0.5,1);
                        this.pushGameObj(this.gameobjects[i]);

                        // border box:
                        let g = new PIXI.Graphics();
                        g.lineStyle(1,0xFF0000);
                        let x = this.gameobjects[i].position.x;
                        let y = this.gameobjects[i].position.y;
                        let w = this.gameobjects[i].width;
                        let h = this.gameobjects[i].height;
                        g.drawRect(x-w/2, y-h, w, h);
                        if (borderbox_show) {
                            // actually show it:
                            this.pushGameObj(g);
                        }
                    }
                    Coworker.generate_coworkers();
                    this.player = new Player(rtax(.3), rtay(.65));
                    this.player.postfix();
                    this.pushGameObj(this.player.sprite);
                    gameStage.addChild(this.clock.hours);
                    gameStage.addChild(this.clock.minutes);
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

// POINT LIST FOR PATH FINDING
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

        POINTS.fromRel(.27, r2+.05), // 3 q1

        POINTS.fromRel(c2, r1), // 4
        POINTS.fromRel(c2, r2), // 5
        POINTS.fromRel(c2, r3), // 6

        POINTS.fromRel(c2+.1, r2), // 7 q2

        POINTS.fromRel(c3, r1), // 8
        POINTS.fromRel(c3, r2), // 9
        POINTS.fromRel(c3, r3), // 10

        POINTS.fromRel(c3-.12, r2), // 11 q3

        POINTS.fromRel(.666,.228), // 12 ticket maschine
        POINTS.fromRel(.821,.226) // door
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
        [8, 4, 12, 9, 13],
        [9, 8, 10, 11],
        [10, 9, 6],
        [11, 9],
        [12, 4, 8],
        [13, 8]
    ];
})();
