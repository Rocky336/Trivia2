import * as THREE from 'three'
import {Model} from './model.js'

const orientations = [
    [0,0],
    [0,Math.PI*.5],
    [Math.PI*.5,0],
    [Math.PI*1.5,0],
    [0,Math.PI*1.5],
    [Math.PI,0],
]

class Dice extends THREE.Group{
    constructor(){
        super();

        this.model = new Model('dice2');
        this.model.scale.set(50,50,50)
        this.add(this.model);
        this.status = "NONE";
    }

    update(dt){
        if(this.status=="FREEFALL"){
            this.speed += 9.8*dt;
            if(this.model.position.y<.5){
                if(this.speed<1){
                    this.status = "NONE";
                    this.speed = 0;
                    this.rotatespeed = 0;
                    this.model.rotation.setFromVector3(this.finalRotation);
                    this.callback(this.landOn);
                }else{
                    this.status = "BOUNCING";
                    this.speed = -this.speed*.3;
                    this.rotatespeed = -this.rotatespeed;
                }
            }
        }else if(this.status=="BOUNCING"){
            this.speed += 9.8*dt;
            if(this.speed>=0) this.status = "FREEFALL";
        }
        this.model.position.y -= this.speed*dt;
        this.model.rotateX(this.rotatespeed*dt);
        this.model.rotateY(this.rotatespeed*dt);
        this.model.rotateZ(this.rotatespeed*dt);
    }

    generateRandom(callback){
        this.landOn = Math.round(Math.random()*6);
        this.status = "FREEFALL";
        this.speed = 0;
        this.model.position.y = 40
        this.finalRotation = new THREE.Vector3(orientations[this.landOn-1][0],0,orientations[this.landOn-1][1]);
        this.model.rotation.setFromVector3(this.finalRotation);
        this.rotatespeed = Math.PI*3/4;
        this.callback = callback;
    }
}

export {Dice}