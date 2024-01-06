'use strict';

const SCREEN_WIDTH = 1500;
const SCREEN_HEIGHT = 800;
const CHARACTER_WIDTH = 125;
const CHARACTER_HEIGHT = 125;
const CHARACTER_EDGE_DIFFERENCE = 40;
//CHARACTER: 1: Boxer 2: Caveman 3: Knight 4: Soldier
const CHARACTER = 1;
const LANE1 = 50 + CHARACTER_HEIGHT;
const LANE2 = LANE1 + CHARACTER_HEIGHT;
const LANE3 = LANE1 + CHARACTER_HEIGHT*2;
const LANE4 = LANE1 + CHARACTER_HEIGHT*3;
const LANE5 = LANE1 + CHARACTER_HEIGHT*4;

var canvas;
var ctx;

var paused = false;
var gameOver = false;
var character;
var score = 0;
var oldTimeStamp = 0;
var counter = 0;
var road;
var clouds;
var robots = [];
var effects = [];
var imagesReady = false;
var loaded = false;

document.addEventListener("keyup", event => {
    if(event.key === "Escape"){
        if(paused == false) paused = true;
        else{
            paused = false;
        }
        console.log("paused " + paused);
    }
    if(event.key === "a"){ 
        if(character.phase != 3 && character.shield > 0){
            character.changePhase(3);
            character.shield --;
        }
    }
    if(event.key === "d"){
        if(character.phase == 0){
            character.changePhase(1);
        }
    }
    if(event.key === "f"){
        if(character.phase == 0){
            character.changePhase(2);
        }
     }
    if(event.key === "w"){
        if(character.phase == 0 && character.lane > 1){
            character.lane -= 1;
        }
    }
    if(event.key === "s"){
        if(character.phase == 0 && character.lane < 5){
            character.lane += 1;
        }
    }
});


