// Cancas

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

// Game

let frameCount = 0;
let endCount;
let score = 0;
let lives = 3;

// Paddle

const paddle = new function() {
    this.startingWidth = 80;
    this.height = 10;
    this.width = this.startingWidth;
    this.x = (canvas.width - this.width)/2;
    this.y = canvas.height - 20;
    this.prevX = this.x;
};
let rightPressed = false;
let leftPressed = false;

// Balls

class Ball {
    constructor(x, y, dx, dy) {
        this.id = ballsCount;
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        ballsCount++;
    }
}

let ballsCount = 0;
let balls = [];
let ballsRadius = 5;
let ballsSpeed = 1.5;
const startingBall = new Ball(canvas.width/2, paddle.y - ballsRadius, -Math.cos(Math.PI/6) * ballsSpeed, - Math.sin(Math.PI/6) * ballsSpeed);
balls.push(startingBall);

// Bricks

class Brick {
    constructor(x, y, width, height, motionFunction, countOffset) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.motionFunction = motionFunction;
        this.countOffset = countOffset;
        this.status = 1;
        bricks.push(this);
    }
}

const bricks = [];
new Brick(140, 90, 10, 30, slideRectangularVertical, 0);
new Brick(120, 150, 10, 30, slideRectangularVertical, 200);
new Brick(350, 90, 10, 30, slideRectangularVertical, 0);
new Brick(330, 150, 10, 30, slideRectangularVertical, 200);
new Brick(150, 140, 30, 10, slideRectangularHorizontal, 0);
new Brick(90, 120, 30, 10, slideRectangularHorizontal, 200);
new Brick(360, 140, 30, 10, slideRectangularHorizontal, 0);
new Brick(300, 120, 30, 10, slideRectangularHorizontal, 200);

// Motion Functions

function slideRectangularVertical(countOffset = 0) {
    const motionCount = (frameCount + countOffset) % 400;
    if (motionCount < 100) {
        this.x -= 0.2
    } else if (motionCount < 200) {
        this.y += 0.6
    } else if (motionCount < 300) {
        this.x += 0.2
    } else if (motionCount < 400) {
        this.y -= 0.6
    }
}
function slideRectangularHorizontal(countOffset = 0) {
    const motionCount = (frameCount + countOffset) % 400;
    if (motionCount < 100) {
        this.x -= 0.6
    } else if (motionCount < 200) {
        this.y -= 0.2
    } else if (motionCount < 300) {
        this.x += 0.6
    } else if (motionCount < 400) {
        this.y += 0.2
    }
}

//Power Up Types

class PowerUpType {
    constructor(imageSource, effect, reset) {
        this.image = new Image();
        this.image.src = imageSource;
        this.effect = effect;
        this.reset = reset;
        powerUpTypes.push(this);
    }
}

const powerUpTypes = [];
new PowerUpType('images/Widen.png', widenPaddle, () => paddle.width = paddle.startingWidth);
new PowerUpType('images/Breakthrough.png', breakThroughBlocks, () => breakthrough = false);
new PowerUpType('images/Double.png', doubleBalls);

// Power Up Effects

function widenPaddle() {
    if (paddle.width * 1.4 >= canvas.width) {
        paddle.x = 0;
        paddle.width = canvas.width;
    } else if (paddle.x < paddle.width * 0.2) {
        paddle.x = 0;
        paddle.width *= 1.4;
    } else if (paddle.x + paddle.width * 1.4 > canvas.width) {
        paddle.x = canvas.width - paddle.width * 1.4;
        paddle.width *= 1.4;
    } else {
        paddle.x -= paddle.width * 0.2;
        paddle.width *= 1.4;
    }
}

let breakthrough = false;

