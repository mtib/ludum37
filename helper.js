function cons( str ) {
    console.log( str );
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

            KEYS[keyCode] = key;
        },
        isUp: function(key) {
            return KEYS[key].isUp;
        },
        isDown: function(key) {
            return KEYS[key].isDown;
        }
    };
    window.addEventListener("keydown", function() {
        let key = KEYS[event.keyCode];
        if (key) {
            key.isDown = true;
            key.isUp = false;
        }
        event.preventDefault();
    }, false);
    window.addEventListener("keyup", function() {
        let key = KEYS[event.keyCode];
        if (key) {
            if (key.keyUp) key.keyUp();
            key.isUp = true;
            key.isDown = false;
        }
        event.preventDefault();
    }, false);

    return obj;
})();
