export class Portal extends GenericEntity {
	constructor(props) {
		const thisPortal = super(props);

		Object.assign(thisPortal, {
			type: "portal",
			face: "all",
			pos: [0,0],
			posDest: [10,10],
			pairColor: this.randomColor(),
			ignoreInstances: [],
			sprite: {
				...thisPortal.sprite,
				id: "portal",
				sheetObject: snake.sprites.main,
			},
			...props
		});
	}

	randomColor() {
		let letters = '0123456789ABCDEF';
		let color = '';
		for (var i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		return this.pairColor = color;
	}

	draw(ctx) {
		super.draw(ctx);
		if(snake.config?.dev?.portals?.drawConnectionLines) {
			ctx.beginPath();
			ctx.setLineDash([5, 15]);
			ctx.strokeStyle = "#" + this.pairColor;
			ctx.lineWidth = 5;
			ctx.moveTo(...calculateRelativeToCamera(this.pos[0] + .5, this.pos[1] + .5, 1, 1));
			ctx.lineTo(...calculateRelativeToCamera(this.posDest[0] + .5, this.posDest[1] + .5, 1, 1));
			ctx.stroke();
		}
	}

	tick() {
		this.ignoreInstances = this.ignoreInstances.filter(instance => {
			instance[1]--;
			return instance[1] > 0;
		});
	}

	collide(otherObject) {
		if(otherObject instanceof Player) {
			if(otherObject.direction == this.face || this.face == "all") {
				this.ignoreInstances.push([otherObject, 20 * snake.config.movespeed]);
				otherObject.ignoreInstances.push([Portal, 20 * snake.config.movespeed]);
				otherObject.stunFrames = 5;
				otherObject.smoothMovement.disableFrames = 6;
				otherObject.inactiveElements.push("portal");
				otherObject.pos = this.posDest;
				otherObject.crawlTo(this.posDest);
			}
		}
	}

}
