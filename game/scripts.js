if(!data) {
    var data = d = {};
}

var snake = data["snake"] = {};
var ctx;

snake.data = {
    tick: {
        count: 0,
		tickAnimationFrameId: null,
		frameAnimationFrameId: null
    },
    windowInnerWidth: 0 + window.innerWidth,
    windowInnerHeight: 0 + window.innerHeight,
    server: {
        pause: true
    }
};
snake.meta = {};

snake.elements = {
    canvas: document.getElementById("snakecanvas"),
    coords: document.getElementById("coords")
};

async function initOnce() {
	snake.config = new Config().config;
	lazyfun = new Lazyfun();
	lazyfun.init();

    snake.elements.canvas.height = snake.config.canvasHeight;
    snake.elements.canvas.width = snake.config.canvasWidth;

    ctx = snake.data.ctx = snake.elements.canvas.getContext("2d");
    canvasFunctions.applyDefaults();

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

    snake.sprites = {
        player: new Sprites({
            jsonPath: 'img/sprites/spright.json',
            sheetId: 'player'
        }),
        main: new Sprites({
            jsonPath: 'img/sprites/spright.json',
            sheetId: 'main'
        }),
        water: new Sprites({
            jsonPath: 'img/sprites/spright.json',
            sheetId: 'water'
        })
    }

    Promise.all([
        snake.sprites.player.load(),
        snake.sprites.main.load(),
        snake.sprites.water.load()
    ]).then(() => {
        window.addEventListener("keydown",function(e) {
            let inputKey = e.key.toLowerCase();

            if (inputKey == "r") {
                startGame();
            } else if(inputKey == "p") {
                snake.data.player.pause = !snake.data.player.pause;
                tick();
            } else if(inputKey == "ü") {
                snake.data.server.pause = !snake.data.server.pause;
                tick();
            } else if(inputKey == ",") {
                snake.data.player.pause = false;
                snake.data.server.pause = false;
                tick(true);
                snake.data.player.pause = true;
                snake.data.server.pause = true;
            } else if(inputKey == ".") {
                snake.data.server.pause = false;
                for(let i = 0; i < snake.config.movespeed; i++) {
                    tick();
                }
                snake.data.server.pause = true;
            }
            if(snake.data?.players?.length <= 1 && (inputKey == "arrowup" || inputKey == "arrowdown" || inputKey == "arrowleft" || inputKey == "arrowright")) {
                snake.data.players.push(new Player());
            }

            for(let player of snake.data.players ?? []) {
                let playerP = player.props;

                if(!player.props) {
                    return false;
                }

                if(inputKey == playerP.controls.up) {
                    if(playerP.direction != "down") {
                        playerP.directionNext = "up";
                    }
                } else if (inputKey == playerP.controls.down) {
                    if(playerP.direction != "up") {
                        playerP.directionNext = "down";
                    }
                } else if (inputKey == playerP.controls.left) {
                    if(playerP.direction != "right") {
                        playerP.directionNext = "left";
                    }
                } else if (inputKey == playerP.controls.right) {
                    if(playerP.direction != "left") {
                        playerP.directionNext = "right";
                    }
                }
            }
        });

        ctx.reset();
        canvasFunctions.applyDefaults();

        ctx.fillText(getLocaleString("pressToStart"),100,140);

        tick();
        window.requestAnimationFrame(renderFPS);
    });

    snake.tickcounter = new Framecounter();
    snake.framecounter = new Framecounter();

    applyCSS();

    window.getLocaleString = await Langfun(snake.config.lang).then(langfun => {
        return langfun.getLang;
    });

    ctx.fillText(getLocaleString("loading"),100,140);
}

