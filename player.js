function Player(x, y) {
    this.pos = POINTS.fromAbs(x, y);
    this.oob = function() {
        let px = 10 * GAME.scale.x;
        let py = 5 * GAME.scale.y;
        return (this.pos.x < px) || (this.pos.x > WIDTH-px) || (this.pos.y < GAME.getBackY()+py) || (this.pos.y > HEIGHT-py);
    }

    this.isHiding = false;

    KEY.setUpHandler("space", function() {
        if (this.isHiding) {
            GAME.getCurrentStage().addChild(this.sprite);
            stage.removeChild(this.blend);
            delete this.blend;
            this.isHiding = false;
        }else if (GAME.canHide) {
            this.blend = getTexture("blend");
            this.blend.anchor.set(0.5,0.5);
            this.blend.scale = GAME.scale;
            this.blend.position.set(GAME.hidePos.x, GAME.hidePos.y-GAME.scale.y*20);
            stage.addChild(this.blend);
            GAME.getCurrentStage().removeChild(this.sprite);
            this.isHiding = true;
        }
    }.bind(this));

    this.sprite = getTexture("heroF1");
    this.speed = .1;
    this.persfac = .8;

    getPlayer = function(fname) {
        let t = getTexture(fname);
        let scalefactor = 0.8;
        t.scale.set(scalefactor * GAME.scale.x, scalefactor * GAME.scale.y);
        t.anchor.set(0.5,1);
        return t;
    }

    this.downSprites = [
        getPlayer("heroF1"), getPlayer("heroF2")
    ];
    this.sideSprites = [
        getPlayer("heroS1"), getPlayer("heroS2")
    ];
    this.upSprites = [
        getPlayer("heroB1"), getPlayer("heroB2")
    ];

    this.allSprites = [
        this.upSprites,
        this.sideSprites,
        this.downSprites,
    ];

    this.postfix = function() {
        let scalefactor = 0.8;
        this.sprite.scale.set(scalefactor * GAME.scale.x, scalefactor * GAME.scale.y);
        this.sprite.anchor.set(0.5,1);
    }

    this.show = this.downSprites;
    this.currentindex = 0;
    let animmax = 20;
    this.animstate = animmax;
    this.currentface = 2;

    this.flip = function(undo = false) {
        if (undo) {
            for (var i = 0; i < this.show.length; i++) {
                this.show[i].scale.x = Math.abs(this.show[i].scale.x);
            }
        } else {
            for (var i = 0; i < this.show.length; i++) {
                this.show[i].scale.x = -1 * Math.abs(this.show[i].scale.x);
            }
        }
    }

    this.switch_sprite_array = function(to) {
        GAME.getCurrentStage().removeChild(this.sprite);
        switch (to) {
            case 0:
                this.show = this.upSprites;
                break;
            case 1:
                this.show = this.sideSprites;
                break;
            case 2:
                this.show = this.downSprites;
                break;
            case 3:
                this.show = this.sideSprites;
                break;
        }
        this.sprite = this.show[this.currentindex];

        if (to == 1) {
            this.flip(false);
        } else {
            this.flip(true);
        }
        GAME.pushGameObj(this.sprite);
        this.currentface = to;
    }

    this.gbb = function(goi) {
        let g = new PIXI.Graphics();
        g.lineStyle(5, 0x00FF00);
        g.drawRect(goi.position.x-goi.width/2, goi.position.y-goi.height, goi.width, goi.height);
        GAME.getCurrentStage().addChild(g);
        setTimeout(function(){GAME.getCurrentStage().removeChild(g);},30);
    }

    this.draw_colls = function() {
        let g = new PIXI.Graphics();
        g.lineStyle(2, 0x999999);
        g.drawRect(this.pos.x-this.sprite.width/2, this.pos.y-this.sprite.height, this.sprite.width, this.sprite.height);
        g.lineStyle(5, 0x0000FF);
        g.drawCircle(this.pos.x, this.pos.y, 10);
        GAME.getCurrentStage().addChild(g);
    }

    this.update = function() {
        this.sprite.position.set(this.pos.x, this.pos.y);
        if (!this.isHiding) { // Don't move when hiding
            let n = -1;
            let pos_before = this.pos.clone();
            if (KEY.isDown("a")) {
                this.pos.x -= deltaT * this.speed * GAME.scale.x;
                this.animstate -= 1;
                n = 3;
            } else if (KEY.isDown("d")) {
                this.pos.x += deltaT * this.speed * GAME.scale.x;
                this.animstate -= 1;
                n = 1;
            }
            let did_a_bad = false;
            for ( var i = 0; i < GAME.gameobjects.length; i++ ) {
                if (person_is_colliding_bb(this, GAME.gameobjects[i])) {
                    did_a_bad = true;
                    // this.gbb(GAME.gameobjects[i]);
                    // this.draw_colls();
                    break;
                }
            }
            if (did_a_bad || this.oob()) {
                this.pos = pos_before.clone();
            } else {
                pos_before = this.pos.clone();
            }
            if (KEY.isDown("w")) {
                this.pos.y -= deltaT * this.speed * this.persfac * GAME.scale.y;
                this.animstate -= 1;
                n = 0;
            } else if (KEY.isDown("s")) {
                this.pos.y += deltaT * this.speed * this.persfac * GAME.scale.y;
                this.animstate -= 1;
                n = 2;
            }
            did_a_bad = false;
            for ( var i = 0; i < GAME.gameobjects.length; i++ ) {
                if (person_is_colliding_bb(this, GAME.gameobjects[i])) {
                    did_a_bad = true;
                    break;
                }
            }
            if (did_a_bad || this.oob()) {
                this.pos = pos_before.clone();
            }
            if ( n >= 0 && n != this.currentface ) {
                this.switch_sprite_array(n);
            }
        }
        if ( this.animstate < 0 ) {
            GAME.getCurrentStage().removeChild(this.sprite);
            this.animstate = animmax;
            this.currentindex = (this.currentindex + 1) % this.show.length;
            this.sprite = this.show[this.currentindex];
            GAME.pushGameObj(this.sprite);
        }
        for ( var i = 0; i < this.allSprites.length; i++ ) {
            for ( var j = 0; j < this.allSprites[i].length; j++) {
                this.allSprites[i][j].position.set(this.pos.x, this.pos.y);
            }
        }
    }
}

// checks whether hard coded points of interest of the
// person lie within the bounding box
let show_colls = false;
function person_is_colliding_bb(person, bbobj) {
    let np = (GAME.scale.x + GAME.scale.y)/2 * 7;
    let bx = bbobj.position.x;
    let by = bbobj.position.y;
    let px = person.pos.x;
    let py = person.pos.y;
    let bh = bbobj.height;
    if ( bbobj.tall ) {
        bh = bh/2;
    }
    let bw = bbobj.width/2;
    if ( bbobj.short_width ) {
        bw = bw * bbobj.short_width;
    }
    let val = (bx + bw > px - np*2) && (bx - bw < px + np*2) && (by - bh < py) && (by > py - np);
    if (show_colls && val) {
        let g = new PIXI.Graphics();
        g.lineStyle(3, 0x00FF00);
        g.drawCircle(bx,by,10);
        GAME.getCurrentStage().addChild(g);
    }
    return val;
    /*
     * +-----+ ^
     * |     | |
     * |     | h
     * |     | |
     * +--b--+ v
     * <--w-->
     *
     */
}
