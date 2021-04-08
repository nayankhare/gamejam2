import Phaser from 'phaser';
var fs = require('browserify-fs');
import backgroundImg from './assets/images/background.png';
import car_objectImg from './assets/images/car_object.png';
import dot_objectImg from './assets/images/dot.png';
import barrier_objectImgHorizontal from './assets/images/barrier.png';
import barrier_objectImgVertical from './assets/images/barrier_vertical.png';

var adjustbtn = document.getElementById("barrier_width_btn");
var inputText = document.getElementById("barrier_width_txtbox");



var game;
var quadrant = -1;
var movableobj;
var SLOWING_FACTOR = 2;
var dot, barrier_obj;
var timer = 0, current_health = 100;
var push_needed = 0;

let infoArray = [];

var topleft_text, coordinate_text, health_text;
var points = 0;

var spawn, spawnbarrier, spawngroupbarrierHor, spawngroupbarrierVer, addToDB;
var groupHorizontal, groupVertical;

var barrierSeperation = 150;


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
        movableobj = this.physics.add.image(100,300, 'object');
        movableobj.setCircle(15, 10, -2.5);
        console.log(movableobj);

        topleft_text = this.add.text(10,10,"0 points",{ fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' } );
        coordinate_text = this.add.text(10, 30, "X: "+movableobj.x.toFixed(2)+"  Y: "+ movableobj.y.toFixed(2),{ fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
        health_text = this.add.text(10, 50, "Health: "+current_health, { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' } );

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
                frameQuantity: 2,
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
            children[0].setPosition(400, 300 - (barrierSeperation/2));
            children[1].setPosition(400, 300+ barrierSeperation/2);

            groupHorizontal.refresh();
        }

        addToDB = () => {
            const dbname = "gamejamdb";
            const dbrequest = window.indexedDB.open(dbname);
            dbrequest.onupgradeneeded = () => {
                let db = dbrequest.result;
                let store = db.createObjectStore("data1", {autoIncrement: true});
                console.log(infoArray.length);
                for(var i = 0; i<infoArray.length; i++) {
                    store.put({TimeStamp: infoArray[i].timeStamp, xCoord: infoArray[i].xCoord, yCoord:infoArray[i].yCoord, collision: infoArray[i].collision});
                }
            
            }
        }

        adjustbtn.addEventListener("click", function() {
            if(!isNaN(inputText.value) && parseInt(inputText.value) > 0) {
                barrierSeperation = parseInt(inputText.value);
                
                console.log(barrierSeperation);
                game.destroy(true,false);
                game = new Phaser.Game(config);
            }
            
        });

        /*spawngroupbarrierVer = (barrier_obj) => {
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
       } */
        
        spawn('collectible');
        spawngroupbarrierHor('barrierHor');
        //spawngroupbarrierVer('barrierVer');
        
        //spawnbarrier('barrier');

        

    }

    


    // update(time, delta) {
    //     if(push_needed == 1) {
    //         push_needed = 0;
    //         addToDB();
    //     }
    //     if(isPredicting) {
    //         timer += delta;
    //         while(timer > 1000) {
    //             timer -=1000;
    //             //current_health -=5;
    //             //health_text.setText("Health: "+ current_health);
                
                

    //         }
    //         this.physics.world.collide(movableobj, groupHorizontal, function() {
    //             //movableobj.setVelocityY(0);
    //             console.log("Collision");
    //             setTimeout(function() {
    //                 points -= 10; 
    //                 topleft_text.setText(points + " points");
    //             }, 1000);
    //             let singleInfo = {
    //                 "timeStamp": Date.now(),
    //                 "xCoord": movableobj.x.toFixed(2),
    //                 "yCoord": movableobj.y.toFixed(2),
    //                 "collision": "1"
    //             }
    //             infoArray.push(singleInfo);
    //             push_needed = 1;
                
    //         });

    //         this.physics.world.collide(movableobj, groupVertical, function() {
    //             console.log("Collision");
    //             //movableobj.setVelocityX(0);
    //             setTimeout(function() {
    //                 points -= 10; 
    //                 topleft_text.setText(points + " points");
    //             }, 1000);
    //         });

    //         // this.physics.world.collide(movableobj, barrier_obj, function () {
    //         //     console.log('hit?');
    //         // });
            
    //         if(distanceX > 0) {
    //             if(distanceY > 0) quadrant = 1;
    //             else quadrant = 4;
    //         } 
    //         else {
    //             if(distanceY > 0) quadrant = 2;
    //             else quadrant = 3;
    //         }
            
    //         var angleindegrees = angle*(180/Math.PI);
            
            
    //         //angle = Math.abs(angle);
        
    //         if(quadrant == 1) {
    //             movableobj.setVelocityX(magnitude/SLOWING_FACTOR*Math.cos(angle));
    //             movableobj.setVelocityY(-magnitude/SLOWING_FACTOR*Math.sin(angle));
    //             // movableobj.x = (movableobj.x + (magnitude/SLOWING_FACTOR)*Math.cos(angle));
    //             // movableobj.y -= (magnitude/SLOWING_FACTOR)*Math.sin(angle);
    //             movableobj.angle = -angleindegrees;
                
                
    //         }
    //         else if(quadrant == 2) {
    //             movableobj.setVelocityX(magnitude/SLOWING_FACTOR*Math.cos(angle));
    //             movableobj.setVelocityY(-magnitude/SLOWING_FACTOR*Math.sin(angle));
    //             // movableobj.x = (movableobj.x + (magnitude/SLOWING_FACTOR)*Math.cos(angle));
    //             // movableobj.y -= (magnitude/SLOWING_FACTOR)*Math.sin(angle);
    //             movableobj.angle = -angleindegrees;
        
    //         }
    //         else if(quadrant == 3) {
    //             movableobj.setVelocityX(magnitude/SLOWING_FACTOR*Math.cos(angle));
    //             movableobj.setVelocityY(-magnitude/SLOWING_FACTOR*Math.sin(angle));
    //             // movableobj.x = (movableobj.x + (magnitude/SLOWING_FACTOR)*Math.cos(angle));
    //             // movableobj.y -= (magnitude/SLOWING_FACTOR)*Math.sin(angle);
    //             movableobj.angle = -angleindegrees;
    //         }
    //         else {
    //             movableobj.setVelocityX(magnitude/SLOWING_FACTOR*Math.cos(angle));
    //             movableobj.setVelocityY(-magnitude/SLOWING_FACTOR*Math.sin(angle));
    //             // movableobj.x = (movableobj.x + (magnitude/SLOWING_FACTOR)*Math.cos(angle));
    //             // movableobj.y -= (magnitude/SLOWING_FACTOR)*Math.sin(angle);
    //             movableobj.angle = -angleindegrees;
    //         }
        
        
    //         if(movableobj.x > 800) {
    //             movableobj.x = 0;
    //         }
    //         else if(movableobj.x < 0) {
    //             movableobj.x = 800;
    //         }
    //         if(movableobj.y > 600) {
    //             movableobj.y = 0;
    //         }
    //         else if(movableobj.y < 0) {
    //             movableobj.y = 600;
    //         }

    //         coordinate_text.setText("X: " + movableobj.x.toFixed(2) + " Y: "+movableobj.y.toFixed(2));
    //         let singleInfo = {
    //             "timeStamp": Date.now(),
    //             "xCoord": movableobj.x.toFixed(2),
    //             "yCoord": movableobj.y.toFixed(2),
    //             "collision": "0"
    //         }
    //         infoArray.push(singleInfo); 
            
            
    //     }
    // }

    update(time, delta) {
        if(push_needed == 1) {
            push_needed = 0;
            addToDB();
        }
        if(isPredicting) {
            timer += delta;
            while(timer > 1000) {
                timer -=1000;
                //current_health -=5;
                //health_text.setText("Health: "+ current_health);
                
                

            }
            this.physics.world.collide(movableobj, groupHorizontal, function() {
                //movableobj.setVelocityY(0);
                console.log("Collision");
                isPredicting = false;
                setTimeout(function() {
                    points -= 10; 
                    topleft_text.setText(points + " points");
                }, 1000);
                let singleInfo = {
                    "timeStamp": Date.now(),
                    "xCoord": movableobj.x.toFixed(2),
                    "yCoord": movableobj.y.toFixed(2),
                    "collision": "1"
                }
                infoArray.push(singleInfo);
                push_needed = 1;
                alert("Game over!");
                location.reload();
                
            });

            this.physics.world.collide(movableobj, groupVertical, function() {
                console.log("Collision");
                //movableobj.setVelocityX(0);
                setTimeout(function() {
                    points -= 10; 
                    topleft_text.setText(points + " points");
                }, 1000);
            });

            // this.physics.world.collide(movableobj, barrier_obj, function () {
            //     console.log('hit?');
            // });
            
            //movableobj.x = normalizedX*800;
            movableobj.x = indexFingerX*800/430+ 1004;
            //movableobj.y = normalizedY*600;
            movableobj.y = indexFingerY*600/220 -463.63;
            coordinate_text.setText("X: " + movableobj.x.toFixed(2) + " Y: "+movableobj.y.toFixed(2));
            let singleInfo = {
                "timeStamp": Date.now(),
                "xCoord": movableobj.x.toFixed(2),
                "yCoord": movableobj.y.toFixed(2),
                "collision": "0"
            }
            infoArray.push(singleInfo); 
            
            
        }
    }


    removeObj(movableobj, dotobj) {
        //  dotgroup.killAndHide(dotobj);
            console.log("Consumed!");
            let singleInfo = {
                "timeStamp": Date.now(),
                "xCoord": movableobj.x.toFixed(2),
                "yCoord": movableobj.y.toFixed(2),
                "collision": "0"
            }
            infoArray.push(singleInfo);
            addToDB();
            points += 10;
            current_health += 15;
            health_text.setText("Health: "+current_health);
            topleft_text.setText(points + " points");
            dotobj.body.enable = false;
            dotobj.destroy();
            spawn('collectible');
    }

    barrier_collision_fn(movableobj, barrierobj) {
            console.log("Collided!");
            points -= 10;
            let singleInfo = {
                "timeStamp": Date.now(),
                "xCoord": movableobj.x.toFixed(2),
                "yCoord": movableobj.y.toFixed(2),
                "collision": "1"
            }
            infoArray.push(singleInfo);
            addtoDB();
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
        //arcade : {
        //    debug: true
        //}
    },
    scene: MyGame
};

game = new Phaser.Game(config);