class Character{
    constructor(health, shield, picture){
        this.lane = 1;
        this.left = 0;
        //this.top = LANE1 - Math.floor(CHARACTER_HEIGHT/3);
        this.width = CHARACTER_WIDTH;
        this.height = CHARACTER_HEIGHT;
        this.sizeRatio = 1;
        this.positionRatio = 1;
        this.animationCounter = 0;
        //this.animationTotalCount = 0;
        this.counterRecord = 0;
        this.lastFrame = 0;
        this.health = health;
        this.shield = shield;
        //this.image = new Image(CHARACTER_WIDTH, CHARACTER_HEIGHT);
        //this.image = document.getElementById(picture);
        this.image = picture;
        //this.image = new Image(24000, 2000);
        //this.image.onload = function(){};
        //this.image.src = picture;
        this.spriteFrameCount = 0;
        this.spriteFrames = [];
        //Phase: 0 is running, 1 is 1st attack, 2 is 2nd attack, 3 is defending, 4 is hurting
        this.phase;
        this.changePhase(0);
        //damaging means when Character's attack is dealing damage
        this.damaging = false;
        
    }
    changePhase(phase){
        this.phase = phase;
        if(this.phase == 4 && this.health == 0) endGame();
        this.animationCounter = 0;
        if(CHARACTER == 1){
            if(this.phase == 0){
                this.spriteFrames = [0, 1000, 2000];
                this.sizeRatio = 1;
            }else if(this.phase == 1){
                this.spriteFrames = [3000, 4000, 5000, 6000];
                this.spriteFrameCount = 0;
                this.sizeRatio = 1;
            }else if(this.phase == 2){
                this.spriteFrames = [7000, 9000, 11000];
                this.spriteFrameCount = 0;
                this.sizeRatio = 2;
            }else if(this.phase == 3){
                this.spriteFrames = [13000];
                this.spriteFrameCount = 0;
                this.sizeRatio = 1;
            }else if(this.phase == 4){
                this.spriteFrames = [15000];
                this.spriteFrameCount = 0;
                this.sizeRatio = 1;
            }
        }else if(CHARACTER == 2){ 
            if(this.phase == 0){
                this.spriteFrames = [0, 1000, 2000];
                this.sizeRatio = 1;
                this.positionRatio = 1;
            }else if(this.phase == 1){
                this.spriteFrames = [3000, 5000, 7000, 9000];
                this.spriteFrameCount = 0;
                this.sizeRatio = 2;
                this.positionRatio = 2;
            }else if(this.phase == 2){
                this.spriteFrames = [11000, 13000, 15000, 17000, 19000];
                this.spriteFrameCount = 0;
                this.sizeRatio = 2;
                this.positionRatio = 1.5;
            }else if(this.phase == 3){
                this.spriteFrames = [21000];
                this.spriteFrameCount = 0;
                this.sizeRatio = 1;
                this.positionRatio = 1;
            }else if(this.phase == 4){
                this.spriteFrames = [23000];
                this.spriteFrameCount = 0;
                this.sizeRatio = 1;
                this.positionRatio = 1;
            }
        }else if(CHARACTER == 3){
            if(this.phase == 0){
                this.spriteFrames = [0, 1000, 2000];
                this.sizeRatio = 1;
                this.positionRatio = 1;
            }else if(this.phase == 1){
                this.spriteFrames = [3000, 5000, 7000, 9000];
                this.spriteFrameCount = 0;
                this.sizeRatio = 2;
                this.positionRatio = 1;
            }else if(this.phase == 2){
                this.spriteFrames = [11000, 13000, 15000, 17000];
                this.spriteFrameCount = 0;
                this.sizeRatio = 2;
                this.positionRatio = 2;
            }else if(this.phase == 3){
                this.spriteFrames = [19000];
                this.spriteFrameCount = 0;
                this.sizeRatio = 1;
                this.positionRatio = 1;
            }else if(this.phase == 4){
                this.spriteFrames = [21000];
                this.spriteFrameCount = 0;
                this.sizeRatio = 1;
                this.positionRatio = 1;
            }
        }else if(CHARACTER == 4){ 
            if(this.phase == 0){
                this.spriteFrames = [0, 1000, 2000];
            }else if(this.phase == 1){
                this.spriteFrames = [9000, 10000, 0, 6000];
                //this.spriteFrames = [3000, 4000, 5000, 6000, 0, 9000, 10000];
                this.spriteFrameCount = 0;
            }else if(this.phase == 2){
                this.spriteFrames = [7000, 8000];
                this.spriteFrameCount = 0;
            }else if(this.phase == 3){
                this.spriteFrames = [9000];
                this.spriteFrameCount = 0;
            }else if(this.phase == 4){
                this.spriteFrames = [11000];
                this.spriteFrameCount = 0;
            }
        }
    }
    changeFrame(){
        //Running
        if(this.phase == 0){
            if(counter <= 75) this.spriteFrameCount = 0;
            else if(counter <= 150) this.spriteFrameCount = 1;
            else if(counter <= 425) this.spriteFrameCount = 2;
            else if(counter <= 500) this.spriteFrameCount = 1;
            else if(counter <= 575) this.spriteFrameCount = 0;
            else if(counter <= 650) this.spriteFrameCount = 1;
            else if(counter <= 925) this.spriteFrameCount = 2;
            else if(counter <= 1000) this.spriteFrameCount = 1;
        }
        if(CHARACTER == 1){
            //1st Attack
            if(this.phase == 1){
                if(this.animationCounter <= 150) this.spriteFrameCount = 0;
                else if(this.animationCounter <= 200){
                    this.spriteFrameCount = 2;
                    this.damaging = true;
                }else if(this.animationCounter <= 250){
                    this.spriteFrameCount = 3;
                }else if(this.animationCounter <= 300){
                    this.spriteFrameCount = 2;
                }else if(this.animationCounter <= 350){
                    this.spriteFrameCount = 1;
                }else if(this.animationCounter <= 400){
                    this.spriteFrameCount = 2;
                }else if(this.animationCounter < 450){
                    this.spriteFrameCount = 3;
                }else if(this.animationCounter <= 500){
                    this.spriteFrameCount = 2;
                }else if(this.animationCounter <= 550){
                    this.spriteFrameCount = 1;
                }else if(this.animationCounter <= 600){
                    this.spriteFrameCount = 0;
                    this.damaging = false;
                }else if(this.animationCounter > 750){
                    this.animationCounter = 0;
                    this.changePhase(0);
                }
            }
            //2nd Attack
            if(this.phase == 2){
                if(this.animationCounter <= 100) this.spriteFrameCount = 0;
                else if(this.animationCounter <= 200){
                    this.spriteFrameCount = 1;
                    this.damaging = true;
                }else if(this.animationCounter <= 500){
                    this.spriteFrameCount = 2;
                    this.damaging = false;
                }else if(this.animationCounter > 500){
                    this.spriteFrameCount = 0;
                    this.animationCounter = 0;
                    this.changePhase(0);
                }
            }
        }else if(CHARACTER == 2){
            //1st Attack
            if(this.phase == 1){
                if(this.animationCounter <= 200){
                    this.spriteFrameCount = 0;
                }else if(this.animationCounter <= 300){
                    this.spriteFrameCount = 1;
                }else if(this.animationCounter <= 600){
                    this.spriteFrameCount = 2;
                    this.damaging = true;
                }else if(this.animationCounter <= 800){
                    this.spriteFrameCount = 3;
                    this.damaging = false;
                }else if(this.animationCounter <= 900){
                    this.spriteFrameCount = 1;
                }else if(this.animationCounter >= 1000){
                    this.animationCounter = 0;
                    this.changePhase(0);
                }
            }
            //2nd Attack
            if(this.phase == 2){
                //make this attack 1000 x 1000 later
                if(this.animationCounter <= 200) this.spriteFrameCount = 0;
                else if(this.animationCounter <= 400){
                    this.spriteFrameCount = 1;
                    this.damaging = true;
                }else if(this.animationCounter <= 600){
                    this.spriteFrameCount = 2;
                }else if(this.animationCounter <= 800){
                    this.spriteFrameCount = 3;
                }else if(this.animationCounter <= 900){
                    this.spriteFrameCount = 4;
                    this.damaging = false;
                }else if(this.animationCounter >= 1000){
                    this.animationCounter = 0;
                    this.changePhase(0);
                }
            }
        }else if(CHARACTER == 3){
            //1st Attack
            if(this.phase == 1){
                if(this.animationCounter <= 150){
                    this.spriteFrameCount = 0;
                }else if(this.animationCounter <= 350){
                    this.spriteFrameCount = 1;
                }else if(this.animationCounter <= 600){
                    this.spriteFrameCount = 2;
                    this.damaging = true;
                }else if(this.animationCounter < 1000){
                    this.spriteFrameCount = 3;
                    this.damaging = false;
                }else if(this.animationCounter >= 1000){
                    this.animationCounter = 0;
                    this.changePhase(0);
                }
            }
            //2nd Attack
            if(this.phase == 2){
                if(this.animationCounter <= 300){
                    this.spriteFrameCount = 0;
                }else if(this.animationCounter <= 500){
                    this.spriteFrameCount = 1;
                }else if(this.animationCounter <= 700){
                    this.spriteFrameCount = 2;
                    this.damaging = true;
                }else if(this.animationCounter < 1000){
                    this.spriteFrameCount = 3;
                    this.damaging = false;
                }else if(this.animationCounter >= 1000){
                    this.animationCounter = 0;
                    this.changePhase(0);
                }
            }
        }else if(CHARACTER == 4){
            //1st Attack
            if(this.phase == 1){
                if(this.animationCounter <= 100) this.spriteFrameCount = 0;
                else if(this.animationCounter <= 200){
                    this.spriteFrameCount = 1;
                }else if(this.animationCounter <= 400){
                    this.spriteFrameCount = 0;
                }else if(this.animationCounter <= 600){
                    this.spriteFrameCount = 2;
                }else if(this.animationCounter <= 800){
                    this.spriteFrameCount = 3;
                    this.damaging = true;
                }else if(this.animationCounter <= 1000){
                    this.spriteFrameCount = 2;
                    this.damaging = false;
                }else if(this.animationCounter >= 1000){
                    this.animationCounter = 0;
                    this.changePhase(0);
                }
            }
            //2nd Attack
            if(this.phase == 2){
                if(this.animationCounter <= 200) this.spriteFrameCount = 0;
                else if(this.animationCounter <= 500){
                    this.spriteFrameCount = 1;
                    this.damaging = true;
                }else if(this.animationCounter <= 1000) this.damaging = false;
                else if(this.animationCounter >= 1000){
                    this.animationCounter = 0;
                    this.changePhase(0);
                }
            }
        }
        //Defend
        if(this.phase == 3){
            if(this.animationCounter >= 1000){
                this.animationCounter = 0;
                this.changePhase(0);
            }
        }
        //Hurt
        if(this.phase == 4){
            if(this.animationCounter >= 500){
                this.animationCounter = 0;
                this.changePhase(0);
            }
        }
    }
    draw(){
        ctx.drawImage(
            this.image,                 //actually spritesheet
            this.spriteFrames[this.spriteFrameCount], 0, //start of current sprite (x, y) on spritesheet
            //1000*this.sizeRatio, 1000*this.sizeRatio,  //width, height(on spritesheet)
            //this.left, LANE1 + (CHARACTER_HEIGHT*(this.lane-1)) - Math.floor(CHARACTER_HEIGHT/3) - (CHARACTER_HEIGHT*(this.positionRatio - 1)), //position of sprite on canvas (x, y)
            //CHARACTER_WIDTH*this.sizeRatio, //width on canvas (stretched to fit)
            //CHARACTER_HEIGHT*this.sizeRatio, //height on canvas (stretched to fit)
            1000*this.sizeRatio, 1000,  //width, height(on spritesheet)
            this.left, LANE1 + (CHARACTER_HEIGHT*(this.lane-1)) - Math.floor(CHARACTER_HEIGHT/3), //position of sprite on canvas (x, y)
            CHARACTER_WIDTH*this.sizeRatio, //width on canvas (stretched to fit)
            CHARACTER_HEIGHT //height on canvas (stretched to fit)
        );
    }
    
}

