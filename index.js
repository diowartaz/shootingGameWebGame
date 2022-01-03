const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

const scoreHtmlElement = document.querySelector('#score-span');
const livesHtmlElement = document.querySelector('#lives-span');



class Player {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity
    }

    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
        c.stroke();
        c.closePath();
    }

    update() {
        if (pressedKeys["37"]) {
            //left
            this.x = Math.max(this.radius, this.x - this.velocity.x);
        }
        if (pressedKeys["38"]) {
            //up
            this.y = Math.max(this.radius, this.y - this.velocity.y)
        }
        if (pressedKeys["39"]) {
            //right
            this.x = Math.min(canvas.width - this.radius, this.x + this.velocity.x);
        }
        if (pressedKeys["40"]) {
            //down
            this.y = Math.min(canvas.height - this.radius, this.y + this.velocity.y)
        }
    }
}

class Projectile {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.hasToBeDeleted = false;
    }

    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
        // c.stroke();
        // c.closePath();
    }

    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        if (this.x > canvas.width + this.radius ||
            this.x < -this.radius ||
            this.y > canvas.height + this.radius ||
            this.y < -this.radius) {
            this.hasToBeDeleted = true;
        }
    }
}

class Asteroide {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.hasToBeDeleted = false;
    }

    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
        c.stroke();
        c.closePath();

        c.beginPath();
        c.lineWidth = 1
        c.strokeStyle = "white";
        c.arc(this.x + this.radius / 3, this.y + this.radius / 3, this.radius / 6, 0, Math.PI * 2, false);
        c.stroke();
        c.closePath();

        c.beginPath();
        c.lineWidth = 1
        c.strokeStyle = "white";
        c.arc(this.x - this.radius / 2, this.y + this.radius / 7, this.radius / 5, 0, Math.PI * 2, false);
        c.stroke();
        c.closePath();

        c.beginPath();
        c.lineWidth = 1
        c.strokeStyle = "white";
        c.arc(this.x, this.y - this.radius / 2, this.radius / 4, 0, Math.PI * 2, false);
        c.stroke();
        c.closePath();
    }

    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        if (this.x > canvas.width + this.radius ||
            this.x < -this.radius ||
            this.y > canvas.height + this.radius ||
            this.y < -this.radius) {
            this.hasToBeDeleted = true;
        }
    }
}

class Particule {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.alpha = 1;
    }

    draw() {
        c.save();
        c.globalAlpha = this.alpha;
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
        c.restore()
    }

    update() {
        this.velocity.x = this.velocity.x * particuleFriction;
        this.velocity.y = this.velocity.y * particuleFriction;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= 0.01;
    }
}



function onClickFunction(event) {
    const angle = Math.atan2(
        event.clientY - player.y,
        event.clientX - player.x
    )
    const velocity = {
        x: Math.cos(angle) * projectileVelocityFactor,
        y: Math.sin(angle) * projectileVelocityFactor,
    }

    const projectile = new Projectile(player.x, player.y, 5, 'white', velocity);
    projectile.draw();
    projectiles.push(projectile)
}

let setIntervalScoreId;

function addScoreOverTime() {

    setIntervalScoreId = setInterval(() => {
        addScore(1)
    }, 100);
}

let setIntervalSpawnAsteroidesId;

function spawnAsteroides() {
    setIntervalSpawnAsteroidesId = setInterval(() => {
        const radius = Math.random() * (maxRadiusAsteroides - minRadiusAsteroides) + minRadiusAsteroides;
        const color = `hsl(${Math.random() * 360}, 50%, 50%)`


        let x;
        let y;
        let spawnWhere = Math.random();
        if (spawnWhere < 0.25) {
            //spawn up
            x = Math.random() * canvas.width;
            y = 0;

        } else if (spawnWhere < 0.5) {

            //spawn right
            x = canvas.width;
            y = Math.random() * canvas.height;


        } else if (spawnWhere < 0.75) {
            //spawn down
            x = Math.random() * canvas.width;
            y = canvas.height;

        } else {
            //spawn left
            x = 0
            y = Math.random() * canvas.height;
        }

        const angle = Math.atan2(player.y - y, player.x - x);

        const velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle),
        }

        asteroides.push(new Asteroide(x, y, radius, color, velocity));
    }, delayMSBetweenAsteroides)
}


