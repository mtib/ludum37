// HIDING OBJECTS INTERFACE:
// - hide(dt: float)
// - enter(p: Player) 
// - health: int
// - exit()
// - destroy()

// EXAMPLE
function Vase() {
    player = null;
    health = 20; // seconds
    // called every animation frame
    hide = function(dt) {
        health -= dt/1000.0;
    }
    enter = function(p) {
        player = p;
    }
    exit = function() {
        // puts player where he entered
    }
    destroy = function() {
        // put player at position of object
        // delete object
    }
}

function ObjectType( Mhealth, Mimgname ) {
    // TODO make this a closure that works!
    return function() {
        // TODO load image routine
        player = null;
        health = Mhealth; // seconds
        // called every animation frame
        hide = function(dt) {
            health -= dt/1000.0;
        }
        enter = function(p) {
            player = p;
        }
        exit = function() {
            // puts player where he entered
        }
        destroy = function() {
            // put player at position of object
            // delete object
        }
    }
}
