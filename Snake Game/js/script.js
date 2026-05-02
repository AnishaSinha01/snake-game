//Game Constants
let inputDir = {x: 0, y: 0};
const foodSound = new Audio("music/food.mp3");
const gameOverSound = new Audio("music/gameover.mp3");
const moveSound  = new Audio("music/move.mp3");
const musicSound = new Audio("music/music.mp3");

let speed = 5;
let lastPaintTime = 0 ;
let SnakeArr = [{x:13 , y:15}];
let scoreBox = document.querySelector('#scoreBox');
score = 0;

let start = document.querySelector('.start');
let gameOverText = document.querySelector('.gameOver');
let boardBox = document.querySelector('#board');

let hiscoreBox = document.querySelector('#hiscore');
hiscore = 0;
let food = {x:6 , y:7};

//Game Functions
function main(ctime){
    window.requestAnimationFrame(main);
    // console.log(ctime);
    if((ctime - lastPaintTime)/1000 < 1/speed){
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

function isCollide(snake){
   //if you bmp into yourself
   for (let i = 1; i < SnakeArr.length; i++) {
        if(snake[i].x === snake[0].x && snake[i].y === snake[0].y){
            return true;
        }
   }
   //if you bump into wall
    if(snake[0].x >=18 || snake[0].x<=0 || snake[0].y >=18 || snake[0].y<=0){
        return true;
    }
}


function gameEngine(){
    //Part 1: Updating the snake array & Food
    if(isCollide(SnakeArr)){
        gameOverSound.play();
        musicSound.pause();
        inputDir = {x:0 , y:0};
        SnakeArr = [{x:13 , y:15}];

        start.classList.remove('hidden');
        start.innerText = "Press any key to restart";

        boardBox.style.display = "none";
        gameOverText.style.display = "block";
        gameOverText.innerText = `Game Over!!\n Score: ${score}`;
        
        scoreBox.classList.add('hidden');
        hiscoreBox.classList.add('hidden');

        
        score = 0; 
        scoreBox.innerText = "Score :" + score;
        // musicSound.play();
    }

    //If you have eaten the food, increment the score and regenerate the food
    if(SnakeArr[0].y === food.y && SnakeArr[0].x === food.x){
        foodSound.play();
        score++;
        if(score>hiscore){
            hiscore = score;
            localStorage.setItem('hiscore', hiscore);
            hiscoreBox.innerText = "High Score : "+hiscore;
        }
        scoreBox.innerText = "Score :" + score;
        SnakeArr.unshift({x: SnakeArr[0].x + inputDir.x , y: SnakeArr[0].y + inputDir.y});
        let a = 2;
        let b = 16;
        food = {x: Math.round(a + (b - a) * Math.random()) , y: Math.round(a + (b - a) * Math.random())};
    }

    //Move the snake
    for (let i = SnakeArr.length -2; i>=0; i--) {
        SnakeArr[i+1] =  {...SnakeArr[i]};
    }

    SnakeArr[0].x += inputDir.x;
    SnakeArr[0].y += inputDir.y;

    //Part 2:Display the snake and food
    //Display the snake
    board.innerHTML = "";
    SnakeArr.forEach((e , index)=>{
        snakeElement = document.createElement("div");
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        if(index === 0) {
            snakeElement.classList.add('head');
            
            let leftEye = document.createElement('div');
            leftEye.classList.add('eye', 'left');
            snakeElement.appendChild(leftEye);
            
            let rightEye = document.createElement('div');
            rightEye.classList.add('eye', 'right');
            snakeElement.appendChild(rightEye);

        } else {
            snakeElement.classList.add('snake');
        }
        
        board.appendChild(snakeElement);
    })

    // Display the food
    foodElement = document.createElement("div");
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}

//Main logic starts here
window.requestAnimationFrame(main);
window.addEventListener('keydown',e=>{
    start.classList.add('hidden');
    boardBox.style.display = "grid";
    gameOverText.style.display = "none";
    hiscoreBox.classList.remove('hidden');
    scoreBox.classList.remove('hidden');

    inputDir = {x:0 , y:1}; //Start the game
    moveSound.play();
    switch (e.key) {
        case "ArrowUp":
            inputDir.x = 0; 
            inputDir.y = -1; 
            break;

        case "ArrowDown":
            inputDir.x = 0; 
            inputDir.y = 1; 
            break;

        case "ArrowLeft":
            inputDir.x = -1; 
            inputDir.y = 0; 
            break;

        case "ArrowRight":
            inputDir.x = 1; 
            inputDir.y = 0; 
            break;    
    
        default:
            break;
    }
})

// Retrieve the high score from localStorage
let storedHiscore = localStorage.getItem('hiscore');
if(storedHiscore !== null){
    hiscore = parseInt(storedHiscore);
    hiscoreBox.innerText = "High Score: " + hiscore;
}
