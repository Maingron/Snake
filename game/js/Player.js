export class Player extends GenericEntity {
	constructor(props) {
		const thisPlayer = super(props);
		Object.assign(thisPlayer, {
			pos: [0, 0],
			zIndex: 10,
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
			ignoreInstances: [],
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
			},
			...props
		});

		this.initialLength = this.positions.length + 1; // Initial length, used for some calculations like scoreboard
	}

	checkCollisionWithTail(coords = [this.pos[0], this.pos[1]]) {
		for(let i = 0; i < this.positions.length - 1; i++) {
			if(coords[0] == this.positions[i][0] && coords[1] == this.positions[i][1]) {
				return coords;
			}
		}

		return false;
	}

	collide(otherObject) {
		if(otherObject instanceof GenericEntity) {
			if(otherObject.pos[0] == this.pos[0] && otherObject.pos[1] == this.pos[1]) {
				this.die();
			}
		}
	}

	die() {
		let thisBeforeDeath = this;
		super.die();
		thisBeforeDeath.status = "dead";
		if(snake.data.players.length <= 1) {
			Scenes.playerDied();
		}
	}

	draw(ctx) {
		// Tail
		let tailRotation = this.positions[1][2] ?? "down";
		if(this.positions[1][2]?.split("_")[1]) {
			tailRotation = this.positions[1][2].split("_")[0];
		}
		ctx.drawImage(snake.sprites.player.spritesheets[0], ...snake.sprites.player.getSprite("tail_" + tailRotation)?.correctedRectArr, ...calculateRelativeToCamera(this.positions[0][0], this.positions[0][1], 1, 1));
		
		// Head
		ctx.drawImage(snake.sprites.player.spritesheets[0], ...snake.sprites.player.getSprite("face_" + this.direction)?.correctedRectArr, ...calculateRelativeToCamera(this.positions[this.positions.length - 1][0], this.positions[this.positions.length - 1][1], 1, 1));

		// Body
		for(let i = 1; i < this.positions.length - 1; i++) {
			let out = [this.positions[i][2], this.positions[i+1][2]];
			if(this.positions[i][2] != this.positions[i+1][2]) {
				ctx.drawImage(snake.sprites.player.spritesheets[0], ...snake.sprites.player.getSprite('curve_' + out[0] + '_' + out[1])?.correctedRectArr, ...calculateRelativeToCamera(this.positions[i][0], this.positions[i][1], 1, 1));
			} else {
				ctx.drawImage(snake.sprites.player.spritesheets[0], ...snake.sprites.player.getSprite("straight_" + out[0])?.correctedRectArr, ...calculateRelativeToCamera(this.positions[i][0], this.positions[i][1], 1, 1));
			}
		}
	}

	gainPoints(amount) {
		this.points += amount;
	}

	crawlTo(nextPosition) {
		this.pos[0] = nextPosition[0];
		this.pos[1] = nextPosition[1];

		this.positionTail = this.positions.shift();
		this.positions.push([nextPosition[0], nextPosition[1], this.direction]);
		this.invincibleTicks = 50;
	}

	tickPlayer() {
		let moveThisTick = false;
		let nextPosition = [this.pos[0], this.pos[1]];

		if(snake.data.tick.count % snake.config.movespeed == snake.config.movespeed - 1) {
			this.direction = this.directionNext;
		}

		if(snake.data.tick.count % snake.config.movespeed == 0) {
			if(this.smoothMovement.disableFrames > 0) {
				this.smoothMovement.disableFrames--;
			}
			if(this.stunFrames > 0) {
				this.stunFrames--;
				return;
			}
			moveThisTick = true;
			if(this.direction == "up") {
				if(snake.config.wrapField && this.pos[1] == 0) {
					nextPosition[1] = snake.config.fieldHeight - 1;
				} else {
					nextPosition[1]--;
				}
		
			} else if(this.direction == "down") {
				if(snake.config.wrapField && this.pos[1] == snake.config.fieldHeight - 1) {
					nextPosition[1] = 0;
				} else {
					nextPosition[1]++;
				}
		
			} else if(this.direction == "left") {
				if(snake.config.wrapField && this.pos[0] == 0) {
					nextPosition[0] = snake.config.fieldWidth - 1;
				} else {
					nextPosition[0]--;
				}
		
			} else if(this.direction == "right") {
				if(snake.config.wrapField && this.pos[0] == snake.config.fieldWidth - 1) {
					nextPosition[0] = 0;
				} else {
					nextPosition[0]++;
				}
			}
	
			if(nextPosition[0] != this.positions[this.positions.length - 2][0] || nextPosition[1] != this.positions[this.positions.length - 2][1]) {
				this.crawlTo(nextPosition);

				for(let fruit of snake.data.fruits) {
					if(fruit.checkCollision(this)) {
						fruit.collide(this);
						for(let i = 0; i < fruit.points; i++) {
							this.positions.unshift([this.positions[0][0], this.positions[0][1], this.positions[0][2]]);
						}
					}
				}

				for(let portal of snake.data.portals) {
					if(this.ignoresInstance(portal) || portal.ignoresInstance(this)) {
						continue;
					}
					if(portal.checkCollision(this)) {
						portal.collide(this);
					}
				}

				for(let wall of snake.data.walls) {
					if(wall.checkCollision(this)) {
						wall.collide(this);
					}
				}
			} else {
				if(this.directionNext == "right") {
					this.direction = "left";
				} else if(this.directionNext == "left") {
					this.direction = "right";
				} else if(this.directionNext == "up") {
					this.direction = "down";
				} else if(this.directionNext == "down") {
					this.direction = "up";
				}
			}

			if(this.checkCollisionWithTail()) {
				this.collide(this);
			}
	
			this.points = (this.positions.length - this.initialLength) + 1;
			this.previousMove = [this.pos[0], this.pos[1], this.direction];
		} else if(snake.data.tick.count % snake.config.movespeed == snake.config.movespeed - 1) {
			if(this.portal.ignoreFrames > 0) {
				this.portal.ignoreFrames--;
				return;
			}
			if(this.inactiveElements.includes("portal")) {
				this.inactiveElements = this.inactiveElements.filter(e => e !== "portal");
			}
		}
	}
}