function addScore(nb) {
    score += nb;
    scoreHtmlElement.innerHTML = score;
}

function addLives(nb) {
    lives += nb;
    livesHtmlElement.innerHTML = lives;
}

function createParticules(circle, nb) {
    for (let i = 0; i < nb; i++) {
        particules.push(new Particule(
            circle.x,
            circle.y,
            Math.random() * 2,
            circle.color, {
                x: (Math.random() - 0.5) * 5,
                y: (Math.random() - 0.5) * 5,
            }
        ))
    }
}

function endGame() {
    cancelAnimationFrame(animationId);
    clearInterval(setIntervalScoreId);
    clearInterval(setIntervalSpawnAsteroidesId);
}


let animationId

function animate() {
    animationId = requestAnimationFrame(animate);

    c.fillStyle = "rgba(0, 0, 0, 0.1)"
    c.fillRect(0, 0, canvas.width, canvas.height)

    particules.forEach((particule, particuleIndex) => {
        particule.update();
        particule.draw();

        if (particule.alpha < 0) {
            setTimeout(() => {
                particules.splice(particuleIndex, 1);
            }, 0)
        }
    })

    projectiles.forEach((projectile, projectileIndex) => {
        projectile.update();
        projectile.draw();

        if (projectile.hasToBeDeleted) {
            setTimeout(() => {
                projectiles.splice(projectileIndex, 1);
            }, 0)
        }
    });

    asteroides.forEach((asteroide, asteroideIndex) => {
        asteroide.update();
        asteroide.draw();

        const dist = Math.hypot(player.x - asteroide.x, player.y - asteroide.y);
        if (dist < player.radius + asteroide.radius) { // asteroide and player collide


            setTimeout(() => {
                console.log(asteroides.length)
                asteroides.splice(asteroideIndex, 1);
                console.log(asteroides.length)
            }, 0)

            createParticules(player, player.radius);
            createParticules(asteroide, asteroide.radius);
            addLives(-1);

            if (lives === 0) {
                //the player has lost
                endGame();
            }
        }

        projectiles.forEach((projectile, projectileIndex) => {
            const dist = Math.hypot(projectile.x - asteroide.x, projectile.y - asteroide.y);
            if (dist < projectile.radius + asteroide.radius) { // asteroide and projectile collide
                //we create particules
                createParticules(asteroide, asteroide.radius)

                if (asteroide.radius - minRadiusAsteroides > asteroideRadiusDecrease) {
                    addScore(100)
                        // gsap.to(asteroide, {
                        //     radius: asteroide.radius - asteroideRadiusDecrease
                        // });
                    asteroide.radius -= asteroideRadiusDecrease;
                    setTimeout(() => {
                        projectiles.splice(projectileIndex, 1);
                    }, 0)
                } else {
                    addScore(250)
                    setTimeout(() => {
                        asteroides.splice(asteroideIndex, 1);
                        projectiles.splice(projectileIndex, 1);
                    }, 0)
                }

            }
        });

        if (asteroide.hasToBeDeleted) {
            setTimeout(() => {
                asteroides.splice(asteroideIndex, 1);
            }, 0)
        }

    });

    player.update();
    player.draw();
}

///////////////////////////////////////////
minRadiusAsteroides = 4;
maxRadiusAsteroides = 30
projectileVelocityFactor = 2;
delayMSBetweenAsteroides = 1000;
asteroideRadiusDecrease = 10;
particuleFriction = 0.98;

score = 0;
lives = 50;


addEventListener('click', onClickFunction)

var pressedKeys = {};
window.onkeyup = function(e) { pressedKeys[e.keyCode] = false; }
window.onkeydown = function(e) { pressedKeys[e.keyCode] = true; }

const x = canvas.width / 2;
const y = canvas.height / 2;

const player = new Player(x, y, 10, 'white', { x: 1, y: 1 });
player.draw();

projectiles = [];
asteroides = [];
particules = [];

spawnAsteroides();
addScoreOverTime();
animate();