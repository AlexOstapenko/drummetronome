class PlayingDurationTimer {

      constructor(divIDTime) {
            this.divIDTime = divIDTime ? divIDTime : "";
            this.intervalID = -1;
            this.startTime = -1;
      }

      setDivID(id) {
            this.divIDTime = id;
      }

      start(intervalID) {

            const timerElement = document.getElementById( this.divIDTime );
            timerElement.innerHTML = "0:00";
            this.startTime = Date.now();
            this.intervalID = setInterval( () => {
                  this.update();
            }, 200);
      }

      stop() {
            clearInterval( this.intervalID );
            const timerElement = document.getElementById( this.divIDTime );
            timerElement.innerHTML = "";
      }

      update() {
            const timerElement = document.getElementById( this.divIDTime );
            const currentTime = Date.now();
            const elapsedTime = Math.floor((currentTime - this.startTime) / 1000);
            const minutes = Math.floor(elapsedTime / 60);
            const seconds = elapsedTime % 60;
            timerElement.innerHTML = `${minutes}:${seconds.toString().padStart(2, '0')}`;
      }
}

const playingDurationTimer = new PlayingDurationTimer('divDurationTimer');