import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

/**
 * Simplified model importer, imports from assets/models/
 */
class Model extends THREE.Group{
    constructor(modelName){
        super();
        let loader = new GLTFLoader();
        
        loader.load(`./../assets/models/${modelName}.glb`,(gltf)=>{     //Loads everything
            this.model = gltf.scene;
            this.add(this.model);
            
            this.mixer = new THREE.AnimationMixer(this.model);
            this.animations = gltf.animations;
        });
    }

    /**
     * Starts animation in animations with the given number
     * @param {number} number 
     */
    startAnimation(number){
        this.mixer.clipAction(this.animations[number]).play();
        this.animation = this.animations[number];
    }

    stopAnimation(){
        this.mixer.clipAction(this.animation).stop();
        this.animation = null;
    }

    resetAnimation(){
        this.mixer.clipAction(this.animation).startAt(0);
    }

    /**
     * Updates animation mixer
     * @param {number} dt 
     */
    update(dt){
        if(this.animation) this.mixer.update(dt);
    }
}

export {Model}