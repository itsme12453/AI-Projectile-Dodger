import updatePlayerMovement from "/movement.js";
import updateEnemyBouncing from "/enemies.js";
//import generateEnemies from "/enemies.js";

const network = new brain.NeuralNetwork();

//--- LET THE UNNORMALISED DATA SETS
let directions = [24,76,245,325,127,100,65,24,120,359,79,241,167,180];  // max 360 
let distances = [93,35,46,68,38,74,12,16,54,4,40,23,70,83]; //max 100 
let desiredDirectionChange = 90 //DESIRED ANGLE DIFFERENCE WE WANT THE BOT TO INDUCE IN RELATION TO ENEMY DIRECTION, 180 is logical max
//---

//--- LET NORMALISED DATA SETS // THIS IS THE DATA SET GIVEN TO BRAIN
let directionsInput = []; 
let distancesInput = []; 
let desiredDirectionInput;
//---

//--- NORMALISE THE DATASETS AND PUT THEM IN THEIR RESPECTIVE ARRAYS
desiredDirectionInput = desiredDirectionChange/360;  //NORMALISED DATA SET // THIS IS THE DATA SET GIVEN TO BRAIN
for(let i = 0; i < directions.length; i++){
    directionsInput.push(directions[i]/360); //360 max
}
for(let i = 0; i < distances.length; i++){
    distancesInput.push(distances[i]/100); //100 max
}

//--- BRAIN, the bigger, the more accurate/ trained
// training data outputs are weighted more towards closer enemies - the closer it is the greater the turn

network.train([
    {input: [directionsInput[0], distancesInput[0]], output: [(directionsInput[0]+desiredDirectionInput*(1-distancesInput[0]))] }, 
    {input: [directionsInput[1], distancesInput[1]], output: [(directionsInput[1]+desiredDirectionInput*(1-distancesInput[1]))] },
    {input: [directionsInput[2], distancesInput[2]], output: [(directionsInput[2]+desiredDirectionInput*(1-distancesInput[2]))] },
    {input: [directionsInput[3], distancesInput[3]], output: [(directionsInput[3]+desiredDirectionInput*(1-distancesInput[3]))] },
    {input: [directionsInput[4], distancesInput[4]], output: [(directionsInput[4]+desiredDirectionInput*(1-distancesInput[4]))] },
    {input: [directionsInput[5], distancesInput[5]], output: [(directionsInput[5]+desiredDirectionInput*(1-distancesInput[5]))] },
    {input: [directionsInput[6], distancesInput[6]], output: [(directionsInput[6]+desiredDirectionInput*(1-distancesInput[6]))] },
    {input: [directionsInput[7], distancesInput[7]], output: [(directionsInput[7]+desiredDirectionInput*(1-distancesInput[7]))] },
    {input: [directionsInput[8], distancesInput[8]], output: [(directionsInput[8]+desiredDirectionInput*(1-distancesInput[8]))] },
    {input: [directionsInput[9], distancesInput[9]], output: [(directionsInput[9]+desiredDirectionInput*(1-distancesInput[9]))] },
    {input: [directionsInput[10], distancesInput[10]], output: [(directionsInput[10]+desiredDirectionInput*(1-distancesInput[10]))] },
    {input: [directionsInput[11], distancesInput[11]], output: [(directionsInput[11]+desiredDirectionInput*(1-distancesInput[11]))] },
    {input: [directionsInput[12], distancesInput[12]], output: [(directionsInput[12]+desiredDirectionInput*(1-distancesInput[12]))] },
    {input: [directionsInput[13], distancesInput[13]], output: [(directionsInput[13]+desiredDirectionInput*(1-distancesInput[13]))] },
]);


/// Game
/////////////


let player;
let enemy;
let enemyArr = [];

function Vector2D(x, y) {
    this.x = x;
    this.y = y;
}

function getBotMovement(angleDeg, distance){
    // let result = Math.floor(network.run([angleDeg, distance]) * 360);
    let result = network.run([angleDeg, distance])
    
    return result;
}

function startGame() {
    game.start();
    //--- spawns player
    player = new Player(new Vector2D(900, 700), new Vector2D(0, 0), "lightblue", 3);
    //---

    //--- spawns enemies
    let speed = 0;   
    let random;
    
    for(let i = 0; i < 2; i++){
        random = Math.random() *10
        enemyArr[i] = new Enemy(new Vector2D(600, 600), new Vector2D(0, 0), speed, 18);
        // if(random <= 2.5){    //top side
        //     enemyArr[i] = new Enemy(new Vector2D(Math.floor((Math.random() * game.canvas.width-50) + 50), 70), new Vector2D(0, 0), speed, 18);   
        // } else if(random > 2.5 && random <= 5){   //right side
        //     enemyArr[i] = new Enemy(new Vector2D(game.canvas.width - 50, Math.floor((Math.random() * game.canvas.height-50)+50)), new Vector2D(0, 0), speed, 18); 
        // } else if(random > 5 && random <= 7.5){   //bottom side
        //     enemyArr[i] = new Enemy(new Vector2D(Math.floor((Math.random() * game.canvas.width-50) + 50), game.canvas.height - 50), new Vector2D(0, 0), speed, 18); 
        // } else{                                   //left side
        //     enemyArr[i] = new Enemy(new Vector2D(50, Math.floor((Math.random() * game.canvas.height-50)+50)), new Vector2D(0, 0), speed, 18); 
        // }
    }
    //---

    animate();
}

