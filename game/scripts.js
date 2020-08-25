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
    "fieldHeight": 20, // fields
    "fieldWidth": 20, // fields
    "fps": 60 // Probably Dev value
}


snake.elements.canvas = document.getElementById("snakecanvas");
var ctx = snake.data.ctx = snake.elements.canvas.getContext("2d");


function init() {
    snake.elements.canvas.style.height = snake.config.canvasHeight + "px";
    snake.elements.canvas.style.width = snake.config.canvasWidth + "px";
    snake.elements.canvas.style.border = "1px solid #ff0";

    window.setInterval(function() {
        render();
    },(1000 / snake.config.fps))
}

function render() {
    ctx.clearRect(0,0,snake.config.canvasWidth,snake.config.canvasHeight);
    ctx.fillStyle = "red";
    ctx.fillRect(10,10,50,50);
}

init();