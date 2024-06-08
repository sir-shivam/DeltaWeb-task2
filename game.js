console.log("Code Run");

let canvas = document.querySelector("canvas");

canvas.width = window.innerWidth -7.1;
canvas.height = window.innerHeight -7.1;

let c = canvas.getContext("2d");

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
        this.position.y += this.velocity.y;

        if(this.position.y + this.height + this.velocity.y >= canvas.height){
            this.velocity.y = 0;
        }
    }
}

const player = new character({
    position: {
    x: 0,
    y: 0
    },
    velocity: {
        x: 0,
        y: 10
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
        y: 5
    }
})

// enemy.draw();

function animate (){
    window.requestAnimationFrame(animate);
    console.log("working");
    // c.fillStyle = "wheat";
    // c.fillRect(0 , 0, canvas.width, canvas.height);
    c.clearRect(0, 0, canvas.width, canvas.height);
    player.update();
    enemy.update();
}

animate();