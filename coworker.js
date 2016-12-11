// EVERYTHING NEEDED FOR COWORKERS:


Coworker = (function(){
    var waittime = 3 * 1000;
    var walkspeed = 0.1;
    var coworkers = [];
    function Walker(appear, spawn) {
        this.appear = appear;
        this.route = spawn;
        this.target = spawn;
        this.position = pointlist[spawn];
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
            [this.getSpriteOf("S1"), this.getSpriteOf("S2")],
            [this.getSpriteOf("F1"), this.getSpriteOf("F2")],
            [this.getSpriteOf("S1", true), this.getSpriteOf("S2", true)]
        ];
        this.sprite = this.sprites[2][0];
        this.updatePosition = function() {
            for ( var i = 0; i < this.sprites.length; i++ ) {
                for ( var j = 0; j < this.sprites[i].length; j++ ) {
                    this.sprites[i][j].position.set( this.position.x, this.position.y );
                }
            }
        };
        this.newTarget = function() {
            this.route = this.target;
            this.target = getPossibleNext(this.route);
            let split = 10 * GAME.scale.x;
            let diff = this.position.diff(pointlist[this.target].add(POINTS.new((Math.random()-0.5)*10, (Math.random()-0.5)*10)));
            this.deltav = POINTS.new(
                diff.x / diff.length() * deltaT * walkspeed,
                diff.y / diff.length() * deltaT * walkspeed
            );
        }
        this.waiting = -1;
        this.update = function() {
            this.updatePosition();
            if ( this.position.diff(pointlist[this.target]).length() < 10 ) {
                if ( this.waiting < 0 ) {
                    this.newTarget();
                    this.waiting = waittime;
                }
            } else {
                this.position = this.position.add(this.deltav);
            }
            this.waiting -= deltaT;
        };
    }

    return {
        coworkers: coworkers,
        num_coworkers: 10,
        generate_coworkers: function(wt) {
            for ( var i = 0; i < this.num_coworkers; i++ ) {
                let nc = this.new(13);
                setTimeout(function(){
                    GAME.getCurrentStage().addChild(nc.sprite);
                    Coworker.coworkers.push(nc);
                },i*3000);
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