class Robot{
    constructor(lane, health, speed, picture){
        //this.number = number;
        this.lane = lane;
        this.left = SCREEN_WIDTH;
        //this.top = LANE1 + (CHARACTER_HEIGHT*(this.lane-1)) - Math.floor(CHARACTER_HEIGHT/3);
        this.width = CHARACTER_WIDTH;
        this.height = CHARACTER_HEIGHT;
        this.health = health;
        this.speed = speed;
        this.image = new Image(CHARACTER_WIDTH, CHARACTER_HEIGHT);
        this.image.src = picture;
        //this.spriteFrameCount = 0;
        //this.spriteFrames = [];
    }
    changeFrame(){
        /*
        if(this.phase == 0){
            if(counter <= 125) this.spriteFrameCount = 0;
            else if(counter <= 250) this.spriteFrameCount = 1;
            else if(counter <= 375) this.spriteFrameCount = 2;
            else if(counter <= 500) this.spriteFrameCount = 1;
            else if(counter <= 625) this.spriteFrameCount = 0;
            else if(counter <= 750) this.spriteFrameCount = 1;
            else if(counter <= 875) this.spriteFrameCount = 2;
            else if(counter <= 1000) this.spriteFrameCount = 1;
        }
        */
    }
    move(number, secondsPassed){
        this.left -= Math.ceil((secondsPassed * 0.2) * this.speed);
        if(this.left <= -CHARACTER_WIDTH){
            this.die(number);
        }else{
            if(character.damaging){
                if(this.lane == character.lane && this.left + CHARACTER_EDGE_DIFFERENCE <= character.left + (CHARACTER_WIDTH*character.sizeRatio) &&
                this.left + CHARACTER_WIDTH - CHARACTER_EDGE_DIFFERENCE >= character.left + CHARACTER_EDGE_DIFFERENCE){
                    this.die(number);
                    if(character.phase != 3){
                        if(!character.damaging){
                            console.log("Character Hit");
                            character.health -= 1;
                            character.changePhase(4);
                        }else{
                            if(this.health == 2){
                                if(character.phase != 2){
                                    console.log("Character Hit");
                                    character.health -= 1;
                                    character.changePhase(4);
                                }
                            }
                        }
                    }
                }
            }else{
                if(this.lane == character.lane && this.left+CHARACTER_EDGE_DIFFERENCE <= character.left + CHARACTER_WIDTH - CHARACTER_EDGE_DIFFERENCE &&
                this.left + CHARACTER_WIDTH - CHARACTER_EDGE_DIFFERENCE >= character.left + CHARACTER_EDGE_DIFFERENCE){
                    this.die(number);
                    if(character.phase != 3){
                        if(!character.damaging){
                            console.log("Character Hit");
                            character.health -= 1;
                            character.changePhase(4);
                        }else{
                            if(this.health == 2){
                                if(character.phase != 2){
                                    console.log("Character Hit");
                                    character.health -= 1;
                                    character.changePhase(4);
                                }
                            }
                        }
                    }
                }
            }
            
        }
    }
    die(number){
        if(this.left > 0){
            score += 2;
            effects.push(new Effect(this.left, this.lane, "Explosion.png"));
        }
        robots.splice(number, 1);
    }
    draw(){
        ctx.drawImage(
            this.image,                 //actually spritesheet
            0, 0, //start of current sprite (x, y) on spritesheet
            1000, 1000,  //width, height(on spritesheet)
            this.left, LANE1 + (CHARACTER_HEIGHT*(this.lane-1)) - Math.floor(CHARACTER_HEIGHT/3), //position of sprite on canvas (x, y)
            CHARACTER_WIDTH, //width on canvas (stretched to fit)
            CHARACTER_HEIGHT, //height on canvas (stretched to fit)
        );
    }
    
}

