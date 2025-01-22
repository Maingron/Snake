if(!data) {
    var data = d = {};
}


var snake = data["snake"] = {};
var ctx;

snake.data = {
    tick: {
        count: 0
    }
};
snake.meta = {};

snake.elements = {
    canvas: document.getElementById("snakecanvas"),
    coords: document.getElementById("coords")
};

async function initOnce() {
    snake.config = new Config().config;

    snake.elements.canvas.height = snake.config.canvasHeight;
    snake.elements.canvas.width = snake.config.canvasWidth;

    ctx = snake.data.ctx = snake.elements.canvas.getContext("2d");
    ctx.fillStyle = "#fff";
    ctx.font = snake.config.fontSize + "px " + snake.config.fontFamily;
    snake.elements.canvas.style.backgroundSize = (snake.config.canvasHeight / snake.config.fieldHeight + "px");

    snake.data = {
        ...snake.data,
        controls: {},
        spritesheet: new Image(),
        fruits: [],
        player: {
            pause: 1
        }
    };
    snake.data.spritesheet.src = "spritesheet.png";

    applyCSS();

    window.addEventListener("keypress",function(e) {
        let inputKey = e.key.toLowerCase();
        if(snake.data.player.pause) {
            snake.data.player.controlblock = false;
        }

        if(!snake.data.player.controlblock) {
            if(inputKey == "w") {
                if(snake.data.player.direction != "down") {
                    snake.data.player.direction = "up";
                }
            } else if (inputKey == "s") {
                if(snake.data.player.direction != "up") {
                    snake.data.player.direction = "down";
                }
            } else if (inputKey == "a") {
                if(snake.data.player.direction != "right") {
                    snake.data.player.direction = "left";
                }
            } else if (inputKey == "d") {
                if(snake.data.player.direction != "left") {
                    snake.data.player.direction = "right";
                }
            } else if (inputKey == "r") {
                startGame();
            }
        }
        snake.data.player.controlblock = true;
    });

    window.setInterval(function() {
        tick();
    },(1000 / snake.config.tps));


    window.getLocaleString = await Langfun(snake.config.lang).then(langfun => {
        return langfun.getLang;
    });

    ctx.fillText(getLocaleString("pressToStart"),100,140);
}

function startGame() {
    snake.data.fruits = [];
    snake.data.player = {
        x: 0,
        y: 0,
        direction: "right",
        controlblock: false,
        pause: 0,
        positions: [[0,0],[0,0],[0,0]], // [[x,y],[x,y],[x,y],...]
        points: 0
    };

    snake.meta.author = "maingron";
    snake.meta.website = "https://maingron.com/snake";

    snake.data.player.initialLength = snake.data.player.positions.length + 1; // Initial length, used for some calculations like scoreboard

    snake.data.fruits.push(new Fruit.Apple());
    snake.data.fruits[0]?.getEaten();
}

function tick() {
    snake.data.tick.count++;
    renderTPS();
    renderFPS();
}

function numHex(s) {
    s = Math.round(s);
    var a = s.toString(16);
    if ((a.length % 2) > 0) {
        a = "0" + a;
    }
    return a;
}

function renderFPS() {
    if(snake.data.player.pause == 1) {
        return false;
    }

    ctx.clearRect(0,0,snake.config.canvasWidth,snake.config.canvasHeight);

    // // Scoreboard
    // ctx.drawImage(snake.data.spritesheet, 0, 128, 128, 128, 5, 5, 24, 24); // Apple
    ctx.font = snake.config.fontSize * 4 + "px " + snake.config.fontFamily // Font for scoreboard is bigger than default
    ctx.fillText(snake.data.player.points, snake.config.canvasHeight / 2 - ctx.measureText(snake.data.player.points).width / 2, snake.config.canvasHeight / 2);


    // Set font
    ctx.font = snake.config.fontSize + "px " + snake.config.fontFamily;

    ctx.fillStyle = "#fff";
    for(var i = 0; i < snake.data.player.positions.length; i++) {
        var currentGradient = numHex((256 / snake.data.player.positions.length * i));
        var currentGradient2 = numHex((128 / snake.data.player.positions.length * i));

        ctx.fillStyle="#"+"00"+currentGradient2+currentGradient;

        ctx.fillRect(snake.data.player.positions[i][0] * snake.config.oneWidth, snake.data.player.positions[i][1] * snake.config.oneHeight, snake.config.oneWidth, snake.config.oneHeight);

        if(i == snake.data.player.positions.length - 1) { // Head
            // draw sprite
            ctx.drawImage(snake.data.spritesheet, 128, 128, 128, 128, snake.data.player.positions[i][0] * snake.config.oneWidth, snake.data.player.positions[i][1] * snake.config.oneHeight, snake.config.oneWidth, snake.config.oneHeight);
        }
    }


    ctx.fillStyle = "#f00";

    for(let fruit of snake.data.fruits) {
        ctx.drawImage(snake.data.spritesheet, 0, 129, 128, 128, fruit.pos[0] * snake.config.oneWidth, fruit.pos[1] * snake.config.oneHeight, snake.config.oneWidth, snake.config.oneHeight);
    }

    ctx.fillStyle = "#fff";
    ctx.fillText(snake.data.player.x + "; " + snake.data.player.y, 5, snake.config.canvasHeight - 5);
}

