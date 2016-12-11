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
        this.getSpriteOf = function(face, flip=false) {
            let t = getTexture(this.appear + face);
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
            let diff = this.position.diff(pointlist[this.target]);
            this.deltav = POINTS.new(
                diff.x / diff.length * deltaT * walkspeed,
                diff.y / diff.length * deltaT * walkspeed
            );
        }
        this.waiting = waittime;
        this.update = function() {
            this.updatePosition();
            if ( this.position.diff(this.pointlist[this.target]).length < GAME.scale.x * 2 ) {
                if ( this.waittime < 0 ) {
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
        new: function(spawn) {
            return new Walker("coworker", spawn);
        },
        newBoss: function(spawn) {
            return new Walker("boss", spawn);
        }
    }
})();
