export class Water extends GenericEntity {
	constructor(props) {
		const thisWater = super(props);
		Object.assign(thisWater, {
			type: "water",
			face: "all",
			zIndex: 5,
			sprite: {
				...thisWater.sprite,
				id: 'water',
				sheetObject: snake.sprites.water,
			},
			...props
		});
	}
}
