let canvas = document.querySelector("canvas");

canvas.width = window.innerWidth - 1.7 ;
canvas.height = window.innerHeight - 4.1;

const backgroundImage=new Image();
backgroundImage.src='./Assets/images/background.jpeg';

const gunImage=new Image();
gunImage.src='./Assets/images/gun.png';

let gameStart = false;
let playerRank = 1;
let gameData;

function drawBackground() {
    c.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height );
}

const startButton = document.querySelector('.enter');
const playerNameInput = document.getElementById('playerName');
const nickNameInput = document.getElementById('nickName');
let pause = false;
// setTimeout(() => {
//     pause = true; 
//   }, 2000);

// startButton.addEventListener('click', function() {
//   const playerName = playerNameInput.value.trim();
//   const nickName = nickNameInput.value.trim();

//   if (playerName === '' || nickName === '') {
//     alert('Please enter both your name and nick-name to start the game!');
//     return; 
//   }

// gameData = {
//     playerName: playerName,
//     nickName: nickName
//   };

//   const toast = document.createElement('div');
//   toast.classList.add('toast'); 
//   toast.textContent = `Welcome, ${gameData.playerName} !`;
//   document.body.appendChild(toast);

 
//   setTimeout(() => {
//     toast.remove(); 
//   }, 3000);

//   pause = false;
//   animate();
  
//   createBoard();

//   const start = document.querySelector(".start");
//   start.style.display = "none";
//   gameStart = true;

//   console.log('Game starting with:', gameData);
// });


const boy = new Image();
boy.src='./Assets/images/player.png';

const stone = new Image();
stone.src =`./Assets/images/stone.png`;

const enemy = new Image();
enemy.src='./Assets/images/jombie.png';

const enemy1 = new Image();
enemy1.src='./Assets/images/jombie1.png';

let c = canvas.getContext("2d");
let gravity = 0.999;
let score = 0;
let bullets = [];
let jombies = [];
let blockss = [];
// let height=150;
let mousePos = null;
let playerFacing = "right";

class character {
    constructor({position , velocity}){
        this.position = position;
        this.velocity = velocity;
        this.height = 300;
        this.width = 150;
        this.lastKey;
        this.healthBar = {
            position: this.position,
            width: 100,
            height: 5
        }
        this.square = {
            position: this.position,
            width: 20,
            height: 20
        }
    }

    isCollidingWithBlock(b) {
        return (
          this.position.x < b.position.x + b.width &&
          this.position.x + this.width > b.position.x &&
          this.position.y < b.position.y + b.height &&
          this.position.y + this.height > b.position.y
        );
      }

    isCollidingWithBlocks() {
        for (const b of blockss) {
          if (this.isCollidingWithBlock(b)) {
            return true; 
        }
        }
        return false; 
      }

    draw() {
        // c.fillStyle = "red";
        // c.beginPath();
        c.drawImage(boy,this.position.x , this.position.y ,this.width, this.height);
        // c.fillRect(this.position.x , this.position.y ,this.width, this.height);
        // c.fillRect(this.square.position.x, this.square.position.y - 40 , this.square.width, this.square.height);
        c.drawImage(stone,this.square.position.x, this.square.position.y - 40 , this.square.width, this.square.height )
        c.fillStyle = "green";
        c.fillRect(this.healthBar.position.x + 10, this.healthBar.position.y - 10, this.healthBar.width, this.healthBar.height)
        c.lineWidth= 0.3;  
        c.strokeStyle= "dark green";  
        c.strokeRect(this.healthBar.position.x + 10, this.healthBar.position.y - 10, 100 , this.healthBar.height);
    }

    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if(this.position.y + this.height + this.velocity.y >= canvas.height - 100){
            this.velocity.y = 0;
        } 
        else this.velocity.y += gravity; 

        if(player.isCollidingWithBlocks()){
            //console.log("touching");
            // player.position.x -=2;
            player.velocity.x = 0;
            player.velocity.y = 0;
        }
        gun1.position.x = this.position.x + 100;
        gun1.pivote.x = this.position.x + 100;
        gun1.position.y = this.position.y + 150;
        gun1.pivote.y = this.position.y + 150;
    }

    checkIfClicked(x, y) {
    return (
      x >= this.square.position.x &&
      x <= this.square.position.x + this.square.width &&
      y >= this.square.position.y - 40 &&
      y <= this.square.position.y - 40 + this.square.height
    );
  }
}