function renderTPS() {
    var moveThisTick = false;
    if(snake?.data?.player?.pause || !snake?.data?.player?.positions) {
        return false;
    }

    snake.data.player.points = (snake.data.player.positions.length - snake.data.player.initialLength) + 1;

    if(snake.data.tick.count % snake.config.movespeed == 0) {
        let nextPosition = [snake.data.player.x, snake.data.player.y];
        moveThisTick = true;

        if(snake.data.player.direction == "up") {
            if(snake.config.wrapField && snake.data.player.y == 0) {
                nextPosition[1] = snake.config.fieldHeight - 1;
            } else {
                nextPosition[1]--;
            }
    
        } else if(snake.data.player.direction == "down") {
            if(snake.config.wrapField && snake.data.player.y == snake.config.fieldHeight - 1) {
                nextPosition[1] = 0;
            } else {
                nextPosition[1]++;
            }
    
        } else if(snake.data.player.direction == "left") {
            if(snake.config.wrapField && snake.data.player.x == 0) {
                nextPosition[0] = snake.config.fieldWidth - 1;
            } else {
                nextPosition[0]--;
            }
    
        } else if(snake.data.player.direction == "right") {
            if(snake.config.wrapField && snake.data.player.x == snake.config.fieldWidth - 1) {
                nextPosition[0] = 0;
            } else {
                nextPosition[0]++;
            }
        }

        if(nextPosition[0] != snake.data.player.positions[snake.data.player.positions.length - 2][0] || nextPosition[1] != snake.data.player.positions[snake.data.player.positions.length - 2][1]) {
            snake.data.player.x = nextPosition[0];
            snake.data.player.y = nextPosition[1];
            snake.data.player.positions.shift();
            snake.data.player.positions.push([nextPosition[0],nextPosition[1]]);

            for(let fruit of snake.data.fruits) {
                if(fruit.checkCollision([snake.data.player.x, snake.data.player.y])) {
                    setTimeout(async() => {
                        for(let i = 0; i < fruit.points; i++) {
                            snake.data.player.positions.unshift([snake.data.player.positions[0][0],snake.data.player.positions[0][1]]);
                        }
                    },0);

                    fruit.getEaten();
                    fruit.setNewPosition();
                }
            }

        } else {
            if(snake.data.player.direction == "right") {
                snake.data.player.direction = "left";
            } else if(snake.data.player.direction == "left") {
                snake.data.player.direction = "right";
            } else if(snake.data.player.direction == "up") {
                snake.data.player.direction = "down";
            } else if(snake.data.player.direction == "down") {
                snake.data.player.direction = "up";
            }
            renderTPS();
        }

        window.setTimeout(function() {
            checkPlayerPlayerCollision();
        }, 0);
        snake.data.player.controlblock = false;
    }
}


function checkIfPlayerCollision(yourCoordinates) {
    for(var i = 0; i < snake.data.player.positions.length; i++) {
        if(yourCoordinates[0] == snake.data.player.positions[i][0]) {
            if(yourCoordinates[1] == snake.data.player.positions[i][1]) {
                if(i != snake.data.player.positions.length - 1) {
                    return true;
                }
            }
        }
    }

    return false;
}

function checkPlayerPlayerCollision() {
    if(checkIfPlayerCollision([snake.data.player.x, snake.data.player.y])) {
        playerdie();
    }
}

function randomize(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function playerdie() {
    ctx.fillStyle = "#44000066";
    ctx.fillRect(0,0,snake.config.canvasWidth,snake.config.canvasHeight);
    snake.data.player.pause = 1;
    ctx.fillStyle = "#fff";
    ctx.font = snake.config.fontSize + "px " + snake.config.fontFamily;
    ctx.fillText(getLocaleString("youDied"),100,100);
    ctx.fillText(getLocaleString("pressToRestart"),100,140);
}

function applyCSS() {
    document.body.style.setProperty("font-family", snake.config.fontFamily);
}
