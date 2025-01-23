export function Player() {
	var props = {
		x: 0,
		y: 0,
		direction: "right",
		pause: 0,
		positions: [[0,0],[0,0],[0,0]], // [[x,y],[x,y],[x,y],...]
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
		var moveThisTick = false;

		if(snake.data.tick.count % snake.config.movespeed == 0) {
			moveThisTick = true;
			var nextPosition = [playerP.x, playerP.y];

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
				playerP.positions.shift();
				playerP.positions.push([nextPosition[0],nextPosition[1]]);
	
				for(let fruit of snake.data.fruits) {
					if(fruit.checkCollision([playerP.x, playerP.y])) {
						for(let i = 0; i < fruit.points; i++) {
							playerP.positions.unshift([playerP.positions[0][0], playerP.positions[0][1]]);
						}
	
						fruit.getEaten();
						fruit.setNewPosition();
					}
				}
	
			} else {
				if(playerP.direction == "right") {
					playerP.direction = "left";
				} else if(playerP.direction == "left") {
					playerP.direction = "right";
				} else if(playerP.direction == "up") {
					playerP.direction = "down";
				} else if(playerP.direction == "down") {
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
		}
	}

	return {
		props,
		checkCollisionWithTail,
		playerdie,
		tickPlayer
	}
}
