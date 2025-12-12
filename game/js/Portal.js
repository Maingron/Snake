export class Portal {
	constructor(props) {
		Object.assign(this, {
			type: "portal",
			face: "all",
			pos: [0,0],
			posDest: [10,10],
			...props
		});


		this.checkCollision = function(otherObjectPos) {
			return this.pos[0] == otherObjectPos[0] && this.pos[1] == otherObjectPos[1];
		}
	}
}
