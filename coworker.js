// EVERYTHING NEEDED FOR COWORKERS:


Coworker = (function(){
    var waittime = 3 * 1000;
    var walkspeed = 0.1;
    var coworkers = [];
    function Walker(appear, spawn) {
        this.overhead = newText("", null, 50, 0xFF0000);
        this.overhead.style.dropShadow = true;
        this.overhead.style.dropShadowBlur = 5;
        this.overhead.style.dropShadowDistance = 1;
        this.overhead.style.dropShadowColor = 0;
        guiStage.addChild(this.overhead);
        this.appear = appear;
        this.route = spawn;
        this.target = spawn;
        this.position = pointlist[spawn];
        this.targetPoint = this.position.clone();
        this.deltav = POINTS.new(0,0);
        this.getSpriteOf = function(face, flip=false) {
            let t = getTexture(this.appear + face);
            t.anchor.set(0.5, 1.0);
            if (this.appear == "boss") {
                t.scale.set(GAME.scale.x, GAME.scale.y);
            } else {
                t.scale.set(GAME.scale.x * 0.7, GAME.scale.y * 0.7);
            }
            if (flip) {
                t.scale.x = -1 * t.scale.x;
            }
            return t;
        }
        this.sprites = [
            [this.getSpriteOf("B1"), this.getSpriteOf("B2")],
            [this.getSpriteOf("S1", true), this.getSpriteOf("S2", true)],
            [this.getSpriteOf("F1"), this.getSpriteOf("F2")],
            [this.getSpriteOf("S1"), this.getSpriteOf("S2")]
        ];
        this.sprite = this.sprites[2][0];
        this.updatePosition = function() {
            for ( var i = 0; i < this.sprites.length; i++ ) {
                for ( var j = 0; j < this.sprites[i].length; j++ ) {
                    this.sprites[i][j].position.set( this.position.x, this.position.y );
                }
            }
            this.overhead.position.x = this.position.x;
            this.overhead.position.y = this.position.y - this.sprite.height*1.1;
        };
        this.newTarget = function() {
            if ( this.target == "P" ) {
                let mini = null;
                let mina = null;
                for ( var i = 0; i < pointlist.length; i++ ) {
                    let dist = this.position.dist(pointlist[i]);
                    if (!mina) {
                        mini = i;
                        mina = dist;
                        continue;
                    }
                    if ( dist < mina ) {
                        mini = i;
                        mina = dist;
                    }
                }
                this.route = mini;
                this.target = mini;
                this.targetPoint = pointlist[this.target].clone();
                let diff = this.position.diff(this.targetPoint);
                this.deltav = POINTS.new(
                    diff.x / diff.length() * deltaT * walkspeed,
                    diff.y / diff.length() * deltaT * walkspeed
                );
                return;
            }
            this.route = this.target;
            do {
                this.target = getPossibleNext(this.route);
            } while ( this.appear == "boss" &&  this.route == this.target );
            let split = 10 * GAME.scale.x;
            this.targetPoint = pointlist[this.target].add(
                POINTS.new(
                    (Math.random()-0.5)*split,
                    (Math.random()-0.5)*split
                )
            );
            let diff = this.position.diff(this.targetPoint);
            this.deltav = POINTS.new(
                diff.x / diff.length() * deltaT * walkspeed,
                diff.y / diff.length() * deltaT * walkspeed
            );
        }
        this.waiting = -1;
        this.update = function() {
            this.updatePosition();
            if ( this.position.diff(this.targetPoint).length() < 10 ) {
                if ( this.waiting < 0 ) {
                    this.newTarget();
                    this.waiting = waittime;
                }
            } else {
                this.position = this.position.add(this.deltav);
            }
            this.waiting -= deltaT;
            this.see();
            this.switchSprite();
        };
        this.detectedPlayer = function() {
            this.overhead.text = "!!!";
            GAME.switch_to(GAME.end);
        }
        this.see = function() {
            let pd = this.position.diff(GAME.player.pos);
            let pdl = pd.length();
            let d = this.deltav.dot(pd);
            this.overhead.text = "";
            let f = 1;
            if ( this.appear == "boss" ) {
                f = 1.5;
            }
            if ( d > pdl ) {
                if ( GAME.player.isHiding ) {
                    if ( pdl < rtax(0.05 * f) ) {
                        if ( this.target == "P" ) {
                            // was just(!) following the player
                            // and is close now
                            this.detectedPlayer();
                        } else {
                            // has no clue the player is there,
                            // but is close
                            this.overhead.text = "??";
                        }
                    } else {
                        // to far away to see hidden player
                        this.overhead.text = "";
                    }
                    return;
                }
                if ( pdl < rtax(0.05 * f) ) {
                    // player went up to coworker
                    this.detectedPlayer();
                } else if ( pdl < rtax(0.1 * f) ) {
                    // coworker saw the player
                    this.overhead.text = "!";
                    if (this.target != "P") {
                        DATA.play_sound("notice");
                    }
                    // follow the player
                    this.targetPoint = GAME.player.pos.clone();
                    this.target = "P";
                    let diff = this.position.diff(this.targetPoint);
                    this.deltav = POINTS.new(
                        diff.x / diff.length() * deltaT * walkspeed,
                        diff.y / diff.length() * deltaT * walkspeed
                    );
                } else if ( pdl < rtax(0.15 * f) ) {
                    // hears the player
                    this.overhead.text = "?";
                } else {
                    // no clue
                    this.overhead.text = "";
                }
            }
        };
        this.switchSprite = function() {
            let unit = this.deltav.unit();
            let xp = unit.x;
            let yp = unit.y;
            GAME.getCurrentStage().removeChild(this.sprite);
            if ( Math.abs(yp) < 0.4 ) {
                // use left or right facing sprite
                if ( xp > 0 ) {
                    this.sprite = this.sprites[1][Math.max(Math.floor(this.waiting/waittime*2),0)];
                } else {
                    this.sprite = this.sprites[3][Math.max(Math.floor(this.waiting/waittime*2),0)];
                }
            } else {
                // use up or down facing sprite
                if ( yp > 0 ) {
                    this.sprite = this.sprites[2][Math.max(Math.floor(this.waiting/waittime*2),0)];
                } else {
                    this.sprite = this.sprites[0][Math.max(Math.floor(this.waiting/waittime*2),0)];
                }
            }
            GAME.pushGameObj(this.sprite);
        };
    }

    return {
        coworkers: coworkers,
        num_coworkers: 6,
        second_between: 3,
        generate_coworkers: function(wt) {
            for ( var i = 0; i < this.num_coworkers; i++ ) {
                let current_game_version = GAME.gameVersion;
                let nc = this.new(13);
                setTimeout(function(){
                    if ( GAME.gameVersion == current_game_version ) {
                        GAME.getCurrentStage().addChild(nc.sprite);
                        Coworker.coworkers.push(nc);
                    }
                },i*this.second_between*1000);
            }
        },
        new: function(spawn) {
            return new Walker("coworker", spawn);
        },
        newBoss: function(spawn) {
            return new Walker("boss", spawn);
        }
    }
})();
