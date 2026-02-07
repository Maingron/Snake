export class Wall extends GenericEntity {
	constructor(props) {
		const thisWall = super(props);
		Object.assign(thisWall, {
			type: "wall",
			face: "all",
			pos: [0,0],
			collisionDirectional: "same",
			sprite: {
				...thisWall.sprite,
				id: "wall",
				sheetObject: snake.sprites.main,
			},
			...props
		});
	}

	collide(otherObject) {
		if(otherObject instanceof Player) {
			otherObject.die();
		}
	}
}
