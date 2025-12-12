class Fruit {
	constructor(props) {
		Object.assign(this, {
			type: "Apple",
			points: 1,
			pos: this.getPos(),
			...props
		});

		this.getEaten = function() {
			snake.data.player.length++;
		};

		this.setNewPosition = function(newPosition = this.getPos()) {
			this.pos = newPosition;
		}

		this.checkCollision = function(otherObjectPos) {
			return this.pos[0] == otherObjectPos[0] && this.pos[1] == otherObjectPos[1];
		}
	}

	getPos() {
		var randomCoordinates;
		var nopeCount = 10000;

		do {
			nopeCount--;
			randomCoordinates = [randomize(snake.config.fieldWidth), randomize(snake.config.fieldHeight)];
		} while (checkIfPlayerCollision(randomCoordinates) && nopeCount > 0);

		return randomCoordinates;
	}
}

export class Apple extends Fruit {
	constructor() {
		super({
			type: "Apple"
		});
	}
}

export class Orange extends Fruit {
	constructor() {
		super({
			type: "Orange",
			points: 5
		});
	}
}
