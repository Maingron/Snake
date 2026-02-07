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

	collide(otherObject) {
		if(otherObject instanceof Player) {
			otherObject.gainPoints(this.points);
		}
		this.newPosition();
	}

	newPosition() {
		this.pos = [randomize(snake.config.fieldWidth), randomize(snake.config.fieldHeight)];

		return this.pos;
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
