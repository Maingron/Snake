export default class LevelLoader {
	constructor(props) {
		const thisLevel = this;
	}

	importLevelFile(levelFile) {
		return fetch(levelFile)
			.then(response => response.json())
			.then(levelData => {
				Object.assign(this, levelData);
				return this;
			});
	}
}
