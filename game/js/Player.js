export function Player() {
	var props = {
		x: 0,
		y: 0,
		direction: "right",
		controlblock: false,
		pause: 0,
		positions: [[0,0],[0,0],[0,0]], // [[x,y],[x,y],[x,y],...]
		points: 0
	}

	props.initialLength = props.positions.length + 1; // Initial length, used for some calculations like scoreboard

	function checkCollisionWithTail() {
		console.log("cheggin");
		for(let i = 0; i < props.positions.length - 1; i++) {
			if(props.x == props.positions[i][0] && props.y == props.positions[i][1]) {
				return true;
			}
		}

		return false;
	}

	function playerdie() {
		Scenes.playerDied();
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
				if(checkCollisionWithTail()) {
					playerdie();
				}
			}, 0);

			playerP.points = (playerP.positions.length - playerP.initialLength) + 1;

			playerP.controlblock = false;
		}
	}

	return {
		props,
		checkCollisionWithTail,
		playerdie,
		tickPlayer
	}
}
