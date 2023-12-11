class ModalDiv {
	constructor() {
		this.div = null;
		this.showModal = true;
		this.divID = 'divModalInstrumentLoading';
	}

	show(message) {
		// Создаем div элемент для модального окна
		this.div = document.createElement('div');
		this.div.id = this.divID;
		this.div.className = 'div-modal';

		// Создаем элемент для сообщения
		const messageElement = document.createElement('div');
		messageElement.className = 'div-modal-message';
		messageElement.textContent = message;

		// Добавляем сообщение в модальное окно
		this.div.appendChild(messageElement);

		// Добавляем модальное окно в корневой элемент body
		document.body.appendChild(this.div);

		// Устанавливаем флаг showModal в true, чтобы показать модальное окно
		this.showModal = true;

		// Заблокируем доступ к другим элементам, пока модальное окно открыто
		document.body.style.pointerEvents = 'none';
	}

	hide() { this.close() }

	close() {
		const modal = document.querySelector(`#${this.divID}`);
		if (modal) {
			document.body.removeChild(modal);
			this.showModal = false;

			// Разблокируем доступ к другим элементам
			document.body.style.pointerEvents = 'auto';
		}
	}
}
