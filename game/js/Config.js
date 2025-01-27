export function Config() {
	var gLang = {};

	var config = {
		fieldHeight: 50, // fields
		fieldWidth: 50, // fields
		canvasHeight: document.body.offsetHeight, // px
		canvasWidth: document.body.offsetWidth, // px
		tps: 120, // Ticks per Second
		movespeed: 12, // Move every nth-tick
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
		oneHeight: config.canvasHeight / config.fieldHeight,
		oneWidth: config.canvasHeight / config.fieldHeight,
		scale: config.fieldHeight / 16
	}

	return {
		config: config
	}
}
