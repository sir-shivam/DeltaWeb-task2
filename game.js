console.log("Code Run");

let canvas = document.querySelector("canvas");

canvas.width = window.innerWidth -7.1;
canvas.height = window.innerHeight -7.1;

let c = canvas.getContext("2d");
let gravity = 0.999;
let bullets = [];
let jombies = [];
// let height=150;
class character {
    constructor({position , velocity}){
        this.position = position;
        this.velocity = velocity;
        this.height = 150;
        this.width = 50;
        this.lastKey;
        // this.box = {
        //     position: this.position,
        //     width: 100,
        //     height: 50
        // }
    }

    draw() {
        c.fillStyle = "red";
        c.fillRect(this.position.x , this.position.y ,this.width, this.height)
        // c.fillStyle = "green"
        // c.fillRect(this.box.position.x, this.box.position.y, this.box.width, this.box.height)
    }

    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if(this.position.y + this.height + this.velocity.y >= canvas.height){
            this.velocity.y = 0;
        } 
        else this.velocity.y += gravity; 
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
        if(this.position.y + this.height + this.velocity.y >= canvas.height){
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

            if (bullet.x < 0 || bullet.x > canvas.width || bullet.y < 0 || bullet.y > canvas.height) {
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

    create() {
        c.fillStyle = "gray";
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
    
    move(){
        this.position.x += this.velocity.x;
        if(this.position.y + this.height + this.velocity.y >= canvas.height){
            this.velocity.y = 0;
            } 
        else this.velocity.y += gravity; 
        this.position.y += this.velocity.y;

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
        this.dx = Math.cos(angle) * 26;
        this.dy = Math.sin(angle) * 26;
    }

    move() {
        this.x += this.dx;
        this.y += this.dy;
        if(this.y <= canvas.height){
            this.dy += gravity;
        } 
    }


    draw() {
        c.fillStyle = 'black';
        c.fillRect(this.x - 2, this.y - 2, 4, 4);
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

    if (playerCollide()){
        console.log("touch");
        // player.position.x = player.position.x;
        player.velocity.y =0;
        player.velocity.x = 0;
    }

    jombies.forEach(jom => {
        if(jombieCollide(jom)){
            console.log ("jombi");
            jom.velocity.x = 0;
            }

        if(collideBetween(jom)){
            jom.velocity.x = 0;
        }
        jom.move();
    })

}
    
    
animate();

let interval1 = setInterval(() => {
    jombieArrival();    
}, 5000);




function fireBullet() {
    distance = 45 + gun1.width;
    let angle = gun1.rotationAngle * Math.PI / 180;
    let delX = distance * Math.cos(angle);
    let delY = distance * Math.sin(angle);
    let bulletX = gun1.pivote.x + delX;
    let bulletY = gun1.pivote.y + delY;
    
    console.log(angle , gun1.rotationAngle);
    bullets.push(new bullet(bulletX, bulletY, angle))
}

function jombieArrival(){
    if(Math.random()*10 > 5){
    jombies.push(new jombie ({
        position:{
            x: numBtw(-200 , 200),
            y: numBtw(0,500),
        },
        velocity:{
            x: 0.1,
            y: 0
        }
    }))
    }

    else {
        jombies.push(new jombie ({
            position:{
                x: numBtw(1200,1300) ,
                y: numBtw(0,500),
            },
            velocity:{
                x: -1,
                y: 0
            }
        }))
    }
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

function playerCollide() {
    let test1 = 
    (   player.position.x + player.width >= box1.position.x &&
        player.position.x + player.width <= box1.position.x + box1.width &&
        player.position.y + player.height >= box1.position.y &&
        player.position.y + player.height <= box1.position.y + box1.height
    )
    
    let test2 = 
    (   player.position.x + player.width >= box2.position.x &&
        player.position.x + player.width <= box2.position.x + box2.width &&
        player.position.y + player.height >= box2.position.y &&
        player.position.y + player.height <= box2.position.y + box2.height   
    )

    let test3 = 
    (   player.position.x  >= box3.position.x &&
        player.position.x  <= box3.position.x + box3.width &&
        player.position.y + player.height >= box3.position.y &&
        player.position.y + player.height <= box3.position.y + box3.height    
    )

    let test4 = 
    (   player.position.x  >= box4.position.x &&
        player.position.x  <= box4.position.x + box4.width &&
        player.position.y + player.height >= box4.position.y &&
        player.position.y + player.height <= box4.position.y + box4.height    
    )
    return(test1 || test2 || test3 || test4);
}

function jombieCollide(jom) {
    let test1 = 
    (   jom.position.x  >= box1.position.x &&
        jom.position.x  <= box1.position.x + box1.width &&
        jom.position.y + jom.height >= box1.position.y &&
        jom.position.y + jom.height <= box1.position.y + box1.height
    )
    
    let test2 = 
    (   jom.position.x  >= box2.position.x &&
        jom.position.x  <= box2.position.x + box2.width &&
        jom.position.y + jom.height >= box2.position.y &&
        jom.position.y + jom.height <= box2.position.y + box2.height   
    )

    let test3 = 
    (   jom.position.x + jom.width  >= box3.position.x &&
        jom.position.x + jom.width <= box3.position.x + box3.width &&
        jom.position.y  >= box3.position.y //&&
        // jombie1.position.y + jombie1.height <= box3.position.y + box3.height    
    )

    let test4 = 
    (   jom.position.x  + jom.width >= box4.position.x &&
        jom.position.x  + jom.width <= box4.position.x + box4.width &&
        jom.position.y + jom.height >= box4.position.y &&
        jom.position.y + jom.height <= box4.position.y + box4.height
    )
    return(test1 || test2 || test3 || test4);
}

function collideBetween(jom) {
    let test1;
        jombies.forEach(jom1 => {
        test1 = (
        jom.position.x >= jom1.position.x &&
        jom.position.x  + jom.width <= jom1.position.x + jom1.width &&
        jom.position.y >= jom1.position.y &&
        jom.position.y + jom.height <= jom1.position.y + jom1.height)

        if(test1){
            return(test1);
        }
    })
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
            // console.log("return",bullet);
            bullets.splice(i, 1);
            jombies.splice(jom2,1);
        // return(test);
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