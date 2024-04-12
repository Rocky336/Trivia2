import * as THREE from 'three'
import {Text} from './text.js'

/**
 * Manager for the HUD
 */
class Hud extends THREE.Group{
    /**
     * Creates new HUD object
     * @param {THREE.Camera} camera 
     */
    constructor(camera){
        super();

        this.squares = 0;
        this.text = new Text("INIT");
        this.add(this.text);
        this.camera = camera;
        this.p = new THREE.Vector3();
    }

    /**
     * Updates the text with the current number of lives
     * @param {number} lives 
     */
    updateLives(lives){
        this.remove(this.text);
        this.text = new Text(lives+" vite")
        this.add(this.text);
    }

    /**
     * Adds a new square to the hud with the given color
     * @param {number} color
     */
    updateSquares(color){
        this.square = new THREE.Mesh(new THREE.PlaneGeometry(1,1),new THREE.MeshBasicMaterial({color: color}));
        this.square.position.set(1-this.squares,-2,0);
        this.add(this.square);
        this.squares++;
    }

    /**
     * Updates the HUD position
     * @param {number} dt 
     */
    update(dt){
        this.camera.getWorldDirection(this.p);
        this.p.multiplyScalar(10);
        this.p.add(this.camera.position);
        this.p.add(new THREE.Vector3(1,-5,0))
        this.position.set(this.p.x,this.p.y,this.p.z);
        this.lookAt(this.camera.position);
    }
}

export {Hud}