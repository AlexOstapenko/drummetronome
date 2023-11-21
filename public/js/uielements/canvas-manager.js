class CanvasManager {
	init() {
		this.canvasContainer = document.getElementById( "canvas-container" );
	}

	get canvas() {
		return document.getElementById( "canvas-visualization" );
	}

	show() {
		this.canvasContainer.style.visibility = "visible";
		this.canvasContainer.style.display = "block";
	}

	hide() {
		this.canvasContainer.style.visibility = "hidden";
		this.canvasContainer.style.display = "none";
	}
}