class Road{
    constructor(left, picture){
        this.left = left;
        //this.picture = picture;
        this.image = picture;
        //this.image = new Image(SCREEN_WIDTH*2, SCREEN_HEIGHT);
        //this.image.src = this.picture;
    }
    move(secondsPassed){
        this.left -= Math.ceil((secondsPassed * 0.1));
        if(this.left <= -SCREEN_WIDTH){
            this.left = 0;
        }
    }
    draw(){
        //1st Half
            ctx.drawImage(
            this.image,                 //actually spritesheet
            0, 0, //start of current sprite (x, y) on spritesheet
            SCREEN_WIDTH*2, SCREEN_HEIGHT,  //width, height(on spritesheet)
            this.left, 0, //position of sprite on canvas (x, y)
            SCREEN_WIDTH*2, //width on canvas (stretched to fit)
            SCREEN_HEIGHT, //height on canvas (stretched to fit)
        );
    }
}

class Clouds{
    constructor(left, picture){
        this.left = left;
        //this.picture = picture;
        this.image = picture;
        //this.image = new Image(SCREEN_WIDTH, LANE1);
        //this.image.src = this.picture;
    }
    move(secondsPassed){
        this.left -= Math.ceil((secondsPassed * 0.05));
        if(this.left <= -SCREEN_WIDTH){
            this.left = 0;
        }
    }
    draw(){
        ctx.drawImage(
            this.image,            //actually spritesheet
            0, 0, //start of current sprite (x, y) on spritesheet
            SCREEN_WIDTH*2, LANE1,  //width, height(on spritesheet)
            this.left, 0, //position of sprite on canvas (x, y)
            SCREEN_WIDTH*2, //width on canvas (stretched to fit)
            LANE1, //height on canvas (stretched to fit)
        );
        
    }
}

