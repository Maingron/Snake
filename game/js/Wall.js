export class Wall {
	constructor(props) {
		Object.assign(this, {
			type: "wall",
			face: "all",
			pos: [0,0],
			...props
		});


		this.checkCollision = function(otherObjectPos) {
			return this.pos[0] == otherObjectPos[0] && this.pos[1] == otherObjectPos[1];
		}
	}
}

// export class Wall extends Wall {
// 	constructor() {
// 		super({
// 			type: "Apple"
// 		});
// 	}
// }
