// CONSTS
// look into data.js for image file links

// CALLED AFTER LOADING
DATA.run(setup);
function setup(loader, resources) {
    cons("entered setup");

    gameloop();
}

function gameloop() {
    requestAnimationFrame(gameloop); // calles itself 60hz
    handle(); // where all the logic is
    renderer.render(stage); // renders whatever is on stage
}

function handle() {
    switch ( GAME.mode ) {
    case GAME.menu:
        break;
    }
}
