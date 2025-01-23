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
    // snake.elements.canvas.style.backgroundSize = (snake.config.canvasHeight / snake.config.fieldHeight + "px");

    // let relativeCoords = calculateRelativeToCamera(0,0,1,1);
    // snake.elements.canvas.style.backgroundSize = (relativeCoords[2] + "px");


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

    window.addEventListener("keydown",function(e) {
        let inputKey = e.key.toLowerCase();

        if (inputKey == "r") {
            startGame();
        }

        if(snake.data?.players?.length <= 1 && (inputKey == "arrowup" || inputKey == "arrowdown" || inputKey == "arrowleft" || inputKey == "arrowright")) {
            snake.data.players.push(new Player());
        }

        for(let player of snake.data.players || [{}]) {
            let playerP = player.props;

            if(!player.props) {
                return false;
            }

            if(playerP.pause) {
                playerP.controlblock = false;
            }

            if(!playerP.controlblock) {
                if(inputKey == playerP.controls.up) {
                    if(playerP.direction != "down") {
                        playerP.direction = "up";
                    }
                } else if (inputKey == playerP.controls.down) {
                    if(playerP.direction != "up") {
                        playerP.direction = "down";
                    }
                } else if (inputKey == playerP.controls.left) {
                    if(playerP.direction != "right") {
                        playerP.direction = "left";
                    }
                } else if (inputKey == playerP.controls.right) {
                    if(playerP.direction != "left") {
                        playerP.direction = "right";
                    }
                }
            }
            playerP.controlblock = true;
        }

    });

    window.setInterval(() => {
        tick();
    },(1000 / snake.config.tps));

    setInterval(() => {
        requestAnimationFrame(renderFPS);
    }, 1000 / snake.config.fps);


    window.getLocaleString = await Langfun(snake.config.lang).then(langfun => {
        return langfun.getLang;
    });

    ctx.fillText(getLocaleString("pressToStart"),100,140);
}

function startGame() {
    snake.data.fruits = [];
    snake.data.players = [];
    snake.data.player = new Player().props;
    snake.data.players.push(new Player());

    snake.meta.author = "maingron";
    snake.meta.website = "https://maingron.com/snake";


    for(var i = 0; i < (snake.config.fieldHeight * snake.config.fieldWidth) / 100; i++) {
        snake.data.fruits.push(new Fruit.Apple());
    }
        
    snake.data.fruits[0]?.getEaten();
}

function tick() {
    snake.data.tick.count++;
    renderTPS();
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

    ctx.fillStyle = "#fff";

    ctx.clearRect(0,0,snake.config.canvasWidth,snake.config.canvasHeight);



    // draw background image tiled
    //
    // for(var i = 0; i < snake.config.fieldWidth; i++) {
    //     for(var j = 0; j < snake.config.fieldHeight; j++) {
    //         ctx.drawImage(snake.data.spritesheet, 0, 0, 128, 128, i * virtualCoords.oneWidth, j * virtualCoords.oneHeight, virtualCoords.oneWidth, virtualCoords.oneHeight);
    //     }
    // }


    // // Scoreboard
    // ctx.drawImage(snake.data.spritesheet, 0, 128, 128, 128, 5, 5, 24, 24); // Apple
    ctx.font = snake.config.fontSize * 4 + "px " + snake.config.fontFamily // Font for scoreboard is bigger than default
    for(let player of snake.data.players) {
        ctx.fillText(player.props.points, snake.config.canvasHeight / 2 - ctx.measureText(player.props.points).width / 2, snake.config.canvasHeight / 2);
    
        ctx.font = snake.config.fontSize + "px " + snake.config.fontFamily // Font for scoreboard is bigger than default
        ctx.fillText(player.props.x + "; " + player.props.y, 5, snake.config.canvasHeight - 5);
    }


    // Set font
    ctx.font = snake.config.fontSize + "px " + snake.config.fontFamily;

    ctx.fillStyle = "#fff";
    for(let player of snake.data.players) {
        player = player.props;
        for(var i = 0; i < player.positions.length; i++) {
            var currentGradientR = numHex((256 * player.style.colorChannelR / player.positions.length * i));
            var currentGradientG = numHex((256 * player.style.colorChannelG / player.positions.length * i));
            var currentGradientB = numHex((256 * player.style.colorChannelB / player.positions.length * i));
    
            ctx.fillStyle="#"+currentGradientR+currentGradientG+currentGradientB;

            ctx.fillRect(...calculateRelativeToCamera(player.positions[i][0], player.positions[i][1], 1, 1));

            // ctx.fillRect(virtualCoords.centerPointX + (player.positions[i][0] * virtualCoords.oneWidth - player.x * virtualCoords.oneWidth), virtualCoords.centerPointY + (player.positions[i][1] * virtualCoords.oneHeight - player.y * virtualCoords.oneHeight), virtualCoords.oneWidth, virtualCoords.oneHeight);
    
            if(i == player.positions.length - 1) { // Head
                // draw sprite
                ctx.drawImage(snake.data.spritesheet, 128, 128, 128, 128, ...calculateRelativeToCamera(player.positions[i][0], player.positions[i][1], 1, 1));
            }
        }
    }



    ctx.fillStyle = "#f00";
    for(let fruit of snake.data.fruits) {
        ctx.drawImage(snake.data.spritesheet, 0, 129, 128, 128, ...calculateRelativeToCamera(fruit.pos[0], fruit.pos[1], 1, 1));
    }

    // Draw border around map boundaries
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 8;
    let relativeCoords = calculateRelativeToCamera(0,0);
    let relativeCoords2 = calculateRelativeToCamera(snake.config.fieldWidth, snake.config.fieldHeight);
    ctx.rect(relativeCoords[0], relativeCoords[1], relativeCoords2[0] - relativeCoords[0], relativeCoords2[1] - relativeCoords[1]);
    ctx.stroke();
}

function calculateRelativeToCamera(x, y, width, height) {
    const playerSnake = snake?.data?.players?.[0] || { props: { x: 0, y: 0 } };

    const { oneWidth, oneHeight, scale, canvasWidth, canvasHeight } = snake.config;
    const { x: playerX, y: playerY } = playerSnake.props;

    const scaledWidth = oneWidth * scale;
    const scaledHeight = oneHeight * scale;

    const centerPointX = (canvasWidth - scaledWidth) / 2;
    const centerPointY = (canvasHeight - scaledHeight) / 2;

    const resX = centerPointX + (x - playerX) * scaledWidth;
    const resY = centerPointY + (y - playerY) * scaledHeight;
    const resWidth = width * scaledWidth;
    const resHeight = height * scaledHeight;

    return [resX, resY, resWidth, resHeight];
}

function renderTPS() {
    if(snake?.data?.player?.pause || !snake?.data?.player?.positions) {
        return false;
    }

    if(!snake.data.players) {
        return false;
    }


    snake.data.players = snake.data.players
    .filter(player => player.props.status == "alive")
    .map(player => {
        player.tickPlayer();
        return player;
    });
}


function checkIfPlayerCollision(yourCoordinates) {
    // for(let player of snake.data.players) {
    //     for(var i = 0; i < player.positions.length; i++) {
    //         if(yourCoordinates[0] == player.positions[i][0]) {
    //             if(yourCoordinates[1] == player.positions[i][1]) {
    //                 if(i != player.positions.length - 1) {
    //                     return true;
    //                 }
    //             }
    //         }
    //     }
    // }

    return false;
}

function checkPlayerPlayerCollision() {
    // for(let player of snake.data.players) {
    //     if(player.checkCollisionWithTail()) {
    //         playerdie();
    //     }
    // }
}

function randomize(max) {
    return Math.floor(Math.random() * Math.floor(max));
}


function applyCSS() {
    document.body.style.setProperty("font-family", snake.config.fontFamily);
}

var Scenes = {
    playerDied: function() {
        ctx.fillStyle = "#44000066";
        ctx.fillRect(0,0,snake.config.canvasWidth,snake.config.canvasHeight);
        snake.data.player.pause = 1;
        ctx.fillStyle = "#fff";
        ctx.font = snake.config.fontSize + "px " + snake.config.fontFamily;
        ctx.fillText(getLocaleString("youDied"),100,100);
        ctx.fillText(getLocaleString("pressToRestart"),100,140);
    }
}
