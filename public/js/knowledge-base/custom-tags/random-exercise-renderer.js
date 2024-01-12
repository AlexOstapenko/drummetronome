class RandomExerciseRenderer {

	static createRhythmCardText( instrument, rhythmText, precount, tempo ) {
		let result =
`tempo: ${tempo}
#####
instrument: ${instrument}
rhythm:
${precount ? precount + "\n***\n" : ""}
${rhythmText}`;

		return result;
	};

	static createRhythmPlayerXML( instrument, rhythmText, precount, tempo ) {
		let result = 
			`<rhythmplayer>
				<rhythmcard>
				${RandomExerciseRenderer.createRhythmCardText(instrument, rhythmText, precount, tempo)}
				</rhythmcard>
			</rhythmplayer>`;
		return result;
	}

	static textToShowHTML(rhythmText, showLineNumbers) {

		let exprParser = new ExpressionParser();
		exprParser.varValueInBrackets = false;
		rhythmText = exprParser.parse( rhythmText );

		let html = (idx, line) => {
			let numberPart = showLineNumbers ? `<div style='color: gray; display: inline-block; min-width: 40px'>${idx}</div>` : "";
			return `${numberPart}${line}`;
		};
		return rhythmText.trim().split("\n").map((line,idx) => `${html(idx+1, line)}`).join("\n")
	}

	static renderRandomExerciseGenerator(context, innerTagContent, params) {

		// universal params
		let tempo = parseInt( params.tempo ) || 80;
		let instrument = params.instrument;

		// this randomize operation specific
		let numOfLines = parseInt(params.lines) || 4;
		let limit = parseInt( params.limit) || 2;
		
		// generate random rhythm based on innerContent which should be a set of variations.
		let rhythmObj = ExerciseGenerator.generateSpeedsJugglingExercise(innerTagContent, limit, numOfLines );
		let rhythmText = rhythmObj.rhythm;
		let precount = rhythmObj.precount;

		let rhythmPlayerControl = context.createRhythmPlayerControl( context );
		let xmlText = RandomExerciseRenderer.createRhythmPlayerXML( instrument, rhythmText, precount, tempo);
			
		rhythmPlayerControl.setXML(xmlText);
		rhythmPlayerControl.additionalTitleHtml = 
		`<div class='random-exercice-generator-button-div'>
			<button class="button-random-exercise"
				onclick='onClickGenerateNewRhythm(${rhythmPlayerControl.id}, 
							${ExerciseGenerator.TYPE.speedJuggling})'>${params.buttonLabel || "Новое упражнение"}
			</button>
		</div>`;
		rhythmPlayerControl.htmlForDisplayText = rhythmPlayerControl.renderDisplayRhythmFromText(
			RandomExerciseRenderer.textToShowHTML(rhythmText, params["line-numbers"]==="yes"), "big"
		);

		let id = rhythmPlayerControl.id;

		let html = 
		`<div id="div-random-rhythms-params${id}" style="display: none">
			instrument="${instrument}" limit="${limit}" numOfLines="${numOfLines}" tempo="${tempo}" textSize="big"
		</div>
		<div id='div-random-rhythms-base-${id}' style="display: none">${innerTagContent}</div>
		<div id="rhythm-player-control-${id}">
			${rhythmPlayerControl.render()}
		</div>`;

		return html;
	}

	static renderRhythmRandomizer( context, innerTagContent, params ) {
		// universal params
		let tempo = parseInt( params.tempo ) || 80;
		let instrument = params.instrument;

		// generate random rhythm based on innerContent which should be 
		// a set of variations, precount and rhythm formula.
		let maxRepetitions = params["max-repetitions"] ? parseInt( params["max-repetitions"] ) : -1;
		let rhythmObj = ExerciseGenerator.generateRandomizedRhythm(innerTagContent, maxRepetitions);
		let rhythmText = rhythmObj.rhythm;
		let precount = rhythmObj.precount;

		let rhythmPlayerControl = context.createRhythmPlayerControl( context );
		let xmlText = RandomExerciseRenderer.createRhythmPlayerXML( instrument, rhythmText, precount, tempo);
			
		rhythmPlayerControl.setXML(xmlText);
		rhythmPlayerControl.additionalTitleHtml = 
		`<div class='random-exercice-generator-button-div'>
			<button class="button-random-exercise"
				onclick='onClickGenerateNewRhythm(${rhythmPlayerControl.id}, 
					${ExerciseGenerator.TYPE.rhythmRandomizer})'>${params.buttonLabel || "Случайный ритм"}
			</button>
		</div>`;
		rhythmPlayerControl.htmlForDisplayText = rhythmPlayerControl.renderDisplayRhythmFromText(
			RandomExerciseRenderer.textToShowHTML(rhythmText, params["line-numbers"]==="yes"), params.size || "small"
		);

		let id = rhythmPlayerControl.id;

		let html = 
		`<div id="div-random-rhythms-params${id}" style="display: none">
			instrument="${instrument}" tempo="${tempo}" textSize="small" max-repetitions="${maxRepetitions}"
		</div>
		<div id='div-random-rhythms-base-${id}' style="display: none">${innerTagContent}</div>
		<div id="rhythm-player-control-${id}">
			${rhythmPlayerControl.render()}
		</div>`;

		return html;
	}
}