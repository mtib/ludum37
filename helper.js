function cons( str ) {
    console.log( str );
}

function getRandomInt(min, max) {
    return Math.floor(Math.floor(Math.random() * (max - min)) + min);
}

var KEYS = [];
var KEY = (function() {
    let obj = {
        left: 37, up: 38, right: 39, down: 40,
        a: 65, d: 68, s: 83, w: 87, e: 69,
        add: function(keycode, keyUp) {
            let key = {};
            key.isDown = false;
            key.isUp = true;
            key.keyUp = keyUp;

            KEYS[keycode] = key;
        },
        isUp: function(key) {
            return KEYS[key].isUp;
        },
        isDown: function(key) {
            return KEYS[key].isDown;
        }
    };
    window.addEventListener("keydown", function(e) {
        let key = KEYS[e.keyCode];
        if (key) {
            key.isDown = true;
            key.isUp = false;
            e.preventDefault();
        }
    }, false);
    window.addEventListener("keyup", function(e) {
        let key = KEYS[e.keyCode];
        if (key) {
            if (key.keyUp) key.keyUp();
            key.isUp = true;
            key.isDown = false;
            e.preventDefault();
        }
    }, false);

    return obj;
})();

// Define keys
KEY.add(KEY.w);
KEY.add(KEY.a);
KEY.add(KEY.s);
KEY.add(KEY.d);
KEY.add(KEY.up);
KEY.add(KEY.down);
KEY.add(KEY.right);
KEY.add(KEY.left);
KEY.add(KEY.e);

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
    cons(name);
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