let game = {
    //--- creates canvas
    start: function() {
        this.canvas = document.getElementById("canvas");
        this.ctx = canvas.getContext("2d");

        this.canvas.width = window.innerWidth - 30;
        this.canvas.height = window.innerHeight - 30;
    },
    // ---
    //--- clears the canvas 
    stop: function() {
        this.ctx.clearRect(0, 0, innerWidth, innerHeight);
    }
    //---
}


function Player(pos, vel, color, speed) {
    this.pos = pos;
    this.vel = vel;
    this.speed = speed;
    this.dead = false;
    this.score = 0;

    this.left = false;
    this.right = false;
    this.up = false;
    this.down = false;

    this.draw = function() {
        if (!this.dead) { //while player is alive
            game.ctx.beginPath();
            game.ctx.arc(this.pos.x, this.pos.y, 18, 0, 2 * Math.PI);
            game.ctx.fillStyle = color;
            game.ctx.fill();
            game.ctx.closePath();

            //--- score system - every frame alive increases score by 1 
            this.score += 1;

            game.ctx.font = '8pt Calibri';
            game.ctx.fillStyle = 'white';
            game.ctx.textAlign = 'center';
            game.ctx.fillText(this.score, this.pos.x, this.pos.y + 3);
            
            // console.log(this.score);
            //---
            
        }
    }

    this.update = function() {
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;
    }
}

function Enemy(pos, vel, speed, radius) {
    this.pos = pos;
    this.vel = vel;
    this.speed = speed;
    this.radius = radius;

    this.angle = Math.random() * 2 * Math.PI
    this.direction = new Vector2D(Math.cos(this.angle), Math.sin(this.angle))

    // --- draws enemy
    this.draw = function() {
        game.ctx.beginPath();
        game.ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
        game.ctx.fillStyle = "red";
        game.ctx.fill();
        game.ctx.closePath();
    }
    // ---
    // --- updates position
    this.update = function() {
        this.pos.x += this.speed * this.direction.x;
        this.pos.y += this.speed * this.direction.y;
        updateEnemyBouncing(this);
    }
    // ---
}


// listens for key strokes
window.addEventListener("keydown", function(e) {
    if (e.key == "a" || e.key == "ArrowLeft") {
        player.left = true;
    }
    if (e.key == "d" || e.key == "ArrowRight") {
        player.right = true;
    }
    if (e.key == "w" || e.key == "ArrowUp") {
        player.up = true;
    }
    if (e.key == "s" || e.key == "ArrowDown") {
        player.down = true;
    }
})

window.addEventListener("keyup", function(e) {
    if (e.key == "a" || e.key == "ArrowLeft") {
        player.left = false;
    }
    if (e.key == "d" || e.key == "ArrowRight") {
        player.right = false;
    }
    if (e.key == "w" || e.key == "ArrowUp") {
        player.up = false;
    }
    if (e.key == "s" || e.key == "ArrowDown") {
        player.down = false;
    }
})
// ---

// Collision - If touching enemies, or the entire player is out of the canvas, kill the player
function checkCollision(){
    if (player.pos.x <= -18 || player.pos.y <= -18 || player.pos.x >= canvas.width + 18 || player.pos.y >= canvas.height + 18) {
       // player.dead = true;
    }

    for(let i = 0; i < enemyArr.length - 1; i++){
        let dx = player.pos.x - enemyArr[i].pos.x;
        let dy = player.pos.y - enemyArr[i].pos.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 36){
            player.dead = true;

            return;
        } else if (distance === 36){
            player.dead = true;

            return;
        }
        // --- BOT MOVEMENT
        if (distance < 800){
            //let angleA = Math.atan2(enemyArr[i].pos.y - player.pos.y, enemyArr[i].pos.x - player.pos.x); //Degrees from enemy
            //let angleA = Math.atan2(player.pos.y - enemyArr[i].pos.y, player.pos.x - enemyArr[i].pos.x); //Degrees from enemy
            
            let angleInDegrees = angleA * (180 / Math.PI);
            let bearing = (Math.abs(angleInDegrees + 90) % 360);

            console.log(bearing);
        }
    }
}


//runs every frame
function animate() {
    window.requestAnimationFrame(animate);
    game.ctx.clearRect(0, 0, innerWidth, innerHeight);
    
    updatePlayerMovement(player);
    checkCollision();
    player.draw();
    player.update();

    for(let i = 0; i < enemyArr.length - 1; i++){
        //console.log(enemyArr[i]);
        enemyArr[i].draw();
        enemyArr[i].update();
    }

    
}
// ---

startGame();