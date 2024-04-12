import * as THREE from "three";
import { Text } from "./text.js";

/**
 * 
 * @param {string[]} array 
 * @returns Max length between strings
 */
function maxLength(array){
    let max = 5;
    for(let i = 0;i<array.length;i++)
        if(array[i].length>max) max = array[i].length;
    return max;
}

const difficulties = ["easy","medium","hard"]

/**
 * Manages the current given question
 */
class Quiz{
    /**
     * 
     * @param {difficulty: number, category: number} [params] 
     */
    constructor(params = {
        difficulty: Math.round(Math.random()*2), //Random generated difficulty
        category: 22,                           //Category 22
    }){
        this.question = null;
        this.maxTime = 10;      //Max time to answer
        //Fetch to the API with the category and the difficulty
        fetch(`https://opentdb.com/api.php?amount=1&category=${params.category}&difficulty=${difficulties[params.difficulty]}`).then((response)=>{
            response.json().then((data)=>{
                this.question = data.results[0];
                this.answer = this.question.correct_answer;
                this.answers =  [...[this.question.correct_answer].concat(this.question.incorrect_answers)];

                //Array mixing
                let currentIndex = this.answers.length,  randomIndex;
                while (currentIndex != 0) {
                    randomIndex = Math.floor(Math.random() * currentIndex);
                    currentIndex--;
                    [this.answers[currentIndex], this.answers[randomIndex]] = [this.answers[randomIndex], this.answers[currentIndex]];
                }

                //Creation of the group and header for the question
                this.text = new THREE.Group();
                this.temp_text = new Text(this.question.question); // header
                this.temp_text.position.set(0,5,0);
                this.text.add(this.temp_text);
                let space = maxLength(this.answers);

                //Creation of the text of the answers, properly spaced, adds ray detection plane to check if answer is right
                for(let i = 0;i<this.answers.length;i++){
                    this.temp_text = new Text(this.answers[i]);
                    this.temp_text.position.set(-space*(i%2)+space*.5,i<2?2:0,0);
                    this.text.add(this.temp_text);
                    if(this.answer == this.answers[i]) {
                        this.correct = new THREE.Mesh(new THREE.PlaneGeometry(space,1),new THREE.MeshBasicMaterial({color: 0xFF0000}));
                        this.correct.position.set(this.temp_text.position.x,this.temp_text.position.y,this.temp_text.position.z-2);
                        this.text.add(this.correct);
                    }
                }
                
                //Background plane
                this.temp_text = new THREE.Mesh(new THREE.PlaneGeometry(100,10),new THREE.MeshBasicMaterial({color: 0x000000}));
                this.temp_text.position.set(0,2,-1);
                this.text.add(this.temp_text);

                //Time bar
                this.bar = new THREE.Mesh(new THREE.PlaneGeometry(80,1),new THREE.MeshBasicMaterial({color: 0x00FF00}));
                this.bar.position.set(0,-2,0);
                this.text.add(this.bar);
                console.log(this.answer);
                params.build_callback(this.text, this);
            })
        })

        this.camera = params.camera;
        this.p = new THREE.Vector3();
        this.time = 0;
        this.over = false;
    }

    /**
     * When mouse is clicked an answer is selected
     * @param {number} mouseX 
     * @param {number} mouseY 
     * @returns 
     */
    select(mouseX, mouseY){
        this.over = true;
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(mouseX,mouseY),this.camera);
        let intersect = raycaster.intersectObjects([this.correct]);//Intersection with the "correct" plane
        if(intersect.length==0||this.time>=this.maxTime){   //If there are no intersections the answer is wrong
            //Creates red plane
            this.temp_text = new THREE.Mesh(new THREE.PlaneGeometry(100,10),new THREE.MeshBasicMaterial({color: 0xFF0000}));
            this.temp_text.position.set(0,2,1);
            this.text.add(this.temp_text);
            return false;
        }
        //Creates green plane
        this.temp_text = new THREE.Mesh(new THREE.PlaneGeometry(100,10),new THREE.MeshBasicMaterial({color: 0x00FF00}));
        this.temp_text.position.set(0,2,1);
        this.text.add(this.temp_text);
        return true;
    }

    /**
     * Updates time bar
     * @param {number} dt 
     */
    update(dt){
        this.time+=dt;
        if(this.time<this.maxTime&&!this.over) this.bar.scale.set((this.maxTime-this.time)/this.maxTime,1);
    }
}

export {Quiz}