export function Config() {
	var gLang = {};

	var config = {
		fieldHeight: 14, // fields
		fieldWidth: 14, // fields
		canvasHeight: Math.min(document.body.offsetHeight,document.body.offsetWidth) - 60, // px
		canvasWidth: Math.min(document.body.offsetHeight,document.body.offsetWidth) - 60, // px
		tps: 120, // Ticks per Second
		fps: 60, // Frames per Second
		movespeed: 18, // Move every nth-tick
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
		oneWidth: config.canvasWidth / config.fieldWidth
	}

	return {
		config: config
	}
}