class blocks {
    constructor({position, velocity }){
        this.position = position;
        this.velocity = velocity;
        this.height = 120;
        this.width = 120;
        this.healthBar = {
            position: this.position,
            width: 100,
            height: 5
        }
    }

    draw() {
        c.fillStyle = "pink";
        c.strokeStyle = "black";
        // c.stroke();
        // c.fillRect(this.position.x, this.position.y, this.width, this.height);
        // c.beginPath();
        c.drawImage(stone, this.position.x, this.position.y, this.width, this.height);
        c.fillStyle = "green"
        c.fillRect(this.healthBar.position.x + 10, this.healthBar.position.y + 5 + this.height, this.healthBar.width, this.healthBar.height)
        c.lineWidth= 0.3;  
        c.strokeStyle= "dark green";  
        c.strokeRect(this.healthBar.position.x + 10, this.healthBar.position.y + 5 + this.height, 100 , this.healthBar.height);
        // //console.log("done");
    }

    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        if(this.position.y + this.height + this.velocity.y >= canvas.height - 100){
            this.velocity.y = 0;
        } 
        else this.velocity.y += gravity; 

        
    }
}

// let angle1 = 0;

class gun {
    constructor({position,pivote}) {
        this.position = position;
        this.width = 100;
        this.height = 40;
        this.pivote = pivote;
        this.rotationAngle = 0;
    }

    draw(){
        c.save();
        c.translate(this.pivote.x, this.pivote.y)
        c.rotate(this.rotationAngle);
        
        c.translate(-this.pivote.x, -this.pivote.y);
        // c.fillStyle = "green";
        c.drawImage(gunImage,this.position.x, this.position.y, this.width, this.height)
        // c.fillRect(this.position.x, this.position.y, this.width, this.height);
        c.restore();
        
        bullets.forEach( bullet => {
            bullet.move();
            bullet.draw();

            if (bullet.x < 0 || bullet.x > canvas.width  || bullet.y > canvas.height ) {
                bullets.splice(i, 1);
               }
            else if(collide(bullet)){
                //console.log("collide");
                bullets.splice(i, 1);
            }
            
            hit(bullet);
        })
    }

    update() {
        this.rotateTop();
        this.draw();
    }

    rotateTop(){
        if(mousePos){
             this.rotationAngle = Math.atan2(mousePos.y - 
                (this.pivote.y), mousePos.x - 
                (this.pivote.x));
        }
    }
}

class jombie {
    constructor ({position,velocity, image, pos}) {
        this.position = position;
        this.velocity = velocity;
        this.image = image;
        this.width = 100;
        this.height = 200;
        this.healthBar = {
            position: this.position,
            width: 80,
            height: 5
        }
        this.axe = {
            position: this.position,
            width: 20,
            height: 80,
            swinging: false,
            angle: -60 * Math.PI / 180, // Initial angle for the axe
            swingSpeed: Math.PI / 30, // Controls how fast the axe swings (adjust for desired speed)
          };
        this.pos =pos;
        this.hit = null;
    }

    isCollidingWith(jombi2) {
        for(const j of jombies){
            if(j != jombi2){
                let test =
                 (
                    jombi2.position.x < j.position.x + j.width &&
                    jombi2.position.x + jombi2.width > j.position.x &&
                    jombi2.position.y < j.position.y + j.height &&
                    jombi2.position.y + jombi2.height > j.position.y
                  );

                if(test){
                    if(jombi2.position.x < canvas.width/2){
                    jombi2.position.x -= 1;}
                    else {
                    jombi2.position.x += 1;
                    }
                    return true;
                }
            }
        }
      }
    
    isCollideJombie(){
        for (const jombi2 of jombies) {
            if(this.isCollidingWith(jombi2)){
                return true;
            }
            else {
                if(jombi2.position.x < canvas.width/2){
                    jombi2.velocity.x = 1;}
                    else {
                    jombi2.velocity.x = -1;
                    } 

            }
        }
        return false;
    }

    swingAxe(a) {
        this.axe.swinging = true;
        this.hit = a;

      }
    
