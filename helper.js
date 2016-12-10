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
        a: 65, d: 68, s: 83, w: 87,
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
