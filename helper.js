function cons( str ) {
    console.log( str );
}

function getRandomInt(min, max) {
    return Math.floor(Math.floor(Math.random() * (max - min)) + min);
}

var KEYS = [];
var KEY = (function() {
    let obj = {
        add: function(name, keyCode) {
            let key = {};
            key.isDown = false;
            key.keyUp = null;

            KEY[name] = keyCode;
            KEYS[keyCode] = key;
        },
        setUpHandler: function(key, upHandler) {
            KEYS[this[key]].keyUp = upHandler;
        },
        isUp: function(key) {
            return !KEYS[KEY[key]].isDown;
        },
        isDown: function(key) {
            return KEYS[KEY[key]].isDown;
        }
    };
    window.addEventListener("keydown", function(e) {
        let key = KEYS[e.keyCode];
        if (key) {
            key.isDown = true;
            e.preventDefault();
        }
    }, false);
    window.addEventListener("keyup", function(e) {
        let key = KEYS[e.keyCode];
        if (key) {
            if (key.keyUp) key.keyUp();
            key.isDown = false;
            e.preventDefault();
        }
    }, false);

    return obj;
})();
// Define keys
KEY.add("w", 87);
KEY.add("a", 65);
KEY.add("s", 83);
KEY.add("d", 68);
KEY.add("up", 38);
KEY.add("down", 40);
KEY.add("right", 39);
KEY.add("left", 37);
KEY.add("e", 69);
KEY.add("space", 32);
KEY.add("return", 13);

function newText( text, callback=null, size=24, fill=0x000000, font="VT323") {
    let tmp = new PIXI.Text(text, {fontFamily: font, fontSize: size, fill: fill, align: "center"});
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
        this.add = function(p2) {
            return new Point(this.x + p2.x, this.y + p2.y);
        }
        this.clone = function() {
            return new Point(this.x, this.y);
        }
        this.unit = function(l=1) {
            let x = this.x / this.length() * l;
            let y = this.y / this.length() * l;
            return new Point(x, y);
        }
        this.dot = function(p2) {
            return this.x * p2.x + this.y * p2.y;
        }
        this.mult = function(fact) {
            this.x *= fact;
            this.y *= fact;
            return this;
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
        },
        new: function(x, y) {
            return new Point(x,y);
        },
        dot: function(p1, p2) {
            return p1.dot(p2);
        },
        fromPIXI: function(pp) {
            return new Point(pp.x, pp.y);
        }
    }
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