        create() {
            c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        
            c.fillStyle = "red";
            c.fillRect(
              this.healthBar.position.x + this.width / 6,
              this.healthBar.position.y - 20,
              this.healthBar.width,
              this.healthBar.height
            );
            c.lineWidth = 0.3;
            c.strokeStyle = "red";
            c.strokeRect(
              this.healthBar.position.x + this.width / 6,
              this.healthBar.position.y - 20,
              80,
              this.healthBar.height
            );
        
            if (this.axe.swinging) {
              this.axe.angle += this.axe.swingSpeed;
              if (this.axe.angle > Math.PI || this.axe.angle < -Math.PI) {
                this.axe.swinging = false;
                blockss[num].healthBar.width -= 10;
                if(blockss[num].healthBar.width <= 0){
                    blockss.splice(num,1);
                }
                this.axe.angle = this.pos === "left" ? -60 * Math.PI / 180 : 60 * Math.PI / 180; 
              }
            }
    

    const axeOffsetX = this.pos === "left" ? 70 : 10;
    const axeOffsetY = 40;
    const rotatedAxePosition = this.getRotatedPoint(
      axeOffsetX,
      axeOffsetY,
      this.axe.angle
    );

    c.save(); 
    c.translate(this.position.x + axeOffsetX, this.position.y + axeOffsetY); 
    c.rotate(this.axe.angle); 
    c.fillRect(-this.axe.width / 2, -this.axe.height / 2, this.axe.width, this.axe.height);
    c.restore();
  }


    move(){
        this.position.x += this.velocity.x;
        if(this.position.y + this.height + this.velocity.y >= canvas.height - 100){
            this.velocity.y = 0;
            } 
        else this.velocity.y += gravity; 
        this.position.y += this.velocity.y;

        if(this.isCollideJombie()){
            //console.log("touching jombie");
        }

        this.create();
    }

    getRotatedPoint(x, y, angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return {
          x: x * cos - y * sin,
          y: x * sin + y * cos,
        };
      }
    
}   

const jombie1 = new jombie({
    position: {
        x: Math.random()*200,
        y: Math.random()*300
    },
    velocity: {
        x: 0.2,
        y: 0
    }
}
);


let i=0;
class bullet {
    constructor(x, y, angle) {
        this.x = x;
        this.y = y;
        this.angle = angle;    
        this.dx = Math.cos(angle + 0.05) * 26;
        this.dy = Math.sin(angle + 0.05) * 26;
    }

    move() {
        this.x += this.dx;
        this.y += this.dy;
        if(this.y <= canvas.height - 100){
            this.dy += gravity;
        } 
    }


    draw() {
        c.fillStyle = 'black';
        c.fillRect(this.x - 2, this.y - 2, 10, 10);
    }
}

const player = new character({
    position: {
        x: window.innerWidth/2,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    }
})

const gun1 = new gun ({
    position: {
        x: player.position.x + 50,
        y: 500
    },
    pivote: {
        x: player.position.x + 45,
        y: 500
     }
})

const box1 = new blocks ({
    position: {
        x: player.position.x + 220,
        y: 0 
    },
    velocity: {
        x: player.velocity.x,
        y: player.velocity.y
    }
})
const box2 = new blocks ({
    position: {
        x: player.position.x + 200,
        y: -200
    },
    velocity: {
        x: player.velocity.x,
        y: player.velocity.y
    }
})
const box3 = new blocks ({
    position: {
        x: player.position.x - 220,
        y: 0 
    },
    velocity: {
        x: player.velocity.x,
        y: player.velocity.y
    }
})
const box4 = new blocks ({
    position: {
        x: player.position.x - 200,
        y: -200
    },
    velocity: {
        x: player.velocity.x,
        y: player.velocity.y
    }
})

blockss = [box1,box2,box3,box4];

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w:{
        pressed: false
    }
}

function animate (){
    if (!pause){
    window.requestAnimationFrame(animate);}
    c.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();

    player.update();
    gun1.update();
    blockss.forEach(b => {
        b.update();
    });
    
    player.velocity.x = 0;

    if (keys.a.pressed && lastKey == "a") {
        player.velocity.x = -5;
    }
    else if (keys.d.pressed && lastKey == "d") {
        player.velocity.x = 5;
        }

    if(box2.position.y + box2.height >= box1.position.y){
        box2.velocity.y = 0; 
    }

    if(box4.position.y + box4.height >= box3.position.y){
        box4.velocity.y = 0; 
    }

    jombies.forEach(jom => {

        if(jombieCollide(jom)){
            //console.log ("jombi");
            jom.swingAxe();
            jom.velocity.x = 0;
            }

        jom.move();
    })

}
    
    
animate();

