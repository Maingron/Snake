export function Config() {
	var gLang = {};

	var config = {
		fieldHeight: 50, // fields
		fieldWidth: 50, // fields
		get canvasHeight() {
			return document.body.offsetHeight; // px
		},
		get canvasWidth() {
			return document.body.offsetWidth; // px
		},
		tps: 120, // Ticks per Second
		movespeed: 20, // Move every nth-tick
		fontSize: "32", // px
		fontFamily: ['Kristen ITC', 'Ink Free', 'Felix Titling', 'system-ui', 'sans-serif'].map(x=>`'${x}'`).join(","),
		wrapField: true,
		availableLangs: ["en", "de"],
		lang: "en"
	};

	config = {
		...config,
		lang: navigator.languages.filter(x=>{
			if(config.availableLangs.includes(x)) {
				return true
			}
		})[0],
		get oneHeight() {
			return this.canvasHeight / this.fieldHeight;
		},
		get oneWidth() {
			return this.canvasHeight / this.fieldHeight;
		},
		get scale() {
			return this.fieldHeight / 16;
		}
	}

	return {
		config: config
	}
}
