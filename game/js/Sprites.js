export class Sprites {
	constructor(props) {
		this.jsonPath = props?.jsonPath || null;
		this.sheetId = props?.sheetId || null;
		this.sprites = [];
		this.spritesheets = [];
	}


	load() {
		return new Promise((resolve, reject) => {
			if(!this.jsonPath || !this.sheetId) {
				reject("Missing jsonPath or sheetId for sprite loading");
			}
			return fetch(this.jsonPath)
				.then(response => response.json())
				.then(json => {
					let mySheet = json.sheets.find(x => x.id == this.sheetId);
					let myTextures = json.textures.filter(x => x.sheetIndex == mySheet.outputs[0].textureIndices[0]);
					let mySpriteIndexes = [];
					mySpriteIndexes.push(...mySheet.slices[0].spriteIndices);

					let spritesheetPathNormalized = this.jsonPath.split("/").slice(0, -1).join("/") + "/" + mySheet.outputs[0].filename;

					let mySprites = [];
					for(let spriteIndex of mySpriteIndexes) {
						let sprite = json.sprites[spriteIndex];
						sprite.path = spritesheetPathNormalized;
						sprite.scale = myTextures[0].scale;
						sprite.correctedRect = {
							x: sprite.rect.x * myTextures[0].scale,
							y: sprite.rect.y * myTextures[0].scale,
							w: sprite.rect.w * myTextures[0].scale,
							h: sprite.rect.h * myTextures[0].scale
						};
						sprite.correctedRectArr = Object.values(sprite.correctedRect);
						mySprites.push(sprite);
					}
					this.sprites = mySprites;
					return mySprites;
				})
				.then(sprites => {
					return new Promise((resolve, reject) => {
						this.spritesheets[0] = new Image();
						this.spritesheets[0].src = sprites[0].path;
						this.spritesheets[0].onload = () => {
							for(let sprite of this.sprites) {
								sprite.spritesheet = this.spritesheets[0];
							}
							resolve();
						}
						this.spritesheets[0].onerror = (err) => {
							reject(err);
						}
					}).then(() => {
						resolve();
					})
					.catch(err => {
						reject(err);
					});
				})
		});

	}

	getSprite(id) {
		let foundSprite = this.sprites.find(x => x.id == id) || null;
		if(!foundSprite) {
			console.warn("Sprite with id " + id + " not found");
			foundSprite = this.sprites[0] || null;
		}
		return foundSprite;
	}
}
