class Simulation {
    constructor(canvas, friction) {
        this.ctx = canvas.getContext("2d");
        this.ctx.canvas.width = window.innerWidth;
        this.ctx.canvas.height = window.innerHeight;
        this.friction = friction;

        this.items = [];
    }

    createItems(amount, mass, speed, color) {
        for (let i = 0; i < amount; i++)
            this.items.push(new PhysicsObject(random(0, this.ctx.canvas.width), random(0, this.ctx.canvas.height), speed, mass, color))
    }

    render() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width,  this.ctx.canvas.height);
        this.items.forEach(item => {
            this.ctx.beginPath();
            this.ctx.arc(item.x, item.y, 5, 0, 2 * Math.PI);
            this.ctx.fillStyle = item.color;
            this.ctx.fill();
        })
    }

    tick() {
        this.items.forEach(object => {
            this.items.forEach(attractedObject => {
                if (object === attractedObject) return;
                const diffX = object.x - attractedObject.x;
                const diffY = object.y - attractedObject.y;
                const distance = Math.sqrt(diffX * diffX + diffY * diffY);
                const dirX = diffX / distance;
                const dirY = diffY / distance;

                attractedObject.velX += dirX * attractedObject.speed * attractedObject.mass;
                attractedObject.velY += dirY * attractedObject.speed * attractedObject.mass;

                if (attractedObject.velY > this.ctx.canvas.height) attractedObject.velY *= -1;
                if (attractedObject.velX > this.ctx.canvas.width) attractedObject.velX *= -1;
                if (attractedObject.velY < 0) attractedObject.velY *= -1;
                if (attractedObject.velX < 0) attractedObject.velY *= -1;
            });
        });

        this.items.forEach(object => {
            object.x += object.velX;
            object.y += object.velY;

            object.velX -= object.velX < 0 ? -this.friction : this.friction;
            object.velY -= object.velY < 0 ? -this.friction : this.friction;
        })
    }
}

class PhysicsObject {
    constructor(x, y, speed, mass, color) {
        this.mass = mass;
        this.x = x;
        this.y = y;
        this.color = color;
        this.speed = speed;
        this.velX = 0;
        this.velY = 0;
    }
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function startSimulation() {
    const canvas = document.getElementById("canvas");

    const simulation = new Simulation(canvas, 0.1);
    simulation.createItems(2, 1, 1,"blue");
    simulation.createItems(10, 2.5,0.5,"red");
    simulation.createItems(7, 10,1.5,"green");

    setInterval(() => {
        simulation.tick();
        simulation.render();
    }, 100);
}