import Phaser from 'phaser';
var fs = require('browserify-fs');
import backgroundImg from './assets/background.png';
import car_objectImg from './assets/car_object.png';
import dot_objectImg from './assets/dot.png';
import barrier_objectImg from './assets/barrier.png';

var quadrant = -1;
var movableobj;
var SLOWING_FACTOR = 40;
var dot, barrier_obj;

var topleft_text, coordinate_text;
var points = 0;

var spawn, spawnbarrier;

class MyGame extends Phaser.Scene {

    constructor () {
        super();
    }

    preload () {
        this.load.image('object', car_objectImg);
        this.load.image('background', backgroundImg);
        this.load.image('collectible', dot_objectImg);
        this.load.image('barrier', barrier_objectImg);
    }
      
    create () {
        this.add.image(400,300,'background');
        movableobj = this.physics.add.image(350,350, 'object');
        console.log(movableobj);

        topleft_text = this.add.text(10,10,"0 points",{ fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' } );
        coordinate_text = this.add.text(10, 30, "X: 350 Y: 350",{ fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });


        spawn = (spawnobjectname) => {
            dot = this.physics.add.sprite(Phaser.Math.Between(50, 750),Phaser.Math.Between(50, 550),spawnobjectname);
            this.physics.add.overlap(movableobj, dot, this.removeObj);
        } 

        spawnbarrier = (barrierobject) => {
            barrier_obj = this.physics.add.sprite(Phaser.Math.Between(50, 750),Phaser.Math.Between(50, 550),barrierobject);
            this.physics.add.collider(movableobj, barrier_obj, this.barrier_collision_fn );
            barrier_obj.setScale(0.1);
        }

        spawn('collectible');
        spawnbarrier('barrier');

    }

    


    update() {
        
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

        coordinate_text.setText("X: " + movableobj.x.toFixed(2) + " Y: "+movableobj.y.toFixed(2));
    }

    removeObj(movableobj, dotobj) {
        //  dotgroup.killAndHide(dotobj);
            console.log("Consumed!");
            points += 10;
            topleft_text.setText(points + " points");
            dotobj.body.enable = false;
            dotobj.destroy();
            spawn('collectible');
    }

    barrier_collision_fn(movableobj, barrierobj) {
            console.log("Collided!");
            points -= 10;
            topleft_text.setText(points + " points");
    }

    render() {
        
    }
}


const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade'    
    },
    scene: MyGame
};

const game = new Phaser.Game(config);