class Effect{
    constructor(left, lane, picture){
        this.left = left;
        this.lane = lane;
        this.growth = 0.2;
        this.animationCounter = 0;
        this.finished = false;
        this.picture = picture;
        this.image = new Image(CHARACTER_WIDTH, CHARACTER_HEIGHT);
        this.image.src = this.picture;
    }
    animate(number){
        if(!this.finished){
            if(this.animationCounter <= 100){ this.growth = 0.5;
            }else if(this.animationCounter <= 200){
                this.growth = 1;
            }else if(this.animationCounter > 300){
                this.animationCounter = 0;
                this.finished = true;
                effects.splice(number, 1);
            }
        }
    }
    draw(){
        ctx.drawImage(
            this.image,                 //actually spritesheet
            0, 0, //start of current sprite (x, y) on spritesheet
            250, 250,  //width, height(on spritesheet)
            this.left + Math.floor((CHARACTER_WIDTH*(1-this.growth))/2), //x position of sprite on canvas
            LANE1 + (CHARACTER_HEIGHT*(this.lane-1)) - Math.floor(CHARACTER_HEIGHT/3) + Math.floor((CHARACTER_HEIGHT*(1-this.growth))/2), //y position of sprite on canvas
            CHARACTER_WIDTH*this.growth, //width on canvas (stretched to fit)
            CHARACTER_HEIGHT*this.growth, //height on canvas (stretched to fit)
        );
    }
}

