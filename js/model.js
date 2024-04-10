import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

class Model extends THREE.Group{
    constructor(modelName){
        super();
        let loader = new GLTFLoader();
        
        loader.load(`./../assets/models/${modelName}.glb`,(gltf)=>{
            this.model = gltf.scene;
            this.add(this.model);
            
            this.mixer = new THREE.AnimationMixer(this.model);
            this.animations = gltf.animations;
        });
    }

    startAnimation(number){
        this.mixer.clipAction(this.animations[number]).play();
    }

    update(dt){
        if(this.animation) this.mixer.update(dt);
    }
}

export {Model}