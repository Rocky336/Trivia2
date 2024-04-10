import * as THREE from 'three'
import {Text} from './text.js'

class Hud extends THREE.Group{
    constructor(camera){
        super();

        this.text = new Text("3 vite");
        this.add(this.text);
        this.camera = camera;
        this.p = new THREE.Vector3();
    }

    update(dt){
        this.camera.getWorldDirection(this.p);
        this.p.multiplyScalar(10);
        this.p.add(this.camera.position);
        this.p.add(new THREE.Vector3(1,-5,0))
        this.text.position.set(this.p.x,this.p.y,this.p.z);
        this.text.lookAt(this.camera.position);
    }
}

export {Hud}