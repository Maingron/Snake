if(!data) {
    var data = d = {};
}

var snake = data["snake"] = {};

snake.elements = {};
snake.config = {};
snake.data = {};

snake.config = {
    "canvasHeight": 500, // px; Dev value, should be automated later
    "canvasWidth": 700, // px; Dev value, should be automated later
    "fieldHeight": 40, // fields
    "fieldWidth": 40, // fields
    "fps": 60, // Probably Dev value
    "tps": 5 // Ticks per Second
}
snake.config.oneHeight = snake.config.canvasHeight / snake.config.fieldHeight;
snake.config.oneWidth = snake.config.canvasWidth / snake.config.fieldWidth;



snake.elements.canvas = document.getElementById("snakecanvas");
var ctx = snake.data.ctx = snake.elements.canvas.getContext("2d");

snake.elements.coords = document.getElementById("coords");

function init() {
    snake.elements.canvas.style.height = snake.config.canvasHeight + "px";
    snake.elements.canvas.style.width = snake.config.canvasWidth + "px";
    snake.elements.canvas.style.border = "1px solid #ff0";

    snake.data.controls = {};

    snake.data.player = {};
    snake.data.player.x = 0;
    snake.data.player.y = 0;
    snake.data.player.length = 1;

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
}

function renderFPS() {
    ctx.clearRect(0,0,snake.config.canvasWidth,snake.config.canvasHeight);

    ctx.fillStyle = "#ff0";
    ctx.fillRect(snake.data.player.x * snake.config.oneWidth,snake.data.player.y * snake.config.oneHeight,snake.config.oneWidth,snake.config.oneHeight);

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
}

init();