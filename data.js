// IMAGES TO LOAD INTO PIXI
// AND MUSIC WITH HOWLER
var IMAGES = [];
var MUSICS = [];
var SOUNDS = [];
var DATA = (function() {
    var prefix = "resources/";
    var music_prefix = "music/";
    var sounds_prefix = "sounds/";
    var extentions = ["B1", "B2", "F1", "F2", "S1", "S2"];
    return {
        add: function(img, name) {
            IMAGES[IMAGES.length]=[img,name];
        },
        add_simple: function(sname) {
            this.add(sname+".png", sname);
        },
        add_folder: function(sname) {
            for (var i = 0; i < extentions.length; i++) {
                this.add(sname+"/"+sname+extentions[i]+".png", sname+extentions[i]);
            }
        },
        add_music: function(file, name) {
            MUSICS[name] = new Howl({
                src: [music_prefix+file+'.ogg', music_prefix+file+'.mp3'],
                loop: true,
                volume: 0.4
            });
        },
        add_sound: function(file, name) {
            SOUNDS[name] = new Howl({
                src: [sounds_prefix+file+'.ogg', sounds_prefix+file+'.mp3'],
                volume: 0.4
            })
        },
        get_sound: function(name) {
            return SOUNDS[name]
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
                loader.add(IMAGES[i][1], prefix + IMAGES[i][0]);
            }
            loader.load(callback);
        }
    };
})();

DATA.add_simple("bg");
DATA.add_simple("cardthing");
DATA.add_simple("fridge");
DATA.add_simple("printer");
DATA.add_simple("tabelH");
DATA.add_simple("tabelV");
DATA.add_simple("trashcan");
DATA.add_simple("wallH");
DATA.add_simple("wallV");
DATA.add_simple("bossdoor");
DATA.add_simple("example");
DATA.add_simple("plant");
DATA.add_simple("shelf");
DATA.add_simple("vase");

DATA.add_folder("coworker");
DATA.add_folder("hero");

DATA.add_music("TheOfficeMain", "office");
DATA.add_music("Boss_Theme", "boss");
DATA.add_music("Menu_Theme", "menu");

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
