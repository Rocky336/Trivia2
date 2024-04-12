import * as THREE from 'three'
import {Model} from './model.js'

const offset = Math.PI/18

class Player extends THREE.Group{

    /**
     * Creates new player object at position V3(0,1,7)
     */
    constructor(){
        super();

        //this.model = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1),new THREE.MeshPhysicalMaterial({color: 0xFF00FF, metalness: 0, roughness: 0.5 }));
        this.model = new Model("Walking");
        this.add(this.model);
        this.pos = 0;
        this.steps = 0;
        this.model.position.set(0, 0, 7);
        this.status = "NONE"
    }

    /**
     * Tells the player to move
     * @param {number} steps
     * @param {function} callback
     */
    move(steps, callback){
        this.steps = steps;
        this.timer = 0;
        this.status = "MOVING"
        this.callback = callback;
        this.model.startAnimation(0);
    }

    /**
     * Updates player
     * @param {number} dt 
     */
    update(dt){
        if(this.steps>0){                   //If it has steps to do
            this.timer += dt;               //Increments local step timer
            this.model.update(dt);
            this.model.lookAt(new THREE.Vector3(0,this.model.position.y,0))
            this.model.rotateY(-Math.PI*.5);
            this.model.position.lerp(new THREE.Vector3(Math.sin(offset*(this.pos+this.timer/1))*7,this.model.position.y, Math.cos(offset*(this.pos+this.timer/1))*7),this.timer/1);     //lerps in 1 second
            if(this.timer>=1){              //After 1 sec it finishes, so the position is incremented and the steps are reduced
                this.timer = 0;
                this.pos++;
                this.steps--;
            }
        }else if(this.status == "MOVING"){      //No more steps, calls callback function
            this.status = "NONE";
            this.model.stopAnimation();
            this.callback();
        }else if(this.status == "SKYROCKET"){
            this.model.position.y+=2*dt;
            this.model.rotateY(Math.PI*.5*dt);
        }else
            this.model.position.set(Math.sin(offset*this.pos)*7,this.model.position.y, Math.cos(offset*this.pos)*7);
    }

    /**
     * Skyrocket the player
     */

    skyrocket(){
        this.status = "SKYROCKET";
    }
}

export {Player}