const LOCALIZATION = {
	"RU" : {
		"course": {
			"course": "Курс",
			"module": "Модуль",
			"modules" : "Модули",
			"lesson" : "Урок",
			"lessons" : "Уроки",
			"backToCourse" : "Курс",
			"backToModule" : "Модуль"
		},
		controls: {
			playerTitle : "Ритм",
			tempoTitle: "Темп"
		},

	},
	"EN" : {
		"course": {
			"course": "Course",
			"module": "Module",
			"modules" : "Modules",
			"lesson" : "Lesson",
			"lessons" : "Lessons",
			"backToCourse" : "Back to the course",
			"backToModule" : "Back to the module"
		},
		controls: {
			playerTitle : "Rhythm",
			tempoTitle: "Tempo"
		}
	}
}

let CURRENT_LOCALIZATION = "RU";

function CURR_LOC() { return LOCALIZATION[ CURRENT_LOCALIZATION ]; }