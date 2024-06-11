console.log("Code Run");

let canvas = document.querySelector("canvas");

canvas.width = window.innerWidth -7.1;
canvas.height = window.innerHeight -7.1;

let c = canvas.getContext("2d");
let gravity = 0.5;

// let height=150;
class character {
    constructor({position , velocity}){
        this.position = position;
        this.velocity = velocity;
        this.height = 150;
        this.lastKey;
        this.box = {
            position: this.position,
            width: 100,
            height: 50
        }
    }

    draw() {
        c.fillStyle = "red";
        c.fillRect(this.position.x , this.position.y ,50 , this.height)
        // c.fillStyle = "green"
        c.fillRect(this.box.position.x, this.box.position.y, this.box.width, this.box.height)
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
    constructor({position}) {
        this.position = position;
        this.width = 100;
        this.height = 20;
    }

    draw(){
        c.fillStyle = "green";
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    update() {
        this.draw();
        // this.position.x += this.velocity.x;
        // this.position.y += this.velocity.y;
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
    }
})

const box1 = new blocks ({
    position: {
        x: player.position.x + 200,
        y: 0 
    },
    velocity: {
        x: player.velocity.x,
        y: player.velocity.y
    }
})
const box2 = new blocks ({
    position: {
        x: player.position.x + 220,
        y: -200
    },
    velocity: {
        x: player.velocity.x,
        y: player.velocity.y
    }
})
const box3 = new blocks ({
    position: {
        x: player.position.x - 200,
        y: 0 
    },
    velocity: {
        x: player.velocity.x,
        y: player.velocity.y
    }
})
const box4 = new blocks ({
    position: {
        x: player.position.x - 220,
        y: -200
    },
    velocity: {
        x: player.velocity.x,
        y: player.velocity.y
    }
})

const enemy = new character({
    position: {
    x: 400,
    y: 100
    },
    velocity: {
        x: 0,
        y: 0
    }
})

// enemy.draw();
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
    console.log("working");
    // c.fillStyle = "wheat";
    // c.fillRect(0 , 0, canvas.width, canvas.height);
    c.clearRect(0, 0, canvas.width, canvas.height);
    player.update();
    gun1.update();
    box1.update();
    box2.update();
    box3.update();
    box4.update();
    // enemy.update();
    
    player.velocity.x = 0;

    if (keys.a.pressed && lastKey == "a") {
        player.velocity.x = -5;
    }
    else if (keys.d.pressed && lastKey == "d") {
        player.velocity.x = 5;
        }
    }
    
    
animate();

window.addEventListener("keydown", (event) => {
    switch (event.key) {
        case 'd': 
            keys.d.pressed = true;
            console.log("call");
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
    }
})

window.addEventListener("keyup", (event) => {
    console.log("haaaa");
    switch (event.key) {
        case 'd':
            keys.d.pressed = false;
            console.log("Hiiiiii");
            player.velocity.x = 0; 
            break
        case 'a':
            keys.a.pressed = false;
            player.velocity.x = 0;
            break;
    } 
})