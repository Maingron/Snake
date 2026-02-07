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
        }),
        food: new Sprites({
            jsonPath: 'img/sprites/spright.json',
            sheetId: 'food'
        })
    }

    Promise.all([
        snake.sprites.player.load(),
        snake.sprites.main.load(),
        snake.sprites.water.load(),
        snake.sprites.food.load()
    ]).then(() => {
        window.addEventListener("keydown",function(e) {
            let inputKey = e.key.toLowerCase();

            if (inputKey == "r") {
                for(let entity of GenericEntity.allInstances) {
                    entity.die();
                }
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
            if(snake.data?.players?.snakeLength <= 1 && (inputKey == "arrowup" || inputKey == "arrowdown" || inputKey == "arrowleft" || inputKey == "arrowright")) {
                snake.data.players.push(new Player());
            }

            for(let player of snake.data.players ?? []) {
                if(inputKey == player.controls.up) {
                    if(player.direction != "down") {
                        player.directionNext = "up";
                    }
                } else if (inputKey == player.controls.down) {
                    if(player.direction != "up") {
                        player.directionNext = "down";
                    }
                } else if (inputKey == player.controls.left) {
                    if(player.direction != "right") {
                        player.directionNext = "left";
                    }
                } else if (inputKey == player.controls.right) {
                    if(player.direction != "left") {
                        player.directionNext = "right";
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
    snake.data.player = new Player();
    snake.data.players.push(snake.data.player);

    snake.meta.author = "maingron";
    snake.meta.website = "https://maingron.com/snake";


    for(var i = 0; i < (snake.config.fieldHeight * snake.config.fieldWidth) / 100; i++) {
        snake.data.fruits.push(new Fruit.Apple());
    }
        
    snake.data.walls.push(new Wall({pos:[6,6], face: "left"}));
    snake.data.walls.push(new Wall({pos:[7,6], face: "right"}));

    snake.data.walls.push(new Wall({pos:[12,15], face: "right"}));

    for(let x = 7; x <= 12; x++) {
        snake.data.walls.push(new Wall({pos:[x,5], face: "up"}))
        snake.data.walls.push(new Wall({pos:[x,6], face: "down"}))
    }

    snake.data.portals.push(new Portal({pos: [5,5], posDest: [12,12], face: "all"}));
    snake.data.portals.push(new Portal({pos: [12,12], posDest: [5,5], face: "all"}));

    snake.data.portals.push(new Portal({pos: [10,10], posDest: [0,10], face: "right"}));
    snake.data.portals.push(new Portal({pos: [15,17], posDest: [5,5], face: "left"}));
    snake.data.portals.push(new Portal({pos: [17,15], posDest: [5,5], face: "up"}));
    snake.data.portals.push(new Portal({pos: [17,17], posDest: [5,5], face: "down"}));

	tick();
}

function tick() {
	if(!snake.data.player.pause) {
		snake.data.tick.tickAnimationFrameId = requestAnimationFrame(tick);
		snake.data.tick.count++;
		renderTPS();
	}
	snake.tickcounter.pushRenderCall();

    for(let entity of GenericEntity.allInstances) {
        entity.tick();
    }
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


        ctx.textAlign = "right";
        ctx.fillStyle = "#fff";
        ctx.fillText(player.points, snake.config.canvasWidth - 20, 50);
        ctx.textAlign = "left";
    }

    ctx.fillStyle = "#f00";

    for(let entity of GenericEntity.allInstances) {
        if(entity.inViewport()) {
            entity.draw(ctx);
        }
    }

    ctx.font = snake.config.fontSize * 4 + "px " + snake.config.fontFamily // Font for scoreboard is bigger than default

    ctx.fillStyle = "#fff";
    if(snake.config.dev.osdDebug) {
        ctx.font = 20 + "px " + "monospace" // Font for scoreboard is bigger than default
        ctx.fillText("Position: x: " + snake.data.players[0].pos[0] + " y: " + snake.data.players[0].pos[1], 5, snake.config.canvasHeight - 5);
        ctx.fillText("GenericEntities: " + GenericEntity.allInstances.length, 5, snake.config.canvasHeight - 25);
        let entitiesInViewport = 0;
        for(let i = 0; i < GenericEntity.allInstances.length; i++) {
            if(GenericEntity.allInstances[i].inViewport()) {
                entitiesInViewport++;
            }
        }
        ctx.fillText("GenericEntities in Viewport: " + entitiesInViewport, 5, snake.config.canvasHeight - 45);
        ctx.fillText("FPS: " + snake.framecounter.getFPS() + " TPS: " + snake.tickcounter.getFPS(), 5, snake.config.canvasHeight - 65);
        let ignoreInstances = "";
        for (let i = 0; i < snake.data.players[0].ignoreInstances.length; i++) {
            ignoreInstances += snake.data.players[0].ignoreInstances[i][0].name + ":" + snake.data.players[0].ignoreInstances[i][1] + " ";
        }
        ctx.fillText("Player Ignores Instances: " + ignoreInstances, 5, snake.config.canvasHeight - 85);
    }

    ctx.font = snake.config.fontSize + "px " + snake.config.fontFamily // Font for scoreboard is bigger than default



    if(snake.data.players[0].status == "dead") {
        Scenes.playerDied();
    }


    snake.framecounter.pushRenderCall();
}

function calculateRelativeToCamera(x, y, width, height) {
    const playerSnake = snake?.data?.players[0] || { props: { pos: [0, 0] } };

    const { oneWidth, oneHeight, scale, canvasWidth, canvasHeight } = snake.config;
    let playerX = playerSnake.pos[0];
    let playerY = playerSnake.pos[1];
	const somethingMath1 = (snake.data.tick.count % snake.config.movespeed) / (snake.config.movespeed);
	const somethingMath2 = ( 1 / snake.config.movespeed * ( snake.config.movespeed - 1 ) );
	if(!playerSnake.stunFrames && !playerSnake.smoothMovement.disableFrames) {
		if(playerSnake.direction == "left") {
			x = x + somethingMath1 - somethingMath2;
		} else if(playerSnake.direction == "right") {
			x = x - somethingMath1 + somethingMath2;
		} else if(playerSnake.direction == "up") {
			y = y + somethingMath1 - somethingMath2;
		} else if(playerSnake.direction == "down") {
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
    .filter(player => player.status == "alive")
    .map(player => {
        player.tickPlayer();
        return player;
    });
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