setTimeout(()=> {
    let interval1 = setInterval(() => {
        if(!pause){
            jombieArrival();
        }
    }, 5000);
},1000);

function fireBullet() {
    distance = 2 + gun1.width;
    let angle = gun1.rotationAngle;
    let delX = distance * Math.cos(angle + 0.05);
    let delY = distance * Math.sin(angle + 0.05);
    let bulletX = gun1.pivote.x + delX;
    let bulletY = gun1.pivote.y + delY;
    
    //console.log(angle , gun1.rotationAngle);
    bullets.push(new bullet(bulletX, bulletY, angle))
}

function jombieArrival(){
    if(jombies.length < 5){
    jombies.push(new jombie ({
        position:{
            x: numBtw(-200 , 200),
            y: numBtw(0,300),
        },
        velocity:{
            x: 1,
            y: 0
        },
        image: enemy1,
        pos : "left"
    }))}

    if(jombies.length<10 && jombies.length>1){
        jombies.push(new jombie ({
            position:{
                x: numBtw(1250,1350) ,
                y: numBtw(0,300),
            },
            velocity:{
                x: -1,
                y: 0
            },
            image: enemy,
            pos: "right"
        })) }
}

// random values
function numBtw(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }  

function collide(bullet) {
    let test1 = 
       (bullet.x >= box4.position.x &&
        bullet.x <= box4.position.x + box4.height &&
        bullet.y >= box4.position.y &&
        bullet.y <= box4.position.y + box4.width) 
    
    let test2 = 
       (bullet.x >= box3.position.x &&
        bullet.x <= box3.position.x + box4.height &&
        bullet.y >= box3.position.y &&
        bullet.y <= box3.position.y + box4.width) 
    
    let test3 = 
       (bullet.x >= box1.position.x &&
        bullet.x <= box1.position.x + box4.height &&
        bullet.y >= box1.position.y &&
        bullet.y <= box1.position.y + box4.width) 
    
    let test4 = 
        (bullet.x >= box2.position.x &&
        bullet.x <= box2.position.x + box4.height &&
        bullet.y >= box2.position.y &&
        bullet.y <= box2.position.y + box4.width) 

    return (test1 || test2 || test3 || test4);
}

let num;

function jombieCollide(jom) {
    let test;
    for(a = 0 ; a< blockss.length ; a++){
        test = (
            jom.position.x < blockss[a].position.x + blockss[a].width &&
        jom.position.x + jom.width > blockss[a].position.x &&
        jom.position.y < blockss[a].position.y + blockss[a].height &&
        jom.position.y + jom.height > blockss[a].position.y 
        )

        if (test){
            num = a;
            return true;
        }
    }

    // let test1 = 
    // (   jom.position.x < box1.position.x + box1.width &&
    //     jom.position.x + jom.width > box1.position.x &&
    //     jom.position.y < box1.position.y + box1.height &&
    //     jom.position.y + jom.height > box1.position.y  
    // )
    
    // let test2 = 
    // (    jom.position.x < box2.position.x + box2.width &&
    //     jom.position.x + jom.width > box2.position.x &&
    //     jom.position.y < box2.position.y + box2.height &&
    //     jom.position.y + jom.height > box2.position.y  
    // )

    // let test3 = 
    // (     jom.position.x < box3.position.x + box3.width &&
    //       jom.position.x + jom.width > box3.position.x &&
    //       jom.position.y < box3.position.y + box3.height &&
    //       jom.position.y + jom.height > box3.position.y  
    // )

    // let test4 = 
    // (    jom.position.x < box3.position.x + box3.width &&
    //     jom.position.x + jom.width > box3.position.x &&
    //     jom.position.y < box3.position.y + box3.height &&
    //     jom.position.y + jom.height > box4.position.y  
    // )
    // return(test1 || test2 || test3 || test4);
}


