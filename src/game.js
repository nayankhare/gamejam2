/** @type {import("defs/phaser")} */
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade'    
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
        render: render
    }
};


var game = new Phaser.Game(config);
var movableobj, dot;
var cursors;
var SLOWING_FACTOR = 40;
var quadrant = -1;


function preload ()
{
    this.load.image('object', 'images/car_object.png');
    this.load.image('background', 'images/background.png');
    this.load.image('collectible', 'images/dot.png');
  //  cursors = this.input.keyboard.createCursorKeys();
}

function create ()
{
    this.add.image(400,300,'background');
    movableobj = this.add.sprite(350, 350, 'object');
    //dot = this.add.sprite(300,300, 'collectible');


    movableobj.setScale(0.08);

  /*  collectibles = this.physics.add.group({
        key : 'collectible',
        repeat : 0,
        setXY : {x: 300, y :300},
        setScale : {x:0.02, y: 0.02}
    });  */

   // this.physics.add.overlap(movableobj, collectibles, onOverlapFunction, null, this);


    
}

function onOverlapFunction(movableobj, collectibleItem) {

    // What happens on Overlap of Object and collectible item
    collectibleItem.disableBody(true,true);
}

function update() {
    
    if(distanceX > 0) {
        if(distanceY > 0) quadrant = 1;
        else quadrant = 4;
    } 
    else {
        if(distanceY > 0) quadrant = 2;
        else quadrant = 3;
    }
    
    var angleindegrees = angle*(180/Math.PI);
    
    
    //angle = Math.abs(angle);

    if(quadrant == 1) {
        movableobj.x = (movableobj.x + (magnitude/SLOWING_FACTOR)*Math.cos(angle));
        movableobj.y -= (magnitude/SLOWING_FACTOR)*Math.sin(angle);
        movableobj.angle = -angleindegrees;
        
        
    }
    else if(quadrant == 2) {
        movableobj.x = (movableobj.x + (magnitude/SLOWING_FACTOR)*Math.cos(angle));
        movableobj.y -= (magnitude/SLOWING_FACTOR)*Math.sin(angle);
        movableobj.angle = -angleindegrees;

    }
    else if(quadrant == 3) {
        movableobj.x = (movableobj.x + (magnitude/SLOWING_FACTOR)*Math.cos(angle));
        movableobj.y -= (magnitude/SLOWING_FACTOR)*Math.sin(angle);
        movableobj.angle = -angleindegrees;
    }
    else {
        movableobj.x = (movableobj.x + (magnitude/SLOWING_FACTOR)*Math.cos(angle));
        movableobj.y -= (magnitude/SLOWING_FACTOR)*Math.sin(angle);
        movableobj.angle = -angleindegrees;
    }


    if(movableobj.x > 800) {
        movableobj.x = 0;
    }
    else if(movableobj.x < 0) {
        movableobj.x = 800;
    }
    if(movableobj.y > 600) {
        movableobj.y = 0;
    }
    else if(movableobj.y < 0) {
        movableobj.y = 600;
    }

    
    /*if (cursors.left.isDown) {
        movableobj.x -= magnitude/SLOWING_FACTOR;
    }
    else if (cursors.right.isDown) {
        movableobj.x += magnitude/SLOWING_FACTOR;
    }

    if (cursors.up.isDown){
        movableobj.y -= magnitude/SLOWING_FACTOR;
    }
    else if (cursors.down.isDown) {
        movableobj.y += magnitude/SLOWING_FACTOR;
    }*/

}

function render() {
    this.debug.spriteInfo(movableobj, 20, 32);

}