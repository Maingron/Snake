export function Config() {
	var gLang = {};

	var config = {
		fieldHeight: 14, // fields
		fieldWidth: 14, // fields
		canvasHeight: Math.min(document.body.offsetHeight,document.body.offsetWidth) - 60, // px
		canvasWidth: Math.min(document.body.offsetHeight,document.body.offsetWidth) - 60, // px
		tps: 120, // Ticks per Second
		movespeed: 18, // Move every nth-tick
		fontSize: "32", // px
		fontFamily: ['Kristen ITC', 'Ink Free', 'Felix Titling', 'system-ui', 'sans-serif'].map(x=>`'${x}'`).join(","),
		wrapField: true,
		availableLangs: ["en", "de"],
		lang: "en"
	};

	config.lang = navigator.languages.filter(x=>{
		if(config.availableLangs.includes(x)) {
			return true
		}
	})[0];


	import("../lang/"+ config.lang +".lang.js").then(lang => {
		gLang = lang.lang;
		return lang;
	}).then(lang => {
		console.log(gLang);
	});

	window.setInterval(function() {
		console.log(gLang)
	},100);


	this.getLang = function(request) {
		if(typeof(gLang) != "undefined" && gLang[request] && gLang[request] != "") {
			return gLang[request];
		} else {
			return request;
		}
	}

	return {
		config: config,
		getLang: this.getLang
	}
}
