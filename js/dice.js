import * as THREE from 'three'
import {Model} from './model.js'


//Possible dice orientations
const orientations = [
    [0,0],
    [0,Math.PI*.5],
    [Math.PI*.5,0],
    [Math.PI*1.5,0],
    [0,Math.PI*1.5],
    [Math.PI,0],
]

/**
 * Dice
 */
class Dice extends THREE.Group{
    /**
     * Creates new Dice
     */
    constructor(){
        super();
        //Uses the model "dice2.glb"
        this.model = new Model('dice2');
        this.model.scale.set(50,50,50)
        this.add(this.model);
        this.status = "NONE";
    }

    /**
     * Updates dice animations
     * @param {number} dt 
     */
    update(dt){
        if(this.status=="FREEFALL"){    //if it's freefalling
            this.speed += 9.8*dt;       //Accelerate
            if(this.model.position.y<.5&&!this.ignorefloor){    //If it hits the floor
                if(this.speed<1){       //It's either too slow, so it stops
                    this.status = "NONE";
                    this.speed = 0;
                    this.rotatespeed = 0;
                    this.model.rotation.setFromVector3(this.finalRotation);
                    this.callback(this.landOn+1);   //Calls back
                }else{                  //Or it's gotta bounce back up
                    this.status = "BOUNCING";
                    this.speed = -this.speed*.3;    //0.3 coefficient of restitution
                    this.rotatespeed = -this.rotatespeed;   //Rotates the other way
                }
            }
        }else if(this.status=="BOUNCING"){      //If it bounces it has to go back down
            this.speed += 9.8*dt;
            if(this.speed>=0) this.status = "FREEFALL";
        }
        this.model.position.y -= this.speed*dt;
        this.model.rotateX(this.rotatespeed*dt);
        this.model.rotateY(this.rotatespeed*dt);
        this.model.rotateZ(this.rotatespeed*dt);
    }

    /**
     * Generates random number and callsback once the animation has finished
     * @param {function} callback 
     */
    generateRandom(callback){
        this.landOn = Math.round(Math.random()*5);
        this.status = "FREEFALL";
        this.speed = 0;
        this.model.position.y = 40
        this.finalRotation = new THREE.Vector3(orientations[this.landOn][0],0,orientations[this.landOn][1]);
        this.model.rotation.setFromVector3(this.finalRotation);
        this.rotatespeed = Math.PI*3/4;
        this.callback = callback;
        this.ignorefloor = false;
    }

    /**
     * Makes the dice fall under the board
     */
    hide(){
        this.ignorefloor = true;
        this.status = "FREEFALL";
        setTimeout(()=>{
            this.status = "NONE";
            this.model.position.y = 40
            this.speed = 0;
        },1000);
    }
}

export {Dice}