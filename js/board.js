import * as THREE from 'three';

class Board extends THREE.Group{
    /**
     * 
     * @param {number} radius 
     * @param {THREE.MeshPhongMaterial[]} materials
     */
    constructor(radius, materials){
        super();
        
        const offset = Math.PI/18;      //2*PI/(6*6), distance between each plane

        //adds planes
        let geometry = new THREE.PlaneGeometry(1,1);
        let plane;
        for(let index = 0;index<materials.length*6;index++){
            plane = new THREE.Mesh( geometry, materials[index%6] );
            plane.position.set(Math.sin(offset*index)*radius, 0, Math.cos(offset*index)*radius);
            plane.rotateY(offset*index);
            plane.rotateX(Math.PI*.5);
            this.add(plane);
        }

        //Adds base
        plane = new THREE.Mesh(new THREE.CircleGeometry(radius+1),materials[6]);
        plane.position.set(0,-0.2,0);
        plane.rotateX(Math.PI*.5);
        this.add(plane);
    }
}

export {Board};