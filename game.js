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
            if (!GAME.gameobjects[i].hideable && !GAME.gameobjects[i].notice) {
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

    GAME.headsup.text = "";
    if (best.dist < GAME.scale.x*40) {
        if (!GAME.player.isHiding && GAME.gameobjects[best.index].hideable) {
            let pb = GAME.gameobjects[best.index].position;
            // gobj.drawCircle(pb.x, pb.y, 15);
            GAME.canHide = true;
            GAME.hidePos = pb;
            GAME.headsup.text = "[space]\nto hide";
            GAME.headsup.position = POINTS.new(pb.x, pb.y - GAME.gameobjects[best.index].height/2);
        } else {
            // ?
        }
    } else {
        GAME.canHide = false;
        delete GAME.hidePos;
    }

    if (GAME.gameobjects[best.index].notice){
        GAME.gameobjects[best.index].notice();
    }

    for ( var i = 0; i < Coworker.coworkers.length; i++ ) {
        Coworker.coworkers[i].update();
    }

    for ( var i = 1; i < GAME.getCurrentStage().children.length - 1; i++ ) {
        let obj1 = GAME.getCurrentStage().getChildAt(i);
        let obj2 = GAME.getCurrentStage().getChildAt(i+1);
        if ( obj1.position.y > obj2.position.y ) {
            GAME.getCurrentStage().removeChild(obj2);
            GAME.getCurrentStage().addChildAt(obj2, i);
        }
    }
    GAME.tickTimer();
}
