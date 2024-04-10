import * as THREE from 'three'
import {Model} from './model.js'

const offset = 2*Math.PI/(36)

class Player extends THREE.Group{
    constructor(){
        super();

        this.model = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1),new THREE.MeshPhysicalMaterial({color: 0xFF00FF, metalness: 0, roughness: 0.5 }));
        this.add(this.model);
        this.pos = 0;
        this.steps = 0;
        this.model.position.set(0, 0, 7);
        this.status = "NONE"
    }

    move(steps, callback){
        this.steps = steps;
        this.timer = 0;
        this.status = "MOVING"
        this.callback = callback;
    }

    update(dt){
        if(this.steps>0){
            this.timer += dt;
            this.model.position.lerp(new THREE.Vector3(Math.sin(offset*(this.pos+this.timer/1))*7,0, Math.cos(offset*(this.pos+this.timer/1))*7),this.timer/1);
            if(this.timer>=1){
                this.timer = 0;
                this.pos++;
                this.steps--;
            }
        }else if(this.status == "MOVING"){
            this.status = "NONE";
            this.callback();
        }
    }
}

export {Player}