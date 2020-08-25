if(!data) {
    var data = d = {};
}

var snake = data["snake"] = {};

snake.elements = {};
snake.config = {};
snake.data = {};

snake.config = {
    "canvasHeight": 512, // px; Dev value, should be automated later
    "canvasWidth": 512, // px; Dev value, should be automated later
    "fieldHeight": 16, // fields
    "fieldWidth": 16, // fields
    "fps": 60, // Probably Dev value
    "tps": 8 // Ticks per Second
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

    
    snake.data.player = {};
    snake.data.player.x = 0;
    snake.data.player.y = 0;
    snake.data.player.length = 1;
    snake.data.player.direction = "right";
    
    snake.data.player.positions = [[0,0]]; // [[x,y],[x,y],[x,y],...]

    snake.data.apple = {};

    window.addEventListener("keypress",function(e) {
        if(e.key == "w") {
            snake.data.player.direction = "up";
        } else if (e.key == "s") {
            snake.data.player.direction = "down";
        } else if (e.key == "a") {
            snake.data.player.direction = "left";
        } else if (e.key == "d") {
            snake.data.player.direction = "right";
        }
    });

window.setInterval(function() {
    renderFPS();
},(1000 / snake.config.fps));

window.setInterval(function() {
    renderTPS();
},(1000 / snake.config.tps));

function renderFPS() {
    ctx.clearRect(0,0,snake.config.canvasWidth,snake.config.canvasHeight);

    ctx.fillStyle = "#ff0";
    for(var i = 0; i < snake.data.player.positions.length; i++) {
        ctx.fillRect(snake.data.player.positions[i][0] * snake.config.oneWidth, snake.data.player.positions[i][1] * snake.config.oneHeight, snake.config.oneWidth, snake.config.oneHeight);
    }


    ctx.fillStyle = "#f00";
    ctx.fillRect(snake.data.apple.x * snake.config.oneWidth, snake.data.apple.y * snake.config.oneHeight, snake.config.oneWidth, snake.config.oneHeight);



    snake.elements.coords.innerHTML = snake.data.player.x + ";" + snake.data.player.y;

}

function renderTPS() {
    if(snake.data.player.direction == "up") {
        snake.data.player.y--;
    } else if(snake.data.player.direction == "down") {
        snake.data.player.y++;
    } else if(snake.data.player.direction == "left") {
        snake.data.player.x--;
    } else if(snake.data.player.direction == "right") {
        snake.data.player.x++;
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
}

init();

function randomize(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function playerdie() {
    init();
}