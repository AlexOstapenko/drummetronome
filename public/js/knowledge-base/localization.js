const LOCALIZATION = {
	"RU" : {
		"course": {
			"course": "Курс",
			"module": "Модуль",
			"modules" : "Модули",
			"lesson" : "Урок",
			"lessons" : "Уроки",
			"backToCourse" : "Вернуться к курсу",
			"backToModule" : "Вернуться к модулю",
			"prevLesson" : "<< Предыдущий урок", 
			"nextLesson" : "Следующий урок >>",
			"nextModule" : "Следующий модуль >>>>"
		},
		controls: {
			playerTitle : "Ритм",
			tempoTitle: "Темп"
		},
		messages: {
			"lessoNotAvailable" : "Урок не доступен."
		}
	},
	"EN" : {
		"course": {
			"course": "Course",
			"module": "Module",
			"modules" : "Modules",
			"lesson" : "Lesson",
			"lessons" : "Lessons",
			"backToCourse" : "Back to the course",
			"backToModule" : "Back to the module",
			"prevLesson" : "<< Previous lesson", 
			"nextLesson" : "Next lesson >>",
			"nextModule" : "Next module >>>>"
		},
		controls: {
			playerTitle : "Rhythm",
			tempoTitle: "Tempo"
		},
		messages: {
			"lessoNotAvailable" : "The lesson is not available."
		}
	}
}

let CURRENT_LOCALIZATION = "RU";

function CURR_LOC() { return LOCALIZATION[ CURRENT_LOCALIZATION ]; }