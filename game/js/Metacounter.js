export function Framecounter() {
    const fpsTimings = [];

    function pushRenderCall() {
        const now = performance.now();
        fpsTimings.push(now);

        // Remove old timestamps beyond the last second
        while (fpsTimings.length > 0 && now - fpsTimings[0] > 1000) {
            fpsTimings.shift();
        }
    }

    function getFPS() {
        if (fpsTimings.length < 2) {
            return 0; // Not enough data to calculate FPS
        }

        const timeSpan = fpsTimings[fpsTimings.length - 1] - fpsTimings[0];
        const frameCount = fpsTimings.length - 1;
        return Math.round((frameCount / timeSpan) * 1000);
    }

    return {
        pushRenderCall,
        getFPS
    };
}
