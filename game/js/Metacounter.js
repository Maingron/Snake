export function Framecounter() {
	var fpsTimings = [];
	fpsTimings[0] = performance.now();
	fpsTimings[1] = performance.now();

	function pushRenderCall() {
		fpsTimings[0] = fpsTimings[1];
		fpsTimings[1] = performance.now();
	}

	function getFPS() {
		return Math.round(1000 / Math.max(1, (fpsTimings[1] - fpsTimings[0])));
	}

	return {
		pushRenderCall: pushRenderCall,
		getFPS: getFPS
	}
}
