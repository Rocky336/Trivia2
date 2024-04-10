import * as THREE from "three";
import { Text } from "./text.js";

class Quiz{
    constructor(params = {
        difficulty: Math.round(Math.random()*2),
        category: 22,
        callback: ()=>{console.log("Hello World!")}
    }){
        this.difficulty = params.difficulty;
        this.category = params.category;
        this.callback = params.callback;
        this.question = null;
        //
        fetch(`https://opentdb.com/api.php?amount=1&category=${params.category}&difficulty=${params.difficulty}`).then((response)=>{
            response.json().then((data)=>{
                this.question = data.results[0];
                this.answer = this.question.correct_answer;
                this.answers =  [...[this.question.correct_answer].concat(this.question.incorrect_answers)];
                let currentIndex = this.answers.length,  randomIndex;
                while (currentIndex != 0) {
                    randomIndex = Math.floor(Math.random() * currentIndex);
                    currentIndex--;
                    [this.answers[currentIndex], this.answers[randomIndex]] = [this.answers[randomIndex], this.answers[currentIndex]];
                }

                this.text = new THREE.Group();
                this.temp_text = new Text(this.question.question);
                this.temp_text.position.set(0,5,0);
                this.text.add(this.temp_text);

                for(let i = 0;i<this.answers.length;i++){
                    this.temp_text = new Text(this.answers[i]);
                    this.temp_text.position.set((i%2)*5,i<2?2:0,0);
                    this.text.add(this.temp_text);
                }

                this.temp_text = new THREE.Mesh(new THREE.PlaneGeometry(100,10),new THREE.MeshBasicMaterial({color: 0x000000}));
                this.temp_text.position.set(0,2,-1);
                this.text.add(this.temp_text);

                params.build_callback(this.text, this);
            })
        })

        this.camera = params.camera;
        this.p = new THREE.Vector3();
    }

    select(mouseX, mouseY){
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(mouseX,mouseY),this.camera);
        const intersect = raycaster.intersectObjects(this.text.children)[0].point;
        intersect.sub(this.text.position);
        if(intersect.x<3){
            if(intersect.y<1) return this.answer==this.answers[2];
            return this.answer==this.answers[0];
        }else{
            if(intersect.y<1) return this.answer==this.answers[3];
            return this.answer==this.answers[1];
        }
    }

    update(dt){
        
    }
}

export {Quiz}