function setUp(){
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    canvas.width = SCREEN_WIDTH;
    canvas.height = SCREEN_HEIGHT;
    prepareImages();
}

function prepareImages(){
    let picturesLoaded = 0;
    let charPicture;
    if(CHARACTER == 1){
        //charPicture = document.getElementById("boxerSpriteSheet");
        charPicture = new Image(16000, 1000);
        charPicture.src = "Boxer Sprite Sheet.png";
    }else if(CHARACTER == 2){
        //charPicture = document.getElementById("cavemanSpriteSheet");
        charPicture = new Image(24000, 1000);
        charPicture.src = "Caveman Sprite Sheet Short.png";
    }else if(CHARACTER == 3){
        //charPicture = document.getElementById("knightSpriteSheet");
        charPicture = new Image(22000, 1000);
        charPicture.src = "Knight Sprite Sheet.png";
    }else if(CHARACTER == 4){
        //charPicture = document.getElementById("soldierSpriteSheet");
        charPicture = new Image(12000, 1000);
        charPicture.src = "Soldier Sprite Sheet.png";
    }
    //let roadPicture = document.getElementById("roadImage");
    //let cloudPicture = document.getElementById("cloudImage");
    let roadPicture = new Image(3000, 800);
    roadPicture.src = "One Man Army Background.png";
    let cloudPicture = new Image(3000, 175);
    cloudPicture.src = "One Man Army Background Clouds.png";
    console.log("preparing images");
    
    charPicture.addEventListener("load", function(){
        console.log("charPicture loaded");
        //Boxer has 2 Health, 2 Shield, 1 Range, 3 Speed
        //Caveman has 3 Health, 1 Shield, 2 Range, 2 Speed
        //Knight has 2 Health, 3 Shield, 2 Range, 1 Speed
        //Soldier has 1 Health, 1 Shield, 3 Range, 2 Speed
        if(CHARACTER == 1) character = new Character(2, 2, charPicture);
        else if(CHARACTER == 2) character = new Character(3, 1, charPicture);
        else if(CHARACTER == 3) character = new Character(2, 3, charPicture);
        else if(CHARACTER == 4) character = new Character(1, 1, charPicture);
        picturesLoaded++;
        if(picturesLoaded >= 3){
            console.log("runGame");
            runGame(0);
        }
    }, {once: true});
    roadPicture.addEventListener("load", function(){
        console.log("roadPicture loaded");
        road = new Road(0, roadPicture);
        picturesLoaded++;
        if(picturesLoaded >= 3){
            runGame(0);
            console.log("runGame");
        }
    }, {once: true});
    cloudPicture.addEventListener("load", function(){
        console.log("cloudPicture loaded");
        clouds = new Clouds(0, cloudPicture);
        picturesLoaded++;
        if(picturesLoaded >= 3){
            runGame(0);
            console.log("runGame");
        }
    }, {once: true});
    
    /*
    //jamming(0);
    picture.onload = function(){
        //loaded = true;
        console.log("loaded");
        //Character(health, shield, picture)
        if(CHARACTER == 1){
            //Boxer has 2 Health, 2 Shield, 1 Range, 3 Speed
            //character = new Character(2, 2, "Boxer Sprite Sheet.png");
            character = new Character(2, 2, picture);
        }else if(CHARACTER == 2){
            //Caveman has 3 Health, 1 Shield, 2 Range, 2 Speed
            //character = new Character(3, 1, "Caveman Sprite Sheet.png");
            character = new Character(3, 1, picture);
        }
        road = new Road(0, "One Man Army Background.png");
        clouds = new Clouds(0, "One Man Army Background Clouds.png");
        runGame(0);
    };
    */
}

function jamming(timeStamp){
    let currentTime = timeStamp;
    let secondsPassed = timeStamp - oldTimeStamp;
    oldTimeStamp = currentTime;
    counter += secondsPassed;
    if(counter >= 1000){
        console.log("jam Second");
        //console.log("secondsPassed " + secondsPassed);
        counter = 0;
    }
    if(loaded){
        oldTimeStamp = 0;
        counter = 0;
    }else if(!loaded) window.requestAnimationFrame(jamming);
}