function startGame() {
	if(snake?.data?.tick?.tickAnimationFrameId !== null) {
		cancelAnimationFrame(snake?.data?.tick?.tickAnimationFrameId);
	}

    snake.data.fruits = [];
    snake.data.players = [];
    snake.data.walls = [];
    snake.data.portals = [];
    snake.data.player = new Player().props;
    snake.data.players.push(new Player());

    snake.meta.author = "maingron";
    snake.meta.website = "https://maingron.com/snake";


    for(var i = 0; i < (snake.config.fieldHeight * snake.config.fieldWidth) / 100; i++) {
        snake.data.fruits.push(new Fruit.Apple());
    }
        
    snake.data.fruits[0]?.getEaten();

    snake.data.walls.push(new Wall({pos:[6,6], face: "left"}));
    snake.data.walls.push(new Wall({pos:[7,6], face: "right"}));

    for(let x = 7; x <= 12; x++) {
        snake.data.walls.push(new Wall({pos:[x,5], face: "top"}))
        snake.data.walls.push(new Wall({pos:[x,6], face: "bottom"}))
    }

    snake.data.portals.push(new Portal({pos: [5,5], posDest: [12,12], face: "all"}));
    snake.data.portals.push(new Portal({pos: [12,12], posDest: [5,5], face: "all"}));

    snake.data.portals.push(new Portal({pos: [10,10], posDest: [0,10], face: "right"}));
    snake.data.portals.push(new Portal({pos: [15,17], posDest: [5,5], face: "left"}));
    snake.data.portals.push(new Portal({pos: [17,15], posDest: [5,5], face: "top"}));
    snake.data.portals.push(new Portal({pos: [17,17], posDest: [5,5], face: "bottom"}));



    // snake.data.walls.push(new Wall({pos: [3,3], face: "right"}));
    // snake.data.walls.push(new Wall({pos: [4,3], face: "top"}));
    // snake.data.walls.push(new Wall({pos: [4,6], face: "bottom"}));
    // snake.data.walls.push(new Wall({pos: [2,3], face: "left"}));

    // snake.data.portals.push(new Portal({pos: [7,3], posDest: [12,12], face: "all"}));
    // snake.data.portals.push(new Portal({pos: [2,5], posDest: [12,12], face: "left"}));
    // snake.data.portals.push(new Portal({pos: [2,6], posDest: [12,12], face: "right"}));
    // snake.data.portals.push(new Portal({pos: [2,7], posDest: [12,12], face: "top"}));
    // snake.data.portals.push(new Portal({pos: [2,8], posDest: [12,12], face: "bottom"}));

	tick();
}

function tick() {
	if(!snake.data.player.pause) {
		snake.data.tick.tickAnimationFrameId = requestAnimationFrame(tick);
		snake.data.tick.count++;
		renderTPS();
	}
	snake.tickcounter.pushRenderCall();
}

function numHex(s) {
    s = Math.round(s);
    var a = s.toString(16);
    if ((a.length % 2) > 0) {
        a = "0" + a;
    }
    return a;
}

function getSpritePos(x,y) {
    let x1 = x * 136 + 8;
    let y1 = y * 136 + 8;
    return [x1,y1];
}

