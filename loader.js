var renderer = new PIXI.autoDetectRenderer(WIDTH, HEIGHT, { antialias: false, roundPixels: true } );
PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;
var divContainer = document.getElementById("container");
divContainer.appendChild(renderer.view);
var stage = new PIXI.Container();
var guiStage = new PIXI.Container();
stage.addChild(guiStage);

var GAME = (function(){
    var gameStage = new PIXI.Container();
    var menuStage = new PIXI.Container();
    var confStage = new PIXI.Container();
    var backwall = HEIGHT / 5.1;
    var gobj = null;
    var countermax = 60*1000;
    var counter = countermax;
    var played_air_theme = false;
    var menur = 0.35;
    return {
        mode: "SETUP",
        highscore: 0,
        gameobjects: [],
        gobj: function() { return gobj; },
        resetTimer: function() {
            DATA.get_sound("air").stop();
            counter = countermax;
            played_air_theme = false;
        },
        tickTimer: function() {
            this.score += deltaT * Coworker.num_coworkers;
            this.scoreText.text = "SCORE: " + Math.floor(this.score) + " / " + this.highscore;
            let rel = counter / countermax * 5;
            counter -= deltaT;
            let h = Math.floor(rel);
            let m = Math.floor((rel-h)*60);
            if ( h < 1 && m < 45 && !played_air_theme ) {
                DATA.play_sound("air");
                played_air_theme = true;
            }
            if ( h < 0 ) {
                played_air_theme = false;
                GAME.switch_to(GAME.end, '\nYOU FORGOT TO STAMP YOUR CARD IN TIME!');
                return GAME.clock.setTime(0,0);
            }
            GAME.clock.setTime(h,m);
        },
        regen_gobj: function() {
            gobj.destroy();
            gobj = new PIXI.Graphics();
            gobj.lineStyle(4,0xB2FF58);
            gobj.alpha = 0.9;
            guiStage.addChild(gobj);
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
        headsup: newText("", null, 30, 0xFFFFFF),
        gameVersion: 0,
        getBackY: function() { return backwall; },
        switch_to: function(newMode, xsrd=null) {
            this.gameVersion += 1;
            guiStage.removeChildren();
            Coworker.coworkers = [];
            counter = countermax;
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
                        var start_btn = newText("Start", function(e){GAME.switch_to(GAME.game)}, 46, 0xFFFFFF);
                        var setting_btn = newText("Settings", function(e){GAME.switch_to(GAME.conf)}, 46, 0xFFFFFF);
                        this.menuScore = newText("you don't have a highscore yet", null, 30, 0x666666);
                        explain = newText("try to hide from your coworkers, to 'skip' work\nbut stamp your card before the time runs out\n\n'?' - a coworker can hear you\n'??' - a coworker can smell you\n'!' - a coworker can see you", null, 30, 0x888888);
                        var bg = getTexture("menutitel");
                        bg.width = WIDTH;
                        bg.height = HEIGHT;
                        start_btn.position.set(WIDTH*menur, VCENTER-130);
                        setting_btn.position.set(WIDTH*menur, VCENTER-80);
                        explain.position.set(WIDTH*menur, VCENTER+40);
                        this.menuScore.position.set(WIDTH*menur, VCENTER+140);
                        menuStage.addChild(bg);
                        menuStage.addChild(start_btn);
                        menuStage.addChild(setting_btn);
                        menuStage.addChild(explain);
                        menuStage.addChild(this.menuScore);
                    } else {
                        this.menuScore.text = "your highscore is: " + this.highscore;
                    }
                    DATA.play("menu");
                    KEY.setUpHandler("return", function(e) {
                        GAME.switch_to(GAME.game);
                    });
                    break;
                case this.game:
                    gameStage.removeChildren();
                    guiStage.addChild(this.headsup);
                    this.scoreText = newText("SCORE: 12345", null, 30, 0x333333);
                    this.scoreText.anchor.set(0,1);
                    this.scoreText.position.set(10, HEIGHT-10);
                    this.score = 0;
                    guiStage.addChild(this.scoreText);
                    this.headsup.style.dropShadow = true;
                    this.headsup.style.dropShadowBlur = 10;
                    this.headsup.style.dropShadowDistance = 2;
                    this.headsup.style.fill = 0xFFFFFF;
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
                    this.clock.hours.position.set(rtax(.649), rtay(.075));
                    this.clock.minutes.position.set(rtax(.665), rtay(.075));

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

                    var ticket = getTexture("cardthing");
                    ticket.position.y = backwall + this.scale.y * 10;
                    ticket.position.x = door.position.x - this.scale.x * 80;
                    ticket.notice = function() {
                        GAME.resetTimer();
                    }

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
                    plant1.short_width = 0.3;

                    var plant2 = getTexture("plant");
                    plant2.position.y = VCENTER;
                    plant2.position.x = WIDTH - this.scale.x * 20;
                    plant2.hideable = true;
                    plant2.tall = true;
                    plant2.short_width = 0.3;

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

                    var chair1 = getTexture("chair1");
                    chair1.position.x = rtax(.71);
                    chair1.position.y = rtay(.586);

                    var chair2 = getTexture("chair2");
                    chair2.position.x = rtax(.526);
                    chair2.position.y = rtay(.586);

                    this.gameobjects = [
                        ticket, door, shelf, plant1, plant2,
                        vase, printer, fridge, trash1, trash2, trash3,
                        chair1, chair2
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
                    newTable(.588,.66);
                    newTable(.662,.66);
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
                    let cgv = this.gameVersion;
                    setTimeout(function() {
                        if ( GAME.gameVersion == cgv ) {
                            let b = Coworker.newBoss(13);
                            Coworker.coworkers.push(b);
                            GAME.pushGameObj(b.sprite);
                        }
                    }, Coworker.num_coworkers * 1000 * Coworker.second_between + 2000);
                    this.player = new Player(rtax(.3), rtay(.65));
                    this.player.postfix();
                    this.pushGameObj(this.player.sprite);
                    guiStage.addChild(this.clock.hours);
                    guiStage.addChild(this.clock.minutes);
                    DATA.play("office");
                    break;
                case this.end:
                    if ( this.score > this.highscore ) {
                        this.highscore = Math.floor(this.score);
                    }
                    DATA.get_sound("air").stop();
                    let end_text = newText(
                            "YOU LOST!"+(xsrd?xsrd:'')+"\n[ENTER] to retry",
                            function(e) {
                                GAME.switch_to(GAME.menu);
                            }, 60, 0x000000);
                    end_text.position.set(HCENTER, VCENTER);
                    end_text.style.dropShadow = true;
                    end_text.style.dropShadowColor = 0xFFFFFF;
                    end_text.style.dropShadowBlur = 10;
                    end_text.style.dropShadowDistance = 2;
                    this.getCurrentStage().addChild(end_text);
                    KEY.setUpHandler("return", function(e) {
                        GAME.switch_to(GAME.menu);
                    });
                    break;
                case this.conf:
                    confStage.removeChildren();
                    this.bg = getTexture("menutitel");
                    this.bg.width = WIDTH;
                    this.bg.height = HEIGHT;
                    this.cownb = newText("change number of coworkers",
                            function(e) {
                                Coworker.num_coworkers = parseInt(prompt("number of coworkers:"));
                            }, 46, 0xFFFFFF);
                    this.cownb.position.set(WIDTH*menur, VCENTER);
                    this.back = newText("back",
                            function(e) {
                                GAME.switch_to(GAME.menu);
                            }, 46, 0xFFFFFF);
                    this.back.position.set(WIDTH*menur, VCENTER+100);
                    confStage.addChild(this.bg);
                    confStage.addChild(this.cownb);
                    confStage.addChild(this.back);
                    break;
                default:
                    break;
            }
            stage.addChildAt(this.getStage(newMode),0);

            cons("changed from mode ["+this.mode+"] to ["+newMode+"]");
            this.mode = newMode;
            return true;
        },
        getStage: function(mode) {
            switch (mode) {
                case this.menu:
                    return menuStage;
                case this.end:
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
        conf: "CONFIG",
        end: "END"
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
        POINTS.fromRel(c1-.05, r1), // 0 c1 top
        POINTS.fromRel(c1, r2), // 1 c1 middle
        POINTS.fromRel(c1-.05, r3), // 2 c1 bottom

        POINTS.fromRel(.27, r2+.05), // 3 q1

        POINTS.fromRel(c2, r1), // 4
        POINTS.fromRel(c2, r2), // 5
        POINTS.fromRel(c2, r3), // 6

        POINTS.fromRel(c2+.1, r2+0.05), // 7 q2

        POINTS.fromRel(c3+.05, r1-.01), // 8
        POINTS.fromRel(c3, r2), // 9
        POINTS.fromRel(c3, r3), // 10

        POINTS.fromRel(c3-.12, r2+0.05), // 11 q3

        POINTS.fromRel(.666,.26), // 12 ticket machine
        POINTS.fromRel(.821,.226) // 13 door
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
        [8, 4, 9], // used to go to 12
        [9, 8, 10, 11],
        [10, 9, 6],
        [11, 9],
        [12, 4, 8],
        [8] // 13 == door
    ];
})();