function hit (bullet){
    for(let jom2 =0 ; jom2 < jombies.length ; jom2++  ) {
        let test = 
        (
        bullet.x >= jombies[jom2].position.x &&
        bullet.x <= jombies[jom2].position.x + jombies[jom2].width && 
        bullet.y >= jombies[jom2].position.y &&
        bullet.y <= jombies[jom2].position.y + jombies[jom2].height
        )
        //console.log(test);

        if(test){
            bullets.splice(i, 1);
            jombies[jom2].healthBar.width -= 8;
            if(jombies[jom2].healthBar.width  <= 0){
            jombies.splice(jom2,1);
            }
            score += 10;
            let score2 = document.querySelector(".score2");
            score2.innerHTML = `${score}`;
            // document.querySelector(".Sscore").innerHTML = `${score}`;
            console.log("+1");
            }
    }
}

window.addEventListener("keydown", (event) => {
    switch (event.key) {
        case 'd': 
            keys.d.pressed = true;
            lastKey = "d";
            playerFacing = "right";
            break
        case 'a':
            keys.a.pressed = true;
            lastKey = "a";
            playerFacing = "left";
            break
        case 'w':
            keys.w.pressed = true;
            player.velocity.y = -18;
            break
        // case 'ArrowLeft':
        //     gun1.rotationAngle -= 4; 
        //     break;
        // case 'ArrowRight':
        //     gun1.rotationAngle += 4;
        //     break;
        case 'f':
            fireBullet();
            break;
    }
})

window.addEventListener("keyup", (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false;
            player.velocity.x = 0; 
            break
        case 'a':
            keys.a.pressed = false;
            player.velocity.x = 0;
            break;
    } 
})

canvas.addEventListener("click" , fireBullet );

// feature functions

let features = document.querySelectorAll(".feature");
features.forEach((f)=> {
    f.style.marginTop = "150px";
    f.style.transition = "transform 0.5s ease-out"
})

let down = false;
let interval = setInterval(() => {
    console.log("transalate");
    if(!down){
        features.forEach((f)=> {
            f.style.transform = "translate(0px,8px)";
        })
        down = true;
    }
    else {
        features.forEach((f)=> {
            f.style.transform = "translate(0px,-8px)";
        })
        down = false;
    }
}, 500);

let play = document.querySelector(".play");

play.addEventListener("click" , ()=> {
    if(pause && gameStart){
        play.innerHTML=`<i class="fa-solid fa-pause"></i>`;
        pause= false;
        animate();   
    }
    else {
        play.innerHTML=`<i class="fa-solid fa-play"></i>`;
        pause= true;
    }
})

let isOn = false;
let board = document.querySelector(".board");
let leader = document.querySelector(".leader");
leader.addEventListener("click" , ()=> {
    if(!isOn){
        board.style.display = "block";
        isOn = true;
    }
    else {
        board.style.display = "none";
        isOn = false;
    }

})

// code for leader board
function createBoard(){
let board1 = document.createElement("div");
let rank = document.createElement("div");
let name = document.createElement("div");
let Sscore = document.createElement("div");

board1.classList.add("board1");
rank.classList.add("rank");
name.classList.add("name");
Sscore.classList.add("Sscore");

rank.innerHTML= playerRank++;
name.innerHTML= gameData.playerName;
Sscore.innerHTML = score;

board1.appendChild(rank);
board1.appendChild(name);
board1.appendChild(Sscore);
document.querySelector(".board").appendChild(board1);
}

canvas.addEventListener("mousemove", e => {

    mousePos = {
        x: e.clientX - canvas.offsetLeft,
        y: e.clientY - canvas.offsetTop
    }
});

canvas.addEventListener("mousedown", (e) => {
    const clickX = e.clientX;
    const clickY = e.clientY;
    if (player.checkIfClicked(clickX, clickY)) {
        console.log("Clickable box clicked!"); 
        createBox();
    }
  });

  function createBox() {
      //console.log(angle , gun1.rotationAngle);
    if(playerFacing == "right"){
      blockss.push(new blocks({
        position: {
            x: player.position.x + 220,
            y: 0
        },
        velocity: {
            x: 0,
            y: 0
        }
    }));}
    else if (playerFacing == "left"){
        blockss.push(new blocks({
            position: {
                x: player.position.x - 220,
                y: 0
            },
            velocity: {
                x: 0,
                y: 0
            }
        }));
    }
}