function breakThroughBlocks() {
    breakthrough = true;
}
function doubleBalls() {
    const newBalls = [];
        balls.forEach((ball) => {
            console.log(Math.atan(ball.dy / ball.dx)/Math.PI * 180);
            // prevent very low dy
            const originalAngle = Math.atan(ball.dy/ball.dx)
            if (Math.abs(originalAngle) > Math.PI * 0.2 && Math.abs(originalAngle) < Math.PI * 0.3) {
                const adjustTo =  Math.PI * (0.25 + 0.05 * (Math.sign(Math.abs(originalAngle) - Math.abs(Math.PI * 0.25)))) 
                adjustmentAngle = - originalAngle + Math.sign(originalAngle) * adjustTo;
                const dxNew = Math.cos(adjustmentAngle) * ball.dx - Math.sin(adjustmentAngle) * ball.dy;
                const dyNew = Math.sin(adjustmentAngle) * ball.dx + Math.cos(adjustmentAngle) * ball.dy;
                ball.dx = dxNew;
                ball.dy = dyNew;
                console.log('1')
                console.log(adjustmentAngle/Math.PI * 180)
                console.log(Math.atan(ball.dy / ball.dx)/Math.PI * 180);
            }
            newBalls.push(new Ball(ball.x, ball.y, Math.cos(Math.PI/4) * ball.dx - Math.sin(Math.PI/4) * ball.dy, Math.sin(Math.PI/4) * ball.dx + Math.cos(Math.PI/4) * ball.dy));
            newBalls.push(new Ball(ball.x, ball.y, Math.cos(-Math.PI/4) * ball.dx - Math.sin(-Math.PI/4) * ball.dy, Math.sin(-Math.PI/4) * ball.dx + Math.cos(-Math.PI/4) * ball.dy));
            balls = balls.filter((ball) => ball.id !== ball.id);
            newBalls.forEach(ball => console.log(Math.atan(ball.dy / ball.dx)/Math.PI * 180, 'n'));
        });
    balls = newBalls;
}

// Power Ups

class PowerUp {
    constructor(x, y, type) {
        this.id = powerUpCount;
        this.x = x;
        this.y = y;
        this.image = type.image;
        this.effect = type.effect;
        powerUps.push(this);
        powerUpCount++;
    }
}

let powerUpSize = 20;
let powerUpCount = 0;
let powerUpProbability = 1;
let powerUps = [];

// CollisionTypes

class CollisionType {
    constructor(condition, directionChange, typeLists) {
        this.condition = condition;
        this.directionChange = directionChange;
        typeLists.forEach((list) => {list.push(this)});
    }
}

const bricksCollisionTypes = [];
const paddleCollisionTypes = [];

new CollisionType(
    (ball, object) => {return ball.x > object.x && ball.x < object.x + object.width && ball.y < object.y && ball.y > object.y - ballsRadius || ball.x > object.x && ball.x < object.x + object.width && ball.y > object.y + object.height && ball.y < object.y + object.height + ballsRadius},
    (ball) => {ball.dy = -ball.dy;},
    [bricksCollisionTypes]);
new CollisionType((ball, object) => {
    return ball.y > object.y && ball.y < object.y + object.height && ball.x < object.x && ball.x > object.x - ballsRadius || ball.y > object.y && ball.y < object.y + object.height && ball.x > object.x + object.width && ball.x < object.x + object.width + ballsRadius},
    (ball) => {ball.dx = -ball.dx;},
    [bricksCollisionTypes, paddleCollisionTypes]);
new CollisionType((ball, object) => {
    return Math.pow(ball.x - object.x, 2) + Math.pow(ball.y - object.y, 2) < Math.pow(ballsRadius, 2)},
    (ball) => {
        ball.dx = -Math.abs(ball.dx);
        ball.dy = -Math.abs(ball.dy);},
    [bricksCollisionTypes]);
new CollisionType(
    (ball, object) => {return Math.pow(ball.x - (object.x + object.width), 2) + Math.pow(ball.y - object.y, 2) < Math.pow(ballsRadius, 2)},
    (ball) => {
        ball.dx = Math.abs(ball.dx);
        ball.dy = -Math.abs(ball.dy);},
    [bricksCollisionTypes]);
new CollisionType(
    (ball, object) => {return Math.pow(ball.x - object.x, 2) + Math.pow(ball.y - (object.y + object.height), 2) < Math.pow(ballsRadius, 2)},
    (ball) => {
        ball.dx = -Math.abs(ball.dx);
        ball.dy = Math.abs(ball.dy);},
        [bricksCollisionTypes, paddleCollisionTypes]);
new CollisionType(
    (ball, object) => {return Math.pow(ball.x - (object.x + object.width), 2) + Math.pow(ball.y - (object.y + object.height), 2) < Math.pow(ballsRadius, 2)},
    (ball) => {
        ball.dx = Math.abs(ball.dx);
        ball.dy = Math.abs(ball.dy);},
    [bricksCollisionTypes, paddleCollisionTypes]);
