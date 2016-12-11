// CONSTS
// look into data.js for image file links


// GLOBALS
var lastTS = null;
var deltaT = 0;

// CALLED AFTER LOADING
DATA.run(setup);
function setup(loader, resources) {
    cons("entered setup");

    GAME.switch_to(GAME.menu);
    gameloop(null);
}

function gameloop(timestamp) {
    if (!lastTS) lastTS = timestamp;
    deltaT = timestamp - lastTS;
    lastTS = timestamp;

    requestAnimationFrame(gameloop); // calles itself 60hz
    handle(); // where all the logic is
    renderer.render(stage); // renders whatever is on stage
}

function handle() {
    switch ( GAME.mode ) {
        case GAME.menu:
            break;
        case GAME.game:
            gameUpdate();
            break;
    }
}

function gameUpdate() {
    let gobj = GAME.regen_gobj();
    GAME.player.update();
    let best = (function(){
        let best = null;
        let min_dist = null;
        for ( var i = 0; i < GAME.gameobjects.length; i++ ) {
            if (!GAME.gameobjects[i].hideable) {
                continue;
            }
            dist = Math.sqrt(
                    Math.pow(GAME.gameobjects[i].position.x - GAME.player.pos.x, 2) +
                    Math.pow(GAME.gameobjects[i].position.y - GAME.player.pos.y, 2)
                    );
            if (!min_dist) {
                best = i;
                min_dist = dist;
            } else if (dist < min_dist) {
                best = i;
                min_dist = dist;
            }
        }
        return {index: best, dist: min_dist};
    })();
    
    if (best.dist < GAME.scale.x*40) {
        let pb = GAME.gameobjects[best.index].position;
        gobj.drawCircle(pb.x, pb.y, 15);
    }

    for ( var i = 0; i < Coworker.coworkers.length; i++ ) {
        Coworker.coworkers[i].update();
    }
}
