export function Lazyfun(callback) {
	let initFunctionRan = false;

	function init() {
		if(initFunctionRan) {
			return;
		}
		initFunctionRan = true;
		this.loop.startLoop();
		this.eventListeners.onResize.add();
	}

	function loop() {
		let running = false;
		let intervalId;
		function run() {
			if(snake.data.windowInnerWidth != window.innerWidth || snake.data.windowInnerHeight != window.innerHeight) {
				eventFunctions.onResized();
			}
		}
		const funResult = {
			startLoop: function() {
				if (running) {
					return;
				}
				running = true;
				run();
				intervalId = setInterval(() => {
					run()
				}, 1000 / snake.config.lazyTPS);
			},
			stopLoop: function() {
				if (!running) {
					return;
				}
				running = false;
				if (intervalId !== null) {
					clearInterval(intervalId);
					intervalId = null;
				}
			}
		};

		return {
			startLoop: funResult.startLoop,
			stopLoop: funResult.stopLoop,
			get isRunning() {
				return running;
			}
		}
	}

	function eventListeners() {
		return {
			onResize: (function() {
				let isAdded = false;
				return {
					add: function() {
						if(isAdded) {
							return;
						}
						isAdded = true;
						window.addEventListener("resize", eventFunctions.onResized);
					},
					remove: function() {
						if(!isAdded) {
							return;
						}
						isAdded = false;
						window.removeEventListener("resize", eventFunctions.onResized);
					},
					get isAdded() {
						return isAdded;
					}
				}
			})()
		}
	}

	var eventFunctions = {
		onResized: function() {
			snake.data.windowInnerWidth = window.innerWidth;
			snake.data.windowInnerHeight = window.innerHeight;
			snake.config.canvasHeight = document.body.offsetHeight;
			snake.config.canvasWidth = document.body.offsetWidth;
			snake.elements.canvas.height = snake.config.canvasHeight;
			snake.elements.canvas.width = snake.config.canvasWidth;
			snake.elements.canvas.style.backgroundSize = (snake.config.canvasHeight / snake.config.fieldHeight + "px");
			ctx = snake.data.ctx = snake.elements.canvas.getContext("2d");
			applyCSS();
		}
	}
	
	return {
		loop: loop(),
		eventListeners: eventListeners(),
		init: init
	};
}