function renderFPS() {
	requestAnimationFrame(renderFPS);

    if(!snake?.data?.players) {
        return false;
    }

	ctx.reset();

	ctx.imageSmoothingEnabled = false;

    ctx.fillStyle = "#000";
    ctx.textAlign = "left";
    ctx.rect(0,0,snake.config.canvasWidth,snake.config.canvasHeight);
    ctx.fill();

    let relativeCoords = calculateRelativeToCamera(0,0);
    let relativeCoords2 = calculateRelativeToCamera(snake.config.fieldWidth, snake.config.fieldHeight);
    ctx.clearRect(relativeCoords[0], relativeCoords[1], relativeCoords2[0] - relativeCoords[0], relativeCoords2[1] - relativeCoords[1]);


    // // Scoreboard
    // ctx.drawImage(snake.data.spritesheet, 0, 128, 128, 128, 5, 5, 24, 24); // Apple

    // Set font
    ctx.font = snake.config.fontSize + "px " + snake.config.fontFamily;

    ctx.fillStyle = "#fff";
    for(let player of snake.data.players ?? []) {
        player = player.props;
        for(var i = 0; i < player.positions.length; i++) {
            var currentGradientR = numHex((256 * player.style.colorChannelR / player.positions.length * i));
            var currentGradientG = numHex((256 * player.style.colorChannelG / player.positions.length * i));
            var currentGradientB = numHex((256 * player.style.colorChannelB / player.positions.length * i));
    
            ctx.fillStyle="#"+currentGradientR+currentGradientG+currentGradientB;

            if(i == 0 || i == player.positions.length - 1) { // Tail or head
                if(i == 0) {
                    let tailRotation = player.positions[1][2] ?? "down";
                    if(player.positions[1][2]?.split("_")[1]) {
                        tailRotation = player.positions[1][2].split("_")[0];
                    }
                    ctx.drawImage(snake.sprites.player.spritesheets[0], ...snake.sprites.player.getSprite("tail_" + tailRotation)?.correctedRectArr, ...calculateRelativeToCamera(player.positions[0][0], player.positions[0][1], 1, 1));
                } else {
                    ctx.drawImage(snake.sprites.player.spritesheets[0], ...snake.sprites.player.getSprite("face_" + player.direction)?.correctedRectArr, ...calculateRelativeToCamera(player.positions[i][0], player.positions[i][1], 1, 1));
                }
            } else if(player.positions[i][2] != player.positions[i+1][2]) {
                let out = [player.positions[i][2], player.positions[i+1][2]];

                ctx.drawImage(snake.sprites.player.spritesheets[0], ...snake.sprites.player.getSprite('curve_' + out[0] + '_' + out[1])?.correctedRectArr, ...calculateRelativeToCamera(player.positions[i][0], player.positions[i][1], 1, 1));

            } else if(player.positions[i][2] == "down") {
                ctx.drawImage(snake.sprites.player.spritesheets[0], ...snake.sprites.player.getSprite("straight_down")?.correctedRectArr, ...calculateRelativeToCamera(player.positions[i][0], player.positions[i][1], 1, 1));
            } else if(player.positions[i][2] == "up") {
                ctx.drawImage(snake.sprites.player.spritesheets[0], ...snake.sprites.player.getSprite("straight_up")?.correctedRectArr, ...calculateRelativeToCamera(player.positions[i][0], player.positions[i][1], 1, 1));
            } else if(player.positions[i][2] == "right") {
                ctx.drawImage(snake.sprites.player.spritesheets[0], ...snake.sprites.player.getSprite("straight_right")?.correctedRectArr, ...calculateRelativeToCamera(player.positions[i][0], player.positions[i][1], 1, 1));
            } else if(player.positions[i][2] == "left") {
                ctx.drawImage(snake.sprites.player.spritesheets[0], ...snake.sprites.player.getSprite("straight_left")?.correctedRectArr, ...calculateRelativeToCamera(player.positions[i][0], player.positions[i][1], 1, 1));
            } else {
                ctx.drawImage(snake.sprites.player.spritesheets[0], ...snake.sprites.player.getSprite("alt")?.correctedRectArr, ...calculateRelativeToCamera(player.positions[i][0], player.positions[i][1], 1, 1));
            }
        }

        ctx.textAlign = "right";
        ctx.fillStyle = "#fff";
        ctx.fillText(player.points, snake.config.canvasWidth - 20, 50);
        ctx.textAlign = "left";
    }



    ctx.fillStyle = "#f00";
    for(let fruit of snake.data.fruits) {
        let relativeCoords = calculateRelativeToCamera(fruit.pos[0], fruit.pos[1], 1, 1);
        if(inViewport(...relativeCoords)) {
            if(fruit.type == "Apple") {
                ctx.drawImage(snake.data.spritesheet, ...getSpritePos(1,0), 128, 128, ...relativeCoords);
            } else if(fruit.type == "Orange") {
                ctx.drawImage(snake.data.spritesheet, ...getSpritePos(1,0), 128, 128, ...relativeCoords);
			}
        }
    }

    for(let entityType of [
        ["wall", snake.data.walls, {
            all: [1, 2],
            left: [0, 3],
            right: [2, 2],
            bottom: [2, 3],
            top: [1, 3]
        }],
        ["portal", snake.data.portals, {
            all: [0, 4],
            right: [2, 4],
            left: [1, 4],
            top: [1, 5],
            bottom: [0, 5]
        }]]) {

        for(let entity of entityType[1]) {
			if(entity?.inactive || snake?.data?.players[0]?.props?.inactiveElements?.includes(entity.type)) {
				ctx.filter = "grayscale(.8) opacity(.5)";
			}
            let relativeCoords = calculateRelativeToCamera(entity.pos[0], entity.pos[1], 1, 1);
            if(inViewport(...relativeCoords)) {
                switch (entity.face) {
                    case "all":
                        ctx.drawImage(snake.data.spritesheet, ...getSpritePos(...entityType[2]["all"]), 128, 128, ...relativeCoords);
                        break;
                    case "right":
                        ctx.drawImage(snake.data.spritesheet, ...getSpritePos(...entityType[2]["right"]), 128, 128, ...relativeCoords);
                        break;
                    case "left":
                        ctx.drawImage(snake.data.spritesheet, ...getSpritePos(...entityType[2]["left"]), 128, 128, ...relativeCoords);
                        break;
                    case "top":
                        ctx.drawImage(snake.data.spritesheet, ...getSpritePos(...entityType[2]["top"]), 128, 128, ...relativeCoords);
                        break;
                    case "bottom":
                        ctx.drawImage(snake.data.spritesheet, ...getSpritePos(...entityType[2]["bottom"]), 128, 128, ...relativeCoords);
                        break;
                }
            }

			ctx.filter = "none";
        }
    }

    for(let wall of snake.data.walls) {
        let relativeCoords = calculateRelativeToCamera(wall.pos[0], wall.pos[1], 1, 1);
    }

    // Draw border around map boundaries
    // ctx.beginPath();
    // ctx.strokeStyle = "black";
    // ctx.lineWidth = 8;
    // let relativeCoords = calculateRelativeToCamera(0,0);
    // let relativeCoords2 = calculateRelativeToCamera(snake.config.fieldWidth, snake.config.fieldHeight);
    // ctx.rect(relativeCoords[0], relativeCoords[1], relativeCoords2[0] - relativeCoords[0], relativeCoords2[1] - relativeCoords[1]);
    // ctx.stroke();

    // OSD
    // ctx.fillStyle = "#000";
    // ctx.fillRect(0, snake.config.canvasHeight * .9, snake.config.canvasWidth / 10, snake.config.canvasHeight / 10);

    ctx.font = snake.config.fontSize * 4 + "px " + snake.config.fontFamily // Font for scoreboard is bigger than default
        // ctx.fillText(player.props.points, snake.config.canvasHeight / 2 - ctx.measureText(player.props.points).width / 2, snake.config.canvasHeight / 2);

    ctx.fillStyle = "#fff";
    ctx.font = snake.config.fontSize + "px " + snake.config.fontFamily // Font for scoreboard is bigger than default
    ctx.fillText(snake.data.players[0].props.x + "; " + snake.data.players[0].props.y, 5, snake.config.canvasHeight - 5);


    ctx.fillText("TPS: " + snake.tickcounter.getFPS(), 100, 100);
    ctx.fillText("FPS: " + snake.framecounter.getFPS(), 100, 150);

    if(snake.data.players[0].props.status == "dead") {
        Scenes.playerDied();
    }


    snake.framecounter.pushRenderCall();
}

