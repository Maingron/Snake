export default class GenericEntity {
	static allInstances = [];
	constructor(props) {
		const thisEntity = this;

		Object.assign(this, {
			pos: [0, 0, 1, 1],
			zIndex: 9,
			variant: null,
			face: null,
			collisionDirectional: false, // or "same", "opposite"
			collision: {
				active: true
			},
			ignoreInstances: [],
			sprite: {},
			...props
		});

		this.sprite = {
			sheetObject: snake.sprites.main,
			id: thisEntity.spriteId,
			opacity: 1,
			rotate: 0,
			animate: null,
			getSprite: function(id = thisEntity.sprite.id) {
				let idStringResult = id;
				if(thisEntity.variant != null) {
					idStringResult += thisEntity.variant;
				}
				if(thisEntity.face != null) {
					idStringResult += "_" + thisEntity.face;
				}
				return thisEntity.sprite.sheetObject.getSprite(idStringResult);
			},
			...this.sprite,
		}


		GenericEntity.allInstances.push(this);
	}
	checkCollision(otherObject) {
		if(this.collision.active == false) {
			return false;
		}
		let otherObjectPos;
		if(otherObject instanceof GenericEntity) {
			otherObjectPos = otherObject.pos;
		} else {
			otherObjectPos = otherObject;
		}
		if(this.collisionDirectional) {
			if(this.collisionDirectional == "same") {
				if(otherObject.direction != this.face && this.face != "all") {
					return false;
				}
			} else if(this.collisionDirectional == "opposite") {
				if(otherObject.direction == this.face && this.face != "all") {
					return false;
				}
			}
		}
		if(this.pos[0] == otherObjectPos[0] && this.pos[1] == otherObjectPos[1]) {
			return true;
		}
		return false;
	}

	collide(otherObject) {
		console.log("Collide function not implemented for", this);
		// override in child classes
	}

	tick() {
		this.ignoreInstances = this.ignoreInstances.filter(instance => {
			instance[1]--;
			return instance[1] > 0;
		});
	}

	die() {
		this.status = "dead";
		delete GenericEntity.allInstances[GenericEntity.allInstances.indexOf(this)];
		GenericEntity.allInstances = GenericEntity.allInstances.filter(instance => instance != null);
	}

	draw(ctx) {
		ctx.globalAlpha = this.sprite.opacity;
		ctx.drawImage(this.sprite.sheetObject.spritesheets[0], ...this.sprite.getSprite().correctedRectArr, ...calculateRelativeToCamera(...this.pos, 1, 1));
	}

	inViewport() {
		// TODO
		return true;
	}

	ignoresInstance(instance) {
		for(let ignoreInstance of this.ignoreInstances) {
			if(ignoreInstance[0] == instance || instance.constructor.name == ignoreInstance[0].name) {
				return true;
			}
		}
		return false;
	}
}
