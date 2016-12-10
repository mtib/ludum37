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
    for ( var i = 0; i < GAME.gameobjects.length; i++ ) {
        // TODO check interaction
    }
    GAME.player.update();
}