function calculateRelativeToCamera(x, y, width, height) {
    const playerSnake = snake?.data?.players?.[0] || { props: { x: 0, y: 0 } };

    const { oneWidth, oneHeight, scale, canvasWidth, canvasHeight } = snake.config;
    let { x: playerX, y: playerY } = playerSnake.props;
	const somethingMath1 = (snake.data.tick.count % snake.config.movespeed) / (snake.config.movespeed);
	const somethingMath2 = ( 1 / snake.config.movespeed * ( snake.config.movespeed - 1 ) );
	if(!playerSnake.props.stunFrames && !playerSnake.props.smoothMovement.disableFrames) {
		if(playerSnake.props.direction == "left") {
			x = x + somethingMath1 - somethingMath2;
		} else if(playerSnake.props.direction == "right") {
			x = x - somethingMath1 + somethingMath2;
		} else if(playerSnake.props.direction == "up") {
			y = y + somethingMath1 - somethingMath2;
		} else if(playerSnake.props.direction == "down") {
			y = y - somethingMath1 + somethingMath2;
		}
	}


    const scaledWidth = oneWidth * scale;
    const scaledHeight = oneHeight * scale;

    const centerPointX = (canvasWidth - scaledWidth) / 2;
    const centerPointY = (canvasHeight - scaledHeight) / 2;

    const resX = centerPointX + (x - playerX) * scaledWidth;
    const resY = centerPointY + (y - playerY) * scaledHeight;
    const resWidth = width * scaledWidth;
    const resHeight = height * scaledHeight;

    if(resWidth && resHeight) {
        return [resX, resY, resWidth, resHeight];
    }
    return [resX, resY];
}

function inViewport(x, y, width, height) {
    if(x < 0 - width || y < 0 - height || x > snake.data.windowInnerWidth || y > snake.data.windowInnerHeight) {
        return false;
    }
    return true;
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
    for(let player of snake.data.players ?? []) {
        for(var i = 0; i < player.props.positions.length; i++) {
            if(yourCoordinates[0] == player.props.positions[i][0]) {
                if(yourCoordinates[1] == player.props.positions[i][1]) {
                    if(i != player.props.positions.length - 1) {
                        return true;
                    }
                }
            }
        }
    }

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

const canvasFunctions = {
    applyDefaults: function() {
        ctx.fillStyle = "#fff";
        ctx.font = snake.config.fontSize + "px " + snake.config.fontFamily;
    }
}