function runGame(timeStamp){
    drawScreen();
    let currentTime = timeStamp;
    let secondsPassed = timeStamp - oldTimeStamp;
    oldTimeStamp = currentTime;
    counter += secondsPassed;
    if(character.phase != 0) character.animationCounter += secondsPassed;
    for(let i = 0; i < effects.length; i++) effects[i].animationCounter += secondsPassed;
    if(counter >= 1000){
        //console.log("Second");
        //console.log("secondsPassed " + secondsPassed);
        counter = 0;
        if(!paused){
            score ++;
            makeRobots();
        }
        //for(let i = 0; i < robots.length; i++) console.log("robot " + i + " left: " + robots[i].left);
    }
    if(!paused){
        character.changeFrame();
        moveRobots(secondsPassed);
        road.move(secondsPassed);
        clouds.move(secondsPassed);
        for(let i = 0; i < effects.length; i++) effects[i].animate(i);
    }
    window.requestAnimationFrame(runGame);
}

function drawScreen(){
    ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    //ctx.fillStyle = "gray";
    //ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    //Lanes
    /*
    ctx.beginPath();
    ctx.moveTo(0, LANE1);
    ctx.lineTo(SCREEN_WIDTH, LANE1);
    ctx.moveTo(0, LANE2);
    ctx.lineTo(SCREEN_WIDTH, LANE2);
    ctx.moveTo(0, LANE3);
    ctx.lineTo(SCREEN_WIDTH, LANE3);
    ctx.moveTo(0, LANE4);
    ctx.lineTo(SCREEN_WIDTH, LANE4);
    ctx.moveTo(0, LANE5);
    ctx.lineTo(SCREEN_WIDTH, LANE5);
    ctx.stroke();
    */

    road.draw();
    clouds.draw();
    for(let i = 0; i < robots.length; i++) robots[i].draw();
    for(let i = 0; i < effects.length; i++) effects[i].draw();
    character.draw();
    
    //Score
    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.fillText(score, SCREEN_WIDTH/2-30, 30);
    
    //Health and Shield
    ctx.fillStyle = "red";
    ctx.fillRect(10, 10, (CHARACTER_WIDTH/2)*character.health, CHARACTER_HEIGHT/3);
    ctx.fillStyle = "grey";
    ctx.fillRect(10, 20 + (CHARACTER_HEIGHT/3), (CHARACTER_WIDTH/2)*character.shield, CHARACTER_HEIGHT/3);

    if(gameOver){
        ctx.font = "100px Arial";
        ctx.fillStyle = "black";
        ctx.fillText("Game Over", SCREEN_WIDTH/3, LANE2);
    }
}

function moveRobots(timeStamp){
    for(let i = 0; i < robots.length; i++){
        robots[i].move(i, timeStamp);
    }
}

function makeRobots(){
    let lane1 = randomNumber(1, 5);
    let lane2 = randomNumber(1, 5);
    //Can't 2 robots in one space, so if random number is the same, only one robot is made in that second
    let oneRobot = false;
    if(lane1 == lane2) oneRobot = true;
    let type = randomNumber(0, 4);
    if(type == 3){
        let picture = "Square Robot Tank.png";
        //Robot(lane, health, speed, picture)
        robots.push(new Robot(lane1, 2, 1, picture));
        if(!oneRobot) robots.push(new Robot(lane2, 2, 1, picture));
    }else if(type == 4){
        let picture = "Square Robot Scout.png";
        //Robot(number, lane, health, speed, picture)
        robots.push(new Robot(lane1, 1, 2, picture));
        if(!oneRobot) robots.push(new Robot(lane2, 1, 2, picture));
    }else{
        let picture = "Square Robot.png";
        //Robot(number, lane, health, speed, picture)
        robots.push(new Robot(lane1, 1, 1, picture));
        if(!oneRobot) robots.push(new Robot(lane2, 1, 1, picture));
    }
}

function endGame(){
    paused = true;
    gameOver = true;
    /*
    ctx.font = "100px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Game Over", SCREEN_WIDTH/4, SCREEN_HEIGHT/4);
    */
}

function randomNumber(num1, num2){
    return Math.floor(Math.random() * (num2 - num1 + 1) ) + num1;
}

alert("Use W and D to move up and down. Use D and F to attack (F to attack the blue robots). Use A to defend.");
setUp();
//runGame(0);
