class InstrumentVisualizer {
	constructor() {
		this.canvasManager = new CanvasManager();
	}

	init() {
		this.canvasManager.init();
	}

	show() {
		let currInstance = instrumentRackUI.rack.getSelectedInstance();
		if ( currInstance && currInstance.instrument.images.largeImg ) {
			this.canvasManager.show();
			this.drawInstrument(currInstance);
		}

	}

	hide() {
		this.canvasManager.hide();
	}

	drawInstrument(instance) {
		// draw the image
		let canvas = this.canvasManager.canvas;
		let ctx = canvas.getContext('2d');
		ctx.drawImage(instance.instrument.images.largeImg, 0, 0, canvas.width, canvas.height);
	}

	// When instrument is selected in rack - let's update the image
	onRackChanged(rack) {
		let instance = instrumentRackUI.rack.getSelectedInstance();

		if ( instance && instance.instrument.images.largeImg ) {
			this.show();
			let canvas = this.canvasManager.canvas;
			canvas.addEventListener('click', this.handleCanvasClick.bind(this) );
		}
		else {
			let canvas = this.canvasManager.canvas;
			canvas.removeEventListener( 'click', this.handleCanvasClick.bind(this) );
			this.hide();
		}
	}

	handleCanvasClick(event) {

		let currInstance = instrumentRackUI.rack.getSelectedInstance();
		if ( !currInstance || !currInstance.instrument.images.largeImg ) return;

		 // Получаем доступ к элементу canvas
		let canvas = this.canvasManager.canvas;
		let ctx = canvas.getContext('2d');

		// Ваш массив координат x, y
		var coordinates = currInstance.instrument.strokeCoordinates;


		// Радиус области, в которой срабатывает клик
		var R = 35;

		// Радиус полупрозрачного круга
		var R1 = 35;

		var clickX = 0; //event.clientX - canvas.getBoundingClientRect().left;
		var clickY = 0; //event.clientY - canvas.getBoundingClientRect().top;

		if (event.touches && event.touches.length > 0) {
	      // Если есть касание, используем его координаты
	      clickX = event.touches[0].clientX - canvas.getBoundingClientRect().left;
	      clickY = event.touches[0].clientY - canvas.getBoundingClientRect().top;
	    } else {
	      // Иначе используем координаты клика мыши
	      clickX = event.clientX - canvas.getBoundingClientRect().left;
	      clickY = event.clientY - canvas.getBoundingClientRect().top;
	    }

		// Проверяем, находится ли клик в радиусе R от какой-то точки
		for (var i = 0; i < coordinates.length; i++) {

			var distance = Math.sqrt(Math.pow(clickX - coordinates[i].x, 2) + Math.pow(clickY - coordinates[i].y, 2));

			if (distance <= R) {
				audioFilePlayer.turnOnSound();
				audioFilePlayer.playStroke( {instrumentName: currInstance.instrument.instrumentName, 
											strokeName: coordinates[i].stroke}, 0);

				// Рисуем полупрозрачный желтый круг
				ctx.beginPath();
				ctx.arc(coordinates[i].x, coordinates[i].y, R1, 0, 2 * Math.PI);
				ctx.fillStyle = 'rgba(255, 255, 0, 0.5)';
				ctx.fill();

				// Анимация затухания
				var startTime = Date.now();

				function initAnimate(x, y,  idx) {

					function animate() {
						var elapsedTime = Date.now() - startTime;
						var alpha = 1 - (elapsedTime / 500); // 500 миллисекунд для затухания

						ctx.clearRect(0, 0, canvas.width, canvas.height);
						instrumentVisualizer.drawInstrument(currInstance);

						// Рисуем полупрозрачный круг с измененной прозрачностью
						ctx.beginPath();
						ctx.arc(x, y, R1, 0, 2 * Math.PI);
						ctx.fillStyle = 'rgba(255, 255, 0, ' + alpha + ')';
						ctx.fill();

						// Если еще не затухло полностью, продолжаем анимацию
						if (alpha > 0) {
							requestAnimationFrame(animate);
						}
					}

					// Запускаем анимацию
					animate();
				}

				initAnimate(coordinates[i].x, coordinates[i].y, i);
				
			}
		}
	}
}

const instrumentVisualizer = new InstrumentVisualizer();

