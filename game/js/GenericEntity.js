export default class GenericEntity {
	constructor(props) {
		const thisEntity = this;

		Object.assign(this, {
			pos: [0,0],
			sprite: {
				sheetObject: null,
				id: null,
				getSprite: function(id = thisEntity.sprite.id) {
					return thisEntity.sprite.sheetObject.getSprite(id);
				}
			},
			...props
		});
	}

	checkCollision(otherObjectPos) {
		return this.pos[0] == otherObjectPos[0] && this.pos[1] == otherObjectPos[1];
	}

	draw(ctx) {
		ctx.drawImage(this.sprite.sheetObject.spritesheets[0], ...this.sprite.getSprite().correctedRectArr, ...calculateRelativeToCamera(...this.pos, 1, 1));
	}
}
