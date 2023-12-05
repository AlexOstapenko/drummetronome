
class InstrumentVisualizer {
    constructor() {
        this.circleR = 40;
        this.visualizationInfo = null;
    }  

    init() {
        this.container = document.getElementById('instrument-visualizer-container');
    }

    handleTouch(event) {
        event.preventDefault();

        for (let i = 0; i < event.touches.length; i++) {
            const touch = event.touches[i];
            this.handleInput(touch.clientX - this.container.offsetLeft, 
                touch.clientY - this.container.offsetTop,
                -this.circleR/2, 0);
        }
    }

    handleMouseClick(event) {
        event.preventDefault();

        console.log( `mouseXY = ${event.clientX}, ${event.clientY}` );

        function getAbsolutePosition(element) {
		    let left = 0;
		    let top = 0;

		    // Проходим вверх по иерархии элементов, добавляя их смещения
		    while (element) {
		        left += element.offsetLeft;
		        top += element.offsetTop;
		        element = element.offsetParent;
		    }

		    return { left, top };
		}

		let containerAbsPos = getAbsolutePosition( this.container );
		console.log( "Abs position: " +  containerAbsPos.left + ", " + containerAbsPos.top );

        this.handleInput(event.clientX - containerAbsPos.left, 
			        	event.clientY - containerAbsPos.top,
			            -this.circleR/2, 0);
    }

    handleInput(x, y, xOffset, yOffset) {

    	console.log( "Handle input: x = " + x + ", y = " + y);

        // Проверяем каждую активную точку
        for (const point of this.visualizationInfo.strokeCoordinates) {
            const distance = Math.sqrt((x - point.x) ** 2 + (y - point.y) ** 2);

            // Если клик находится в радиусе действия точки, рисуем круг
            if (distance <= this.circleR) {
                this.createAndAnimateCircle(point.x+xOffset, point.y+yOffset);
                return; // Прерываем цикл, чтобы не проверять остальные точки
            }
        }
    }

    createAndAnimateCircle(x, y) {
        let newCircle = this.drawPoint( x, y, "yellow" );
        newCircle.style.opacity = 1;
        this.fadeOut(newCircle);
    }

    fadeOut(element) {
        let opacity = 1;

        function animate() {
            if (opacity > 0) {
                opacity -= 0.05;
                element.style.opacity = opacity;
                requestAnimationFrame(animate);
            } else {
                element.style.display = 'none';
                element.remove();
            }
        }

        animate();
    }

    drawPoint(x, y, bgcolor) {
    	bgcolor = bgcolor ? bgcolor : "yellow";
        const circleElement = document.createElement('div');
        circleElement.className = 'instrument-visualizer-stroke-circle';
        circleElement.style.backgroundColor = bgcolor;
        circleElement.style.left = x + "px";
        circleElement.style.top = y + "px";
        this.container.appendChild(circleElement);
        return circleElement;
    }

    drawPoints() {
        for (const point of visualizationInfo.strokeCoordinates) {

            let circleElement = this.drawPoint( 
                point.x*this.canvasDiv.offsetWidth/this.visualizationInfo.size.width - this.circleR/2,
                point.y*this.canvasDiv.offsetHeight/this.visualizationInfo.size.height,
                "red"
            );

            const spanElement = document.createElement('span');
            spanElement.textContent = point.stroke;
            circleElement.appendChild(spanElement);
        }
    }   

    /*
    Attach to InstrumentDefinition
    */
    attachToInstrument( instrument ) {
    	this.visualizationInfo = instrument.visualization;
    }

    createInstrumentImg(instrument) {
    	this.instrumentImg = document.createElement('img');
    	this.instrumentImg.src = `${instrument.folder}/${instrument.images.large}`;
        this.instrumentImg.className = "instrument-visualizer-img";
        this.container.appendChild(this.instrumentImg);

        // Обработчик для события касания (touch) и клика (mousedown)
        this.instrumentImg.addEventListener('touchstart', this.handleTouch.bind(this), { passive: true } );
        this.instrumentImg.addEventListener('mousedown', this.handleMouseClick.bind(this) );
    }

	show() {
		this.hide();
		let currInstance = instrumentRackUI.rack.getSelectedInstance();
		if ( currInstance && currInstance.instrument.images.large && 
			instrumentManager.checkInstrumentVisualizationInfo(currInstance.instrument) ) {
			this.createInstrumentImg(currInstance.instrument);
		}
	}

	hide() {
		this.container.innerHTML = "";
	}

	// When instrument is selected in rack - let's update the image
	onRackChanged(rack) {
		let instance = instrumentRackUI.rack.getSelectedInstance();
		if ( instance && instance.instrument.images.large ) {
			this.attachToInstrument( instance.instrument );
			this.show();
		}
		else
			this.hide();
	}
}

const instrumentVisualizer = new InstrumentVisualizer();

