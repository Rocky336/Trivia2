import {THREE, MODEL, BOARD, TEXT, DICE, PLAYER, HUD, QUIZ, BILLBOARD} from "./imports.js" //imports everything useful

let canvas;
let renderer;
let camera = null;
let clock;

let quiz = null;

let width,height;
let mouseX = 0,mouseY = 0;        //Initial mouse position, (0,0) as looking at world V3(0,0,0)

let lives = 3;      //Number of lives
let squares = [false,false,false,false,false,false];    //Needed to check if player has a medal for every subject
let mats = [        //The 6+1 Materials (6 for the planes, 1 for the board plate)
    new THREE.MeshPhongMaterial ( {color: 0xffff00, side: THREE.DoubleSide} ),
    new THREE.MeshPhongMaterial ( {color: 0xff0000, side: THREE.DoubleSide} ),
    new THREE.MeshPhongMaterial ( {color: 0x0000ff, side: THREE.DoubleSide} ),
    new THREE.MeshPhongMaterial ( {color: 0x00ff00, side: THREE.DoubleSide} ),
    new THREE.MeshPhongMaterial ( {color: 0x00fff0, side: THREE.DoubleSide} ),
    new THREE.MeshPhongMaterial ( {color: 0xA23ff3, side: THREE.DoubleSide} ),
    new THREE.MeshPhongMaterial ( {color: 0x3b3a3a, side: THREE.DoubleSide} )
]
const subjects = [   //The 6 categories corrisponding to the colors
    25,23,19,22,9,17
];

window.addEventListener("DOMContentLoaded",function(){
    width = window.innerWidth, height = window.innerHeight;
    canvas = document.getElementById("gameArea");
    
    renderer = new THREE.WebGLRenderer({antialias: true, canvas: canvas});  //Creates renderer
    renderer.autoClear = false;
    renderer.setSize(width,height);
    renderer.setClearColor("black", 1);

    camera = new THREE.PerspectiveCamera(50, width/height, 0.1, 500);       //Creates camera
    camera.position.set(0,15,20);

    let lookAt = new THREE.Vector3(0,0,0);      //LookAt and target init to V3(0,0,0)
    let target = lookAt;

    let scene = new THREE.Scene();              //Creates new scene
    scene.background = new THREE.Color(0x7faa22);   

    clock = new THREE.Clock();                  //Creates new clock
    
    let board = new BOARD.Board(7,mats);        //Creates new board with radius 7
    board.position.set(0,0,0);
    scene.add(board);

    let dice = new DICE.Dice();                 //Creates new dice
    dice.position.set(0,1,0)
    scene.add(dice);

    let hud = new HUD.Hud(camera);              //Creates new HUD
    hud.updateLives(lives);
    scene.add(hud);

    let billboard = new BILLBOARD.Billboard(camera);    //Creates new billboard
    scene.add(billboard);

    let ambient = new THREE.AmbientLight(0xffffff,1);   //Ambient light
    scene.add(ambient);

    let player = new PLAYER.Player();               //Creates new player
    player.position.set(0,0,0);
    scene.add(player);
    
    let camStat = "NONE";
    let camTimer = 0;

    let gameStat = "WAIT";
    billboard.changeStat(gameStat);     //Change billboard to WAIT status

    renderer.setAnimationLoop(()=>{
        let dt = clock.getDelta();
        
        if(camStat == "ANIMATION"){     //If camera is animating
            camTimer+=dt;               //time since the start of the animation
            lookAt.lerp(target.position,camTimer/2);        //lerp the lookAt of the camera
            if(camTimer>=2) camStat = "NONE";               //A camera animation lasts 2 seconds
        }
        
        camera.lookAt(lookAt);      //Looks at lookAt
        camera.rotateX(mouseY);     //Rotates with mouse
        camera.rotateY(mouseX);
        dice.update(dt);            //Updates dice
        player.update(dt);          //Updates player
        hud.update(dt);             //Updates hud
        billboard.update(dt);       //Updates billboard
        if(quiz!=null) quiz.update(dt);     //If the quiz exists the quiz is updated

        renderer.clear();
        renderer.render(scene,camera);
    });
    
    window.addEventListener("resize",function(){
        //If window is resized the camera and the renderer dimensions are changed
        width = window.innerWidth, height = window.innerHeight;
        
        camera.aspect = width/height;
        camera.updateProjectionMatrix();

        renderer.setSize(width,height);
    })

    window.addEventListener("mousemove",function(event){    //When the mouse is moved
        //Updates mouse position relative to world V3(0,0,0)
        mouseX = 0.5-event.clientX/width, mouseY = 0.5-event.clientY/height;
    })

    window.addEventListener("mouseup",function(event){  //When the mouse is clicked
        if(gameStat=="QUESTION"){           //If it's during quiz
            //If player doesn't get the answer
            if(!quiz.select(( event.clientX / window.innerWidth ) * 2 - 1,- ( event.clientY / window.innerHeight ) * 2 + 1)){
                player.model.startAnimation(1);
                //Lives and hud are updated
                lives--;
                hud.updateLives(lives);
                //If player has no more lives it enters in a LOSE status
                if(lives==0) gameStat="LOSE";

            }else{ // If player gets it right
                player.model.startAnimation(2);
                //Squares are updated
                squares[player.pos%6] = true;
                hud.updateSquares(mats[player.pos%6].color);
                
                //Checks if player has won
                let won = true;
                for(let i = 0; i<squares.length&&won;i++)
                    if(!squares[i]) won = false;
                if(won) gameStat = "WIN";
            };

            //After 1 second
            setTimeout(()=>{
                //The quetion is removed
                scene.remove(quiz.text);
                quiz = null;        //To clean it up
                target = {position: new THREE.Vector3(0,0,0)};  //Animation to the center
                camTimer = 0;
                camStat = "ANIMATION";

                if(gameStat!="LOSE"&&gameStat!="WIN") gameStat = "WAIT";    //If player can continue it goes back to WAIT status
                if(gameStat=="WIN") player.skyrocket();
                billboard.changeStat(gameStat);
            },1000);

        }else if(gameStat=="WAIT"){     //If it's during the wait phase
            player.model.stopAnimation();
            gameStat = "ROLLMOVE";      //Change state
            billboard.changeStat(gameStat); //Make billboard text change

            dice.generateRandom((number)=>{     //Generate random number with callback
                billboard.changeStat(number);   //Once called back the billboard is changed with the rolled number and the player is moved

                player.move(number, ()=>{       //Moves the player n steps with a callback
                    dice.hide();        //Make dice fall out of the scene
                    gameStat="QUESTION";        //Once it has finished moving it goes into QUESTION status

                    new QUIZ.Quiz({             //Creates new quiz object
                        difficulty: Math.round(Math.random()*2),        //Random difficulty
                        category: subjects[player.pos%6],               //Player position category
                        camera: camera,                                 //Camera

                        build_callback: (text, obj)=>{                  //Callback for when the question is loaded
                            text.position.set(0,15,-50);                //Position at which the text is set
                            scene.add(text);                    
                            quiz = obj;                                 //Once loaded it assigns itself to quiz
                            target = text;                              //Animate to the question text
                            camTimer = 0;
                            camStat = "ANIMATION"
                        }
                    });
                    
                });
            });
        }
    })
})
