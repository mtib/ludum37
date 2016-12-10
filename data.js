// IMAGES TO LOAD INTO PIXI
// AND MUSIC WITH HOWLER
var IMAGES = [];
var MUSICS = [];
var DATA = (function() {
    var prefix = "resources/";
    var music_prefix = "music/";
    return {
        add: function(img, name) {
            IMAGES[IMAGES.length]=[img,name];
        },
        add_music: function(file, name) {
            MUSICS[name] = new Howl({
                src: [music_prefix+file+'.mp3', music_prefix+file+'.ogg'],
                loop: true,
                volume: 0.4
            });
        },
        play: function(name) {
            MUSICS[name].play();
        },
        stop: function(name) {
            MUSICS[name].stop();
        },
        stop_all: function() {
            for (var song in MUSICS) {
                MUSICS[song].stop();
            }
        },
        run: function(callback) {
            let loader = PIXI.loader;
            for ( let i = 0; i < IMAGES.length; i++ ){
                loader = loader.add(prefix + IMAGES[i][0], IMAGES[i][1]);
            }
            loader.load(callback);
        }
    };
})();

DATA.add("office.png", "office");

DATA.add_music("TheOfficeMain", "office");