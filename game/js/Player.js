export function Player() {
	var props = {
		x: 0,
		y: 0,
		previousMove: [0,0,"right"], // [x,y,direction]
		direction: "right",
		directionNext: "right",
		stunFrames: 0,
		smoothMovement: {
			disableFrames: 0
		},
		portal: {
			ignoreFrames: 0
		},
		inactiveElements: [],
		pause: 0,
		positions: [[0, 0,'down'],[0,0,'down'],[0,0,'right']], // [[x,y],[x,y],[x,y],...]
		points: 0,
		status: "alive",
		style: {
			colorChannelR: Math.random(),
			colorChannelG: Math.random(),
			colorChannelB: Math.random()
		},
		controls: {
			up: "w",
			down: "s",
			left: "a",
			right: "d",
			reset: "r",
			pause: "p"
		}
	}

	props.initialLength = props.positions.length + 1; // Initial length, used for some calculations like scoreboard

	if(snake.data.players.length > 0) {
		props.controls = {
			up: "arrowup",
			down: "arrowdown",
			left: "arrowleft",
			right: "arrowright",
			reset: "r",
			pause: "p"
		}
	}

	function checkCollisionWithTail(coords = [props.x, props.y]) {
		for(let i = 0; i < props.positions.length - 1; i++) {
			if(coords[0] == props.positions[i][0] && coords[1] == props.positions[i][1]) {
				return coords;
			}
		}

		return false;
	}

	function playerdie() {
		props.status = "dead";
		if(snake.data.players.length <= 1) {
			Scenes.playerDied();
		}
	}

	function tickPlayer() {
		let playerP = this.props;
		let moveThisTick = false;
		let nextPosition = [playerP.x, playerP.y];

		if(snake.data.tick.count % snake.config.movespeed == snake.config.movespeed - 1) {
			playerP.direction = playerP.directionNext;
		}

		if(snake.data.tick.count % snake.config.movespeed == 0) {
			if(playerP.smoothMovement.disableFrames > 0) {
				playerP.smoothMovement.disableFrames--;
			}
			if(playerP.stunFrames > 0) {
				playerP.stunFrames--;
				return;
			}
			moveThisTick = true;
			if(playerP.direction == "up") {
				if(snake.config.wrapField && playerP.y == 0) {
					nextPosition[1] = snake.config.fieldHeight - 1;
				} else {
					nextPosition[1]--;
				}
		
			} else if(playerP.direction == "down") {
				if(snake.config.wrapField && playerP.y == snake.config.fieldHeight - 1) {
					nextPosition[1] = 0;
				} else {
					nextPosition[1]++;
				}
		
			} else if(playerP.direction == "left") {
				if(snake.config.wrapField && playerP.x == 0) {
					nextPosition[0] = snake.config.fieldWidth - 1;
				} else {
					nextPosition[0]--;
				}
		
			} else if(playerP.direction == "right") {
				if(snake.config.wrapField && playerP.x == snake.config.fieldWidth - 1) {
					nextPosition[0] = 0;
				} else {
					nextPosition[0]++;
				}
			}
	
			if(nextPosition[0] != playerP.positions[playerP.positions.length - 2][0] || nextPosition[1] != playerP.positions[playerP.positions.length - 2][1]) {
				playerP.x = nextPosition[0];
				playerP.y = nextPosition[1];
	
				for(let fruit of snake.data.fruits) {
					if(fruit.checkCollision([playerP.x, playerP.y])) {
						for(let i = 0; i < fruit.points; i++) {
							playerP.positions.unshift([playerP.positions[0][0], playerP.positions[0][1], playerP.positions[0][2]]);
						}
	
						fruit.getEaten();
						fruit.newPosition();
					}
				}

				for(let wall of snake.data.walls) {
					switch(wall.face) {
						case "all":
							if(wall.checkCollision([playerP.x, playerP.y])) {
								playerdie();
								return;
							}
							break;
						case "bottom":
							if(playerP.direction == "down" && wall.checkCollision([playerP.x, playerP.y])) {
								playerdie();
								return;
							}
							break;
						case "top":
							if(playerP.direction == "up" && wall.checkCollision([playerP.x, playerP.y])) {
								playerdie();
								return;
							}
							break;
						case "right":
							if(playerP.direction == "right" && wall.checkCollision([playerP.x, playerP.y])) {
								playerdie();
								return;
							}

							break;
						case "left":
							if(playerP.direction == "left" && wall.checkCollision([playerP.x, playerP.y])) {
								playerdie();
								return;
							}
							break;
					}
				}

				playerP.positionTail = playerP.positions.shift();
				playerP.positions.push([nextPosition[0], nextPosition[1], playerP.direction]);
	
			} else {
				if(playerP.directionNext == "right") {
					playerP.direction = "left";
				} else if(playerP.directionNext == "left") {
					playerP.direction = "right";
				} else if(playerP.directionNext == "up") {
					playerP.direction = "down";
				} else if(playerP.directionNext == "down") {
					playerP.direction = "up";
				}
			}
	
			window.setTimeout(function() {
				// if(checkCollisionWithTail()) {
				// 	playerdie();
				// }

				for(let playerEntity of snake.data.players) {
					if(playerEntity.checkCollisionWithTail([props.x, props.y])) {
						playerdie();
					}
				}
			}, 0);

			playerP.points = (playerP.positions.length - playerP.initialLength) + 1;
			this.props.previousMove = [this.props.x, this.props.y, this.props.direction];
		} else if(snake.data.tick.count % snake.config.movespeed == snake.config.movespeed - 1) {
			if(playerP.portal.ignoreFrames > 0) {
				playerP.portal.ignoreFrames--;
				return;
			}
			if(playerP.inactiveElements.includes("portal")) {
				playerP.inactiveElements = playerP.inactiveElements.filter(e => e !== "portal");
			}
			let isCollidingWithPortal = false;

			for(let portal of snake.data.portals) {
				// if(isCollidingWithPortal) {
				// 	break;
				// }

				if(portal.checkCollision([playerP.x, playerP.y])) {
					switch(portal.face) {
						case "all":
							isCollidingWithPortal = true;
							break;
						case "right":
						case "left":
							if(playerP.directionNext == portal.face) {
								isCollidingWithPortal = true;
							}
							break;

						case "top":
							if(playerP.directionNext == "up") {
								isCollidingWithPortal = true;
							}
							break;
						case "bottom":
							if(playerP.directionNext == "down") {
								isCollidingWithPortal = true;
							}
							break;
						}
				}

				if(isCollidingWithPortal) {
					playerP.stunFrames = 5;
					playerP.smoothMovement.disableFrames = 6;
					playerP.portal.ignoreFrames = 12;
					props.inactiveElements.push("portal");
					nextPosition[0] = portal.posDest[0];
					nextPosition[1] = portal.posDest[1];
					playerP.x = portal.posDest[0];
					playerP.y = portal.posDest[1];
					break;
				}
			}
		}
	}

	return {
		props,
		checkCollisionWithTail,
		playerdie,
		tickPlayer
	}
}