new CollisionType(
    (ball, object) => {return ball.y > object.y - ballsRadius && ball.y < object.y && ball.x > object.x && ball.x < object.x + object.width},
    (ball, object) => {
        let hitLocation = (ball.x - object.x) / object.width;
        // prevent very low dy
        adjustedHitLocation = hitLocation / 5 * 4.5 + 0.05;
        ball.dx = -Math.cos(Math.PI * adjustedHitLocation) * ballsSpeed;
        ball.dy = -Math.sin(Math.PI * adjustedHitLocation) * ballsSpeed;},
    [paddleCollisionTypes]);
new CollisionType(
    (ball, object) => {return Math.pow(ball.x - object.x, 2) + Math.pow(ball.y - object.y, 2) < Math.pow(ballsRadius, 2)},
    (ball) => {
        ball.dx = -Math.cos(Math.PI * 0.05) * ballsSpeed;
        ball.dy = -Math.sin(Math.PI * 0.05) * ballsSpeed;},
    [paddleCollisionTypes]);
new CollisionType(
    (ball, object) => {return Math.pow(ball.x - (object.x + object.width), 2) + Math.pow(ball.y - object.y, 2) < Math.pow(ballsRadius, 2)},
    (ball) => {
        ball.dx = -Math.cos(Math.PI * 0.95) * ballsSpeed;
        ball.dy = -Math.sin(Math.PI * 0.95) * ballsSpeed;},
    [paddleCollisionTypes]);


// Event Handlers

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);
function mouseMoveHandler(e) {
    // move paddle using mouse
    const relativeX = e.clientX - canvas.offsetLeft;
    const prevX = paddle.x;
    if (relativeX - paddle.width / 2 > 0 && relativeX + paddle.width / 2 < canvas.width) {
        paddle.x = relativeX - paddle.width / 2;
    } else if (relativeX - paddle.width / 2 < 0){
        paddle.x = 0;
    } else if (relativeX + paddle.width / 2 > canvas.width) {
        paddle.x = canvas.width - paddle.width;
    }
    if (paddle.x !== prevX) {
        
    }
}
function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}
function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

nextFrame();

function nextFrame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    draw();
    move();
    collisionDetection();

    frameCount++;
    if (!(frameCount === endCount)) {
        requestAnimationFrame(nextFrame);
    } else {
        if (lives < 1) {
            drawLose();
        } else if (score >= bricks.length) {
            drawWin();
        }
    }
}

// Draw

function draw() {
    drawBricks();
    drawScore();
    drawLives();
    drawPowerUps();
    drawPaddle();
    drawBalls();
}
function drawBricks() {
    for (i = 0; i < bricks.length; i++) {
      const brick = bricks[i];
      if (brick.status) {
        ctx.beginPath();
        ctx.rect(brick.x, brick.y, brick.width, brick.height);
        ctx.fillStyle = "#2020D0";
        ctx.fill();
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 2;
        ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);
        ctx.closePath();
        }
    }
}
function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#000000";
    ctx.fillText(`Score: ${score}`, 8, 20);
}
function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#000000";
    ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
}
function drawPowerUps() {
    powerUps.forEach((p)=> ctx.drawImage(p.image, p.x, p.y));
}
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.fillStyle = "#20D020";
    ctx.fill();
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.closePath();
}
function drawBalls() {
    balls.forEach((ball => {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ballsRadius, 0, Math.PI*2);
        if (breakthrough) {
        ctx.fillStyle = "#FF0000";
        } else {
        ctx.fillStyle = "#000000";
        }
        ctx.fill();
        ctx.closePath();
    }))
}

// Move

