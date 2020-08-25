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
    "tps": 8 // Ticks per Second
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
    snake.data.controls.up = 0;
    snake.data.controls.down = 0;
    snake.data.controls.left = 0;
    snake.data.controls.right = 0;

    snake.data.player = {};
    snake.data.player.x = 0;
    snake.data.player.y = 0;
    snake.data.player.length = 1;

    window.addEventListener("keydown",function(e) {
        if(e.key == "w") {
            snake.data.controls.up = 1;
        } else if (e.key == "s") {
            snake.data.controls.down = 1;
        } else if (e.key == "a") {
            snake.data.controls.left = 1;
        } else if (e.key == "d") {
            snake.data.controls.right = 1;
        }
    });

    window.addEventListener("keyup",function(e) {
        if(e.key == "w") {
            snake.data.controls.up = 0;
        } else if (e.key == "s") {
            snake.data.controls.down = 0;
        } else if (e.key == "a") {
            snake.data.controls.left = 0;
        } else if (e.key == "d") {
            snake.data.controls.right = 0;
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

    ctx.fillStyle = "#fff";
    if(snake.data.controls.up == 1) {
        ctx.fillRect(10,0,10,10);
    }
    if(snake.data.controls.down == 1) {
        ctx.fillRect(10,20,10,10);
    }
    if(snake.data.controls.left == 1) {
        ctx.fillRect(0,10,10,10);
    }
    if(snake.data.controls.right == 1) {
        ctx.fillRect(20,10,10,10);
    }

    ctx.fillStyle = "#ff0";
    ctx.fillRect(snake.data.player.x * snake.config.oneWidth,snake.data.player.y * snake.config.oneHeight,snake.config.oneWidth,snake.config.oneHeight);

    snake.elements.coords.innerHTML = snake.data.player.x + ";" + snake.data.player.y;

}

function renderTPS() {
    if(snake.data.controls.up == 1) {
        snake.data.player.y--;
    }
    if(snake.data.controls.down == 1) {
        snake.data.player.y++;
    }
    if(snake.data.controls.left == 1) {
        snake.data.player.x--;
    }
    if(snake.data.controls.right == 1) {
        snake.data.player.x++;
    }
}

init();