/* jshint esversion: 6 */

// CALLED BEFORE GAME, AFTER DATA/HELPER
var WIDTH = 1280;
var HEIGHT = 720;

var VCENTER = HEIGHT/2;
var HCENTER = WIDTH/2;

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
        add_hidable: function(sname) {
            this.add_simple(sname);
            this.add_simple(sname+'X');
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
            });
        },
        get_sound: function(name) {
            return SOUNDS[name];
        },
        play_sound: function(name) {
            SOUNDS[name].play();
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
        },
        getTexture: function(texture_name) {
            return getTexture(texture_name);
        }
    };
})();

DATA.add_simple("bg");
DATA.add_simple("cardthing");
DATA.add_simple("trashcan");
DATA.add_simple("wallH");
DATA.add_simple("wallV");
DATA.add_simple("bossdoor");
DATA.add_simple("example");
DATA.add_simple("blend");
DATA.add_simple("menutitel");
DATA.add_simple("chair1");
DATA.add_simple("chair2");

DATA.add_hidable("printer");
DATA.add_hidable("shelf");
DATA.add_hidable("fridge");
DATA.add_hidable("tabelH");
DATA.add_hidable("tabelV");
DATA.add_hidable("vase");
DATA.add_hidable("plant");

DATA.add_folder("coworker");
DATA.add_folder("boss");
DATA.add_folder("hero");

DATA.add_music("TheOfficeMain", "office");
DATA.add_music("Boss_Theme", "boss");
DATA.add_music("Menu_Theme", "menu");

DATA.add_sound("NeedAir", "air");
DATA.add_sound("explosion", "explosion");
DATA.add_sound("notice", "notice");

