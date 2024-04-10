import * as THREE from 'three';

class Board extends THREE.Group{
    constructor(radius, materials){
        super();
        
        const offset = 2*Math.PI/(materials.length*6)

        let geometry = new THREE.PlaneGeometry(1,1);
        let plane;
        for(let index = 0;index<materials.length*6;index++){
            plane = new THREE.Mesh( geometry, materials[index%6] );
            plane.position.set(Math.sin(offset*index)*radius, 0, Math.cos(offset*index)*radius);
            plane.rotateY(offset*index);
            plane.rotateX(Math.PI*.5);
            this.add(plane);
        }

        plane = new THREE.Mesh(new THREE.CircleGeometry(radius+1),materials[6]);
        plane.position.set(0,-0.2,0);
        plane.rotateX(Math.PI*.5);
        this.add(plane);
    }
}

export {Board};