function move(){
    moveBricks();
    movePowerUps();
    moveBalls();
    movePaddle();
}
function moveBricks() {
    bricks.forEach((brick) => brick.motionFunction(brick.countOffset));
}
function movePowerUps() {
    powerUps.forEach((powerUp) => {
        powerUp.y += 1;
        if (powerUp.y > canvas.height -20) {
            powerUps = powerUps.filter((p) => p.id !== powerUp.id);
        }
    });
}
function moveBalls() {
    balls.forEach(ball => {
        if(ball.x + ball.dx > canvas.width-ballsRadius || ball.x + ball.dx < ballsRadius) {
            ball.dx = -ball.dx;
        }
        if (ball.y + ball.dy < ballsRadius) {
            ball.dy = -ball.dy;
        } else if (ball.y + ball.dy > canvas.height - ballsRadius) {
            balls = balls.filter((b) => b.id !== ball.id);
            if (balls.length <= 0) {
                lives--;
                if (lives === 0) {
                    endCount = frameCount + 2;
                } else {
                    if(lives > 0){
                        resetPowerUpEffects();
                        balls.push(new Ball(canvas.width / 2, canvas.height - 30, 1, -1));
                        paddle.x = (canvas.width - paddle.width) / 2;
                    }
                }
            }
        }
        ball.x += ball.dx;
        ball.y += ball.dy;
    })
}
function resetPowerUpEffects() {
    powerUpTypes.forEach((powerUpType) => {console.log(powerUpType.reset)
        powerUpType.reset?.()})
}
function movePaddle() {
    if (rightPressed && leftPressed) {

    } else if (rightPressed) {
        paddle.x += 7;
        if (paddle.x + paddle.width > canvas.width){
            paddle.x = canvas.width - paddle.width;
        }
    }
    else if (leftPressed) {
        paddle.x -= 7;
        if (paddle.x < 0) {
            paddle.x = 0;
        }
    }
}

// Collision Detection

function collisionDetection() {
    balls.forEach((ball) => {
        hitBricks(ball);
        hitPaddle(ball);
    })
    // dragAlong();
    catchPowerUps();
}
function hitBricks(ball) {
    bricks.forEach((brick) => {
        if (brick.status) {
            if (ball.x > brick.x - ballsRadius && ball.x < brick.x + brick.width + ballsRadius && ball.y > ball.y -ballsRadius && ball.y < brick.y + brick.height + ballsRadius) {
                for (const collisionType of bricksCollisionTypes) {
                    if (collisionType.condition(ball, brick)) {
                        if (!breakthrough) {
                            collisionType.directionChange(ball);
                        }
                        destroyBrick(brick);
                        break;
                    }
                }
            }
        }
    })
}
function destroyBrick(b) {
    b.status = 0;
    score++;
    if (score === bricks.length) {
        endCount = frameCount + 2;
    } else if (Math.random() < powerUpProbability) {
        type = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
        new PowerUp(b.x + b.width/2 - powerUpSize/2, b.y + b.height/2 - powerUpSize/2, type);
    }
}
function hitPaddle(ball) {
    if (ball.y > paddle.y - ballsRadius && ball.x > paddle.x - ballsRadius && ball.x < paddle.x + paddle.width + ballsRadius) {
        for (const collisionType of paddleCollisionTypes) {
            if (collisionType.condition(ball, paddle)) {
                collisionType.directionChange(ball, paddle);
                break;
            }
        }
    }
}
// function dragAlong() {
//     if (paddle.prevX !== paddle.x) {
//         console.log()
//         balls.forEach((ball) => {
//             if (ball.y > paddle.y - ballsRadius && ball.y < paddle.y + paddle.height + ballsRadius) {
//                 if (ball.x > paddle.x - ballsRadius && ball.x < paddle.prevX + paddle.width + ballsRadius) {
//                     ball.x = paddle.x - ballsRadius;
//                     console.log(1);
//                 } else if (ball.x < paddle.x + paddle.width + ballsRadius && ball.x > paddle.prevX - ballsRadius) {
//                     ball.x = paddle.x + paddle.width. ballsRadius;
//                     console.log(2);
//                 }
//             }
//         })
//     }
//     paddle.prevX = paddle.x;
// }
function catchPowerUps() {
    powerUps.forEach((powerUp) => {
        if (powerUp.y > paddle.y - powerUpSize && powerUp.x > paddle.x - powerUpSize && powerUp.x < paddle.width + paddle.x) {
            powerUp.effect();
            powerUps = powerUps.filter((p) => p.id !== powerUp.id);
        }
    });
}

// Messages

function drawLose() {
    ctx.font = "32px Arial";
    ctx.fillStyle = "#D02020";
    ctx.fillText('GAME OVER', 150, 150);
}
function drawWin() {
    ctx.font = "28px Arial";
    ctx.fillStyle = "#2020D0";
    ctx.fillText("YOU WIN, CONGRATULATIONS!", 30, 150);
}

