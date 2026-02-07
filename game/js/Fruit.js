export class Fruit extends GenericEntity {
	constructor(props) {
		const thisFruit = super(props);
		Object.assign(thisFruit, {
			type: "Apple",
			points: 1,
			pos: this.newPosition(),
			sprite: {
				...thisFruit.sprite,
				id: thisFruit.type.toLowerCase(),
				sheetObject: snake.sprites.food,
			},
			...props
		});
	}

	getEaten() {
		snake.data.player.length++;
	}

	newPosition() {
		var randomCoordinates;
		var nopeCount = 20000;

		do {
			nopeCount--;
			randomCoordinates = [randomize(snake.config.fieldWidth), randomize(snake.config.fieldHeight)];
		} while (checkIfPlayerCollision(randomCoordinates) && nopeCount > 0);

		this.pos = randomCoordinates;

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
