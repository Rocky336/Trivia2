import * as THREE from 'three';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';

class Text extends THREE.Group{
    constructor(text, params = {
        font: '../assets/fonts/helvetiker_regular.typeface.json',
		size: 1,
		depth: .1,
		curveSegments: 4,
    }){
        super();

        const loader = new FontLoader();
        loader.load(params.font, (font)=>{
            params.font = font;
            const geometry = (new TextGeometry(text,params)).center();
            const textMesh = new THREE.Mesh(geometry);
            this.add(textMesh);
        });
    }
}

export {Text};