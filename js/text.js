import * as THREE from 'three';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';

/**
 * Simplified 3D Text
*/
class Text extends THREE.Group{
    /**
     * Creates 3d text group given the text and optionally the params
     * @param {string} text 
     * @param {{ font: string; size: number; depth: number; curveSegments: number; }} [params] 
     */
    constructor(text, params = {
        font: '../assets/fonts/helvetiker_regular.typeface.json',
		size: 1,
		depth: .1,
		curveSegments: 4,
    }){
        super();

        const loader = new FontLoader();        
        loader.load(params.font, (font)=>{      //loads the font
            params.font = font;                 
            const geometry = (new TextGeometry(text,params)).center();      //creates new geometry and sets the pivot to the center of the box
            const textMesh = new THREE.Mesh(geometry);      //Creates the text
            this.add(textMesh);     //Adds the text to the group
        });
    }
}

export {Text};