if(!data) {
    var data = d = {};
}

var snake = data["snake"] = {};

snake.elements = {};
snake.config = {};
snake.data = {};
snake.meta = {};

snake.config = {
    "fieldHeight": 24, // fields
    "fieldWidth": 24, // fields
    "canvasHeight": Math.min(document.body.offsetHeight,document.body.offsetWidth) - 60, // px
    "canvasWidth": Math.min(document.body.offsetHeight,document.body.offsetWidth) - 60, // px
    "fps": 60, // Probably Dev value
    "tps": 15, // Ticks per Second

    "fontSize": "32", // px
    "fontFamily":"sans-serif",

    "wrapField": true
}

snake.config.oneHeight = snake.config.canvasHeight / snake.config.fieldHeight;
snake.config.oneWidth = snake.config.canvasWidth / snake.config.fieldWidth;

snake.elements.canvas = document.getElementById("snakecanvas");
var ctx = snake.data.ctx = snake.elements.canvas.getContext("2d");

snake.elements.coords = document.getElementById("coords");


function init() {
    snake.elements.canvas.height = snake.config.canvasHeight;
    snake.elements.canvas.width = snake.config.canvasWidth;
    snake.elements.canvas.style.border = "1px solid #ff0";

    snake.data.controls = {};

    snake.data.spritesheet = new Image();
    snake.data.spritesheet.src = "spritesheet.png";


    snake.data.player = {};
    snake.data.player.x = 0;
    snake.data.player.y = 0;
    snake.data.player.direction = "right";
    snake.data.player.controlblock = false;
    snake.data.player.pause = 0;

    snake.meta.author = "maingron";
    snake.meta.website = "https://maingron.com/snake";

    snake.data.player.positions = [[0,0],[0,0]]; // [[x,y],[x,y],[x,y],...]
    snake.data.player.initialLength = snake.data.player.positions.length + 1; // Initial length, used for some calculations like scoreboard

    snake.data.player.points = 0;

    snake.data.apple = {};

    window.addEventListener("keypress",function(e) {
        let inputKey = e.key.toLowerCase();
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
                init();
            }
        }
        snake.data.player.controlblock = true;
    });
}

window.setInterval(function() {
    renderFPS();
},(1000 / snake.config.fps));

window.setInterval(function() {
    renderTPS();
},(1000 / snake.config.tps));


function numHex(s)
{
    s = Math.round(s);
    var a = s.toString(16);
    if ((a.length % 2) > 0) {
        a = "0" + a;
    }
    return a;
}

function renderFPS() {
    if(snake.data.player.pause == 1) {
    } else {


    ctx.clearRect(0,0,snake.config.canvasWidth,snake.config.canvasHeight);


    // // Scoreboard
    // ctx.drawImage(snake.data.spritesheet, 0, 128, 128, 128, 5, 5, 24, 24); // Apple
    ctx.font = snake.config.fontSize * 4 + "px " + snake.config.fontFamily // Font for scoreboard is bigger than default
    ctx.fillText(snake.data.player.points, snake.config.canvasHeight / 2 - ctx.measureText(snake.data.player.points).width / 2, snake.config.canvasHeight / 2);


    // Set font
    ctx.font = snake.config.fontSize + "px " + snake.config.fontFamily;


    ctx.fillStyle = "#ff0";
    for(var i = 0; i < snake.data.player.positions.length; i++) {
        var currentGradient = numHex((256 / snake.data.player.positions.length * i));

        ctx.fillStyle="#"+currentGradient+currentGradient+"00";
        ctx.fillRect(snake.data.player.positions[i][0] * snake.config.oneWidth, snake.data.player.positions[i][1] * snake.config.oneHeight, snake.config.oneWidth, snake.config.oneHeight);
    }


    ctx.fillStyle = "#f00";
    ctx.drawImage(snake.data.spritesheet, 0, 129, 128, 128, snake.data.apple.x * snake.config.oneWidth, snake.data.apple.y * snake.config.oneHeight, snake.config.oneWidth, snake.config.oneHeight);

    ctx.fillStyle = "#fff";
    ctx.fillText(snake.data.player.x + "; " + snake.data.player.y, 5, snake.config.canvasHeight - 5);
}

}

function renderTPS() {
    snake.data.player.points = snake.data.player.positions.length - snake.data.player.initialLength;

    if(snake.data.player.direction == "up") {
        if(snake.config.wrapField && snake.data.player.y == 0) {
            snake.data.player.y = snake.config.fieldHeight - 1;
        } else {
            snake.data.player.y--;
        }

    } else if(snake.data.player.direction == "down") {
        if(snake.config.wrapField && snake.data.player.y == snake.config.fieldHeight - 1) {
            snake.data.player.y = 0;
        } else {
            snake.data.player.y++;
        }

    } else if(snake.data.player.direction == "left") {
        if(snake.config.wrapField && snake.data.player.x == 0) {
            snake.data.player.x = snake.config.fieldWidth - 1;
        } else {
            snake.data.player.x--;
        }

    } else if(snake.data.player.direction == "right") {
        if(snake.config.wrapField && snake.data.player.x == snake.config.fieldWidth - 1) {
            snake.data.player.x = 0;
        } else {
            snake.data.player.x++;
        }

    }

    snake.data.player.positions.push([snake.data.player.x,snake.data.player.y]);

    if(snake.data.apple.spawned == 1) {
        snake.data.player.positions.shift();

    } else {
        snake.data.apple.x = randomize(snake.config.fieldWidth);
        snake.data.apple.y = randomize(snake.config.fieldHeight);
        snake.data.apple.spawned = 1;
    }


    if(snake.data.player.x == snake.data.apple.x) {
        if(snake.data.player.y == snake.data.apple.y) {
            snake.data.apple.spawned = 0;
            snake.data.player.length++;
        }
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

init();
ctx.fillStyle = "#ff0";
ctx.font = snake.config.fontSize + "px " + snake.config.fontFamily;
ctx.fillText(lang.pressToStart, 100,100);
snake.data.player.pause = 1;


function randomize(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function playerdie() {
    ctx.fillStyle = "#55300066";
    ctx.fillRect(0,0,snake.config.canvasWidth,snake.config.canvasHeight);
    snake.data.player.pause = 1;
    ctx.fillStyle = "#ff0";
    ctx.font = snake.config.fontSize + "px " + snake.config.fontFamily;
    ctx.fillText(lang.youDied,100,100);
    ctx.fillText(lang.pressToRestart,100,140);
}