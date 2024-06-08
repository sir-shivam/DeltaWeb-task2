console.log("Code Run");

let canvas = document.querySelector("canvas");

canvas.width = window.innerWidth -7.1;
canvas.height = window.innerHeight -7.1;

let lastKey;
let c = canvas.getContext("2d");
let gravity = 0.2;

// let height=150;
class character {
    constructor({position , velocity}){
        this.position = position;
        this.velocity = velocity;
        this.height = 150;
    }

    draw() {
        c.fillStyle = "red";
        c.fillRect(this.position.x , this.position.y ,50 , this.height)
    }

    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if(this.position.y + this.height + this.velocity.y >= canvas.height){
            this.velocity.y = 0;
        } else this.velocity.y += gravity; 
    }
}

const player = new character({
    position: {
    x: 0,
    y: 0
    },
    velocity: {
        x: 0,
        y: 0
    }
})

// player.draw();

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
    enemy.update();

    player.velocity.x = 0;

    if (keys.a.pressed && lastKey == "a") {
        player.velocity.x = -1;
    }
    else if (keys.d.pressed && lastKey == "d") {
        player.velocity.x = 1;
    }
}

animate();

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
            lastKey = "w";
            break
    }
})

window.addEventListener("keyup", (event) => {
    switch (event.key) {
        case 'd':
            // keys.d.pressed = false; 
            break
        case 'a':
            // keys.a.pressed = false;
            break;
    } 
})