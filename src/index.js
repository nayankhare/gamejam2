import Phaser from 'phaser';
var fs = require('browserify-fs');
import backgroundImg from './assets/images/background.png';
import car_objectImg from './assets/images/car_object.png';
import dot_objectImg from './assets/images/dot.png';
import barrier_objectImgHorizontal from './assets/images/barrier.png';
import barrier_objectImgVertical from './assets/images/barrier_vertical.png';

var quadrant = -1;
var movableobj;
var SLOWING_FACTOR = 2;
var dot, barrier_obj;

var topleft_text, coordinate_text;
var points = 0;

var spawn, spawnbarrier, spawngroupbarrierHor, spawngroupbarrierVer;
var groupHorizontal, groupVertical;

class MyGame extends Phaser.Scene {

    constructor () {
        super();
    }

    preload () {
        this.load.image('object', car_objectImg);
        this.load.image('background', backgroundImg);
        this.load.image('collectible', dot_objectImg);
        this.load.image('barrierHor', barrier_objectImgHorizontal);
        this.load.image('barrierVer', barrier_objectImgVertical);
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
            barrier_obj = this.physics.add.image(Phaser.Math.Between(50, 750),Phaser.Math.Between(50, 550),barrierobject).setImmovable().setBounce(0);
            //this.physics.add.collider(movableobj, barrier_obj, this.barrier_collision_fn );
        }

        spawngroupbarrierHor = (barrier_obj) => {
             groupHorizontal = this.physics.add.staticGroup({
                key: barrier_obj,
                frameQuantity: 4,
                immovable:true,
            });

            var children = groupHorizontal.getChildren();

            for(var i = 0; i<children.length; i++) {
                var x = Phaser.Math.Between(50, 750);
                var y = Phaser.Math.Between(50, 550);
                //var anglebarrier = Phaser.Math.Between(-Math.PI, Math.PI);

                children[i].setPosition(x,y);
                //children[i].rotation = anglebarrier;
                
            }

            groupHorizontal.refresh();
        }

        spawngroupbarrierVer = (barrier_obj) => {
            groupVertical = this.physics.add.staticGroup({
               key: barrier_obj,
               frameQuantity: 4,
               immovable:true,
           });

           var children = groupVertical.getChildren();

           for(var i = 0; i<children.length; i++) {
               var x = Phaser.Math.Between(50, 750);
               var y = Phaser.Math.Between(50, 550);
               //var anglebarrier = Phaser.Math.Between(-Math.PI, Math.PI);

               children[i].setPosition(x,y);
               //children[i].rotation = anglebarrier;
               
           }

           groupVertical.refresh();
       }
        
        spawn('collectible');
        spawngroupbarrierHor('barrierHor');
        spawngroupbarrierVer('barrierVer');
        
        //spawnbarrier('barrier');

        

    }

    


    update() {
        this.physics.world.collide(movableobj, groupHorizontal, function() {
            console.log("Collision");
            setTimeout(function() {
                points -= 10; 
                topleft_text.setText(points + " points");
            }, 1000);
        });

        this.physics.world.collide(movableobj, groupVertical, function() {
            console.log("Collision");
            setTimeout(function() {
                points -= 10; 
                topleft_text.setText(points + " points");
            }, 1000);
        });

        // this.physics.world.collide(movableobj, barrier_obj, function () {
        //     console.log('hit?');
        // });
        
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
            movableobj.setVelocityX(magnitude/SLOWING_FACTOR*Math.cos(angle));
            movableobj.setVelocityY(-magnitude/SLOWING_FACTOR*Math.sin(angle));
            // movableobj.x = (movableobj.x + (magnitude/SLOWING_FACTOR)*Math.cos(angle));
            // movableobj.y -= (magnitude/SLOWING_FACTOR)*Math.sin(angle);
            movableobj.angle = -angleindegrees;
            
            
        }
        else if(quadrant == 2) {
            movableobj.setVelocityX(magnitude/SLOWING_FACTOR*Math.cos(angle));
            movableobj.setVelocityY(-magnitude/SLOWING_FACTOR*Math.sin(angle));
            // movableobj.x = (movableobj.x + (magnitude/SLOWING_FACTOR)*Math.cos(angle));
            // movableobj.y -= (magnitude/SLOWING_FACTOR)*Math.sin(angle);
            movableobj.angle = -angleindegrees;
    
        }
        else if(quadrant == 3) {
            movableobj.setVelocityX(magnitude/SLOWING_FACTOR*Math.cos(angle));
            movableobj.setVelocityY(-magnitude/SLOWING_FACTOR*Math.sin(angle));
            // movableobj.x = (movableobj.x + (magnitude/SLOWING_FACTOR)*Math.cos(angle));
            // movableobj.y -= (magnitude/SLOWING_FACTOR)*Math.sin(angle);
            movableobj.angle = -angleindegrees;
        }
        else {
            movableobj.setVelocityX(magnitude/SLOWING_FACTOR*Math.cos(angle));
            movableobj.setVelocityY(-magnitude/SLOWING_FACTOR*Math.sin(angle));
            // movableobj.x = (movableobj.x + (magnitude/SLOWING_FACTOR)*Math.cos(angle));
            // movableobj.y -= (magnitude/SLOWING_FACTOR)*Math.sin(angle);
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
        default: 'arcade',
        // arcade : {
        //     debug: true
        // }
    },
    scene: MyGame
};

const game = new Phaser.Game(config);
