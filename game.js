console.log("Code Run");

let canvas = document.querySelector("canvas");

canvas.width = window.innerWidth ;
canvas.height = window.innerHeight;

const backgroundImage=new Image();
backgroundImage.src='./Assets/images/background.jpeg';
console.log(backgroundImage);

function drawBackground() {
    c.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height );
}

const boy = new Image();
boy.src='./Assets/images/player.png';
console.log(boy);

const enemy = new Image();
enemy.src='./Assets/images/zombie.jpeg';


let c = canvas.getContext("2d");
let gravity = 0.999;
let score = 0;
let bullets = [];
let jombies = [];
let blockss = [];
// let height=150;
class character {
    constructor({position , velocity}){
        this.position = position;
        this.velocity = velocity;
        this.height = 200;
        this.width = 80;
        this.lastKey;
        // this.box = {
        //     position: this.position,
        //     width: 100,
        //     height: 50
        // }
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
        c.fillStyle = "red";
        c.drawImage(boy,this.position.x , this.position.y ,this.width, this.height);
        // c.fillRect(this.position.x , this.position.y ,this.width, this.height);
        // c.fillStyle = "green"
        // c.fillRect(this.box.position.x, this.box.position.y, this.box.width, this.box.height)
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
            console.log("touching");
            // player.position.x -=2;
            player.velocity.x = 0;
            player.velocity.y = 0;
        }
}
}

class blocks {
    constructor({position , velocity}){
        this.position = position;
        this.velocity = velocity;
        this.height = 100;
        this.width = 100;
    }

    draw() {
        c.fillStyle = "pink";
        c.strokeStyle = "black";
        c.stroke();
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
        // console.log("done");
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

class gun {
    constructor({position,pivote}) {
        this.position = position;
        this.width = 100;
        this.height = 20;
        this.pivote = pivote;
        this.rotationAngle = 0;
    }

    draw(){
        c.save();
        c.translate(this.pivote.x, this.pivote.y)
        c.rotate(this.rotationAngle * Math.PI / 180)
        c.translate(-this.pivote.x, -this.pivote.y);
        c.fillStyle = "green";
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
        c.restore();
        
        bullets.forEach( bullet => {
            bullet.move();
            bullet.draw();

            if (bullet.x < 0 || bullet.x > canvas.width || bullet.y < 0 || bullet.y > canvas.height ) {
                bullets.splice(i, 1);
               }
            else if(collide(bullet)){
                console.log("collide");
                bullets.splice(i, 1);
            }
            
            hit(bullet);
        })
    }

    update() {
        this.draw();
    }
}

class jombie {
    constructor ({position,velocity}) {
        this.position = position;
        this.velocity = velocity;
        // this.speed = 10;
        this.width = 50;
        this.height = 80;
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
                    // j.position.x -= 1;
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

    create() {
        // c.fillStyle = "gray";
        // c.fillRect(this.position.x, this.position.y, this.width, this.height);
        c.drawImage(enemy,this.position.x, this.position.y, this.width, this.height);
    }
    
    move(){
        this.position.x += this.velocity.x;
        if(this.position.y + this.height + this.velocity.y >= canvas.height - 100){
            this.velocity.y = 0;
            } 
        else this.velocity.y += gravity; 
        this.position.y += this.velocity.y;

        if(this.isCollideJombie()){
            console.log("touching jombie");
        }

        this.create();
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
        y: 600
    },
    pivote: {
        x: player.position.x,
        y: 600
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
    window.requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();

    player.update();
    gun1.update();
    box1.update();
    box2.update();
    box3.update();
    box4.update();
    // jombie1.move();
    
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
            console.log ("jombi");
            jom.velocity.x = 0;
            }

        jom.move();
    })

}
    
    
animate();

let interval1 = setInterval(() => {
    jombieArrival();    
}, 5000);
// clearInterval(interval1);




function fireBullet() {
    distance = 45 + gun1.width;
    let angle = gun1.rotationAngle * Math.PI / 180;
    let delX = distance * Math.cos(angle + 0.05);
    let delY = distance * Math.sin(angle + 0.05);
    let bulletX = gun1.pivote.x + delX;
    let bulletY = gun1.pivote.y + delY;
    
    console.log(angle , gun1.rotationAngle);
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
        }
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
            }
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

function jombieCollide(jom) {
    let test1 = 
    (   jom.position.x < box1.position.x + box1.width &&
        jom.position.x + jom.width > box1.position.x &&
        jom.position.y < box1.position.y + box1.height &&
        jom.position.y + jom.height > box1.position.y  
    )
    
    let test2 = 
    (    jom.position.x < box2.position.x + box2.width &&
        jom.position.x + jom.width > box2.position.x &&
        jom.position.y < box2.position.y + box2.height &&
        jom.position.y + jom.height > box2.position.y  
    )

    let test3 = 
    (     jom.position.x < box3.position.x + box3.width &&
          jom.position.x + jom.width > box3.position.x &&
          jom.position.y < box3.position.y + box3.height &&
          jom.position.y + jom.height > box3.position.y  
    )

    let test4 = 
    (    jom.position.x < box3.position.x + box3.width &&
        jom.position.x + jom.width > box3.position.x &&
        jom.position.y < box3.position.y + box3.height &&
        jom.position.y + jom.height > box4.position.y  
    )
    return(test1 || test2 || test3 || test4);
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
        console.log(test);

        if(test){
            bullets.splice(i, 1);
            jombies.splice(jom2,1);
            score++;
            console.log("+1");
            }
    }
}

window.addEventListener("keydown", (event) => {
    switch (event.key) {
        case 'd': 
            keys.d.pressed = true;
            lastKey = "d";
            break
        case 'a':
            keys.a.pressed = true;
            lastKey = "a";
            break
        case 'w':
            keys.w.pressed = true;
            player.velocity.y = -18;
            break
        case 'ArrowLeft':
            gun1.rotationAngle -= 4; 
            break;
        case 'ArrowRight':
            gun1.rotationAngle += 4;
            break;
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

window.addEventListener("click" , fireBullet );