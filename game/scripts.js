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

snake.config = {
    "fieldHeight": 14, // fields
    "fieldWidth": 14, // fields
    "canvasHeight": Math.min(document.body.offsetHeight,document.body.offsetWidth) - 60, // px
    "canvasWidth": Math.min(document.body.offsetHeight,document.body.offsetWidth) - 60, // px
    "tps": 120, // Ticks per Second
    "movespeed": 12, // Move every nth-tick

    "fontSize": "32", // px
    "fontFamily": "'system-ui', sans-serif",

    "wrapField": true,
    "lang": "en"
}

snake.config.oneHeight = snake.config.canvasHeight / snake.config.fieldHeight;
snake.config.oneWidth = snake.config.canvasWidth / snake.config.fieldWidth;

snake.elements = {
    canvas: document.getElementById("snakecanvas"),
    coords: document.getElementById("coords")
};

function initOnce() {
    snake.elements.canvas.height = snake.config.canvasHeight;
    snake.elements.canvas.width = snake.config.canvasWidth;

    ctx = snake.data.ctx = snake.elements.canvas.getContext("2d");
    ctx.fillStyle = "#fff";
    ctx.font = snake.config.fontSize + "px " + snake.config.fontFamily;

    // Load lang file
    let newScriptElement = document.createElement("script");
    newScriptElement.src = "lang/" + snake.config.lang + ".lang.js";
    document.body.appendChild(newScriptElement);
    newScriptElement.setAttribute("onload", "ctx.fillText(getLang('pressToStart'), 100,100)");
    newScriptElement.setAttribute("onerror", "ctx.fillText(getLang('pressToStart'), 100,100)");

    snake.data.controls = {};

    snake.data.spritesheet = new Image();
    snake.data.spritesheet.src = "spritesheet.png";

    snake.data.player = {
        pause: 1
    };

    snake.elements.canvas.style.backgroundSize = (snake.config.canvasHeight / snake.config.fieldHeight + "px");

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
}

function startGame() {
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

    snake.data.apple = {};
    eatApple();
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
    ctx.drawImage(snake.data.spritesheet, 0, 129, 128, 128, snake.data.apple.x * snake.config.oneWidth, snake.data.apple.y * snake.config.oneHeight, snake.config.oneWidth, snake.config.oneHeight);

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
            snake.data.player.positions.push([nextPosition[0],nextPosition[1]]);

            if(snake.data.player.x == snake.data.apple.x && snake.data.player.y == snake.data.apple.y) {
                eatApple();
            } else {
                snake.data.player.positions.shift();
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

        for(var i = 0; i < snake.data.player.positions.length; i++) {
            if(snake.data.player.x == snake.data.player.positions[i][0]) {
                if(snake.data.player.y == snake.data.player.positions[i][1]) {
                    if(i != snake.data.player.positions.length - 1) {
                        playerdie();
                    }
                }
            }
        }
        snake.data.player.controlblock = false;
    }
}

function eatApple() {
    snake.data.player.length++;
    snake.data.apple.x = randomize(snake.config.fieldWidth);
    snake.data.apple.y = randomize(snake.config.fieldHeight);
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
    ctx.fillText(getLang("youDied"),100,100);
    ctx.fillText(getLang("pressToRestart"),100,140);
}

function getLang(request) {
    if(typeof(lang) != "undefined" && lang[request] && lang[request] != "") {
        return lang[request];
    } else {
        return request;
    }
}

initOnce();
