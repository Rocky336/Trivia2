import * as THREE from 'three'
import {Text} from './text.js'

/**
 * Manages the billboard sign on top of the board
 */
class Billboard extends THREE.Group{

    /**
     * Creates a new billboard at V3(0,5,0)
     * @param {THREE.Camera} camera 
     */
    constructor(camera){
        super();

        this.text = new Text("INIT");
        this.add(this.text);
        this.position.y = 5;
        this.camera = camera;
    }

    /**
     * Looks at the camera
     */
    update(){
        this.lookAt(this.camera.position);
    }

    /**
     * Changes the text given the game status
     * @param {string} status 
     */
    changeStat(status){
        let result = "";
        switch(status){
            case "WAIT":
                result = "WAITING FOR DICE";
                break;
            case "ROLLMOVE":
                result = "...";
                break;
            case "WIN":
                result = "GOOD JOB U WON!";
                break;
            case "WIN":
                result = "GO STUDY DONKEY";
                break;
            default:
                result += status;
                break;

        }
        this.remove(this.text);
        this.text = new Text(result)
        this.add(this.text);
    }
}

export {Billboard}