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


    snake.data.fruits.push(new Fruit.Apple());
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
    
            ctx.fillRect(player.positions[i][0] * snake.config.oneWidth, player.positions[i][1] * snake.config.oneHeight, snake.config.oneWidth, snake.config.oneHeight);
    
            if(i == player.positions.length - 1) { // Head
                // draw sprite
                ctx.drawImage(snake.data.spritesheet, 128, 128, 128, 128, player.positions[i][0] * snake.config.oneWidth, player.positions[i][1] * snake.config.oneHeight, snake.config.oneWidth, snake.config.oneHeight);
            }
        }
    }



    ctx.fillStyle = "#f00";
    for(let fruit of snake.data.fruits) {
        ctx.drawImage(snake.data.spritesheet, 0, 129, 128, 128, fruit.pos[0] * snake.config.oneWidth, fruit.pos[1] * snake.config.oneHeight, snake.config.oneWidth, snake.config.oneHeight);
    }
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
