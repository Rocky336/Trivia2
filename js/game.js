import {THREE, MODEL, BOARD, TEXT, DICE, PLAYER, HUD, QUIZ} from "./imports.js"

let canvas;
let renderer;
let camera = null;
let clock;

let lookAt;
let target = null;
let quiz = null;

let width,height;
let mouseX = .5,mouseY = .5;

window.addEventListener("DOMContentLoaded",function(){
    width = window.innerWidth, height = window.innerHeight;
    canvas = document.getElementById("gameArea");
    
    renderer = new THREE.WebGLRenderer({antialias: true, canvas: canvas});
    renderer.autoClear = false;
    renderer.setSize(width,height);
    renderer.setClearColor("black", 1);

    camera = new THREE.PerspectiveCamera(50, width/height, 0.1, 500);
    camera.position.set(0,15,20);
    lookAt = new THREE.Vector3(0,0,0);

    let scene = new THREE.Scene();
    scene.background = new THREE.Color(0x7faa22);

    clock = new THREE.Clock();
    
    let board = new BOARD.Board(7,
    [
        new THREE.MeshPhongMaterial ( {color: 0xffff00, side: THREE.DoubleSide} ),
        new THREE.MeshPhongMaterial ( {color: 0xff0000, side: THREE.DoubleSide} ),
        new THREE.MeshPhongMaterial ( {color: 0x0000ff, side: THREE.DoubleSide} ),
        new THREE.MeshPhongMaterial ( {color: 0x00ff00, side: THREE.DoubleSide} ),
        new THREE.MeshPhongMaterial ( {color: 0x00fff0, side: THREE.DoubleSide} ),
        new THREE.MeshPhongMaterial ( {color: 0xA23ff3, side: THREE.DoubleSide} ),
        new THREE.MeshPhongMaterial ( {color: 0x3b3a3a, side: THREE.DoubleSide} )
    ]);
    board.position.set(0,0,0);
    scene.add(board);

    let dice = new DICE.Dice();
    dice.position.set(0,1,0)
    scene.add(dice);

    let hud = new HUD.Hud(camera);
    scene.add(hud);

    let camStat = "NONE";
    let camTimer = 0;

    let ambient = new THREE.AmbientLight(0xffffff,1);
    scene.add(ambient);

    let player = new PLAYER.Player();
    player.position.set(0,0,0);
    scene.add(player)

    dice.generateRandom((number)=>{
        player.move(number, ()=>{
            new QUIZ.Quiz({
                difficulty: 0,
                category: 22,
                camera: camera,
                callback: ()=>{

                },
                build_callback: (text, obj)=>{
                    text.position.set(0,15,-50);
                    scene.add(text);
                    quiz = obj;
                    target = text;
                    camStat = "ANIMATION"
                }
            });

        });
    });

    renderer.setAnimationLoop(()=>{
        let dt = clock.getDelta();
        
        if(camStat == "ANIMATION"){
            camTimer+=dt;
            lookAt.lerp(target.position,camTimer/2);
            if(camTimer>=2) camStat = "NONE";
        }
        
        camera.lookAt(lookAt);
        camera.rotateX(mouseY);
        camera.rotateY(mouseX);
        dice.update(dt);
        player.update(dt);
        hud.update(dt);
        if(quiz!=null) quiz.update(dt);

        renderer.clear();
        renderer.render(scene,camera);
    });
})

window.addEventListener("resize",function(){
    width = window.innerWidth, height = window.innerHeight;
    
    camera.aspect = width/height;
    camera.updateProjectionMatrix();

    renderer.setSize(width,height);
})

window.addEventListener("mousemove",function(event){
    mouseX = 0.5-event.clientX/width, mouseY = 0.5-event.clientY/height;
})

window.addEventListener("mouseup",function(event){
    if(quiz!=null){
        console.log(quiz.select(( event.clientX / window.innerWidth ) * 2 - 1,- ( event.clientY / window.innerHeight ) * 2 + 1));
    }
})