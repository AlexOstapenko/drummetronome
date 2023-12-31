class CustomTagParser {

	/*
	Context is the parent object that should have method createRhythmPlayerControl( context )
	*/
	static parseRhythmPlayerTags(content, context) {
		const customTag = "rhythmplayer";

		content = CustomTagParser.replaceAllTags( content, customTag, (innerContent, params, fullTagText) => {
			let rhythmPlayerControl = context.createRhythmPlayerControl( context );
			rhythmPlayerControl.setXML(fullTagText);
			let html = 
			`<div id="rhythm-player-control-${rhythmPlayerControl.id}">
				${rhythmPlayerControl.render()}
			</div>`;

			return html;
		});

		return content;
	}

	static parseDisplayRhythmTags(content) {
		const customTag = "displayrhythm";
		content = CustomTagParser.replaceAllTags( content, customTag, (innerContent, params) => {

			let textSize = params.size ? params.size : "big";
			let additionalClass = "rhythm-to-display-text-" + textSize;
			let textToDisplay = innerContent;
			// TODO: maybe a more clever processing?
			textToDisplay = nonEmptyValues( textToDisplay.split("\n")).join("<br>");
			return `<div class='rhythm-to-display ${additionalClass}'>${textToDisplay}</div>`;
		});
		
		return content;
	}

	static parseFoldableSections(text) {
		const customTag = "foldable-section";
		let idCounter = 0;
		let result = CustomTagParser.replaceAllTags( text, customTag,
			(innerContent, params) => FoldableSectionRenderer.render( innerContent, params, idCounter++) );

		return result;
	}

	// This function helps to provide integer counter to the page. If there is a list of items and
	// you want to make auto-indexing to not write directly 1, 2, 3, 4..., you can define <int-counter>
	// tag, set a name and all values and just mention it on the page as a calculated value 
	// like this: $[name_of_counter].
	// Each occurence will be automatically replaced with the increasing number. 
	// Example: 
	//     <int-counter name="N" value="10" step="2"></int-counter>      - definition of the counter
	//     This is number $[N], and this is number $[N].                 - calculated values 
	// Will be turned to:
	//      This is number 10, and this is number 12.
	static parseIntCounters(text) {
		const customTag = "int-counter";

		let arrIntCounters = [];
		// here we collect all the definitions of different counter and 
		// for each we create a dedicated IntCounter object. 
		text = CustomTagParser.replaceAllTags( text, customTag, (innerContent, params) => {
				// ignore inner content, we are interested in params
				// default values
				if (!params.value) params.value = "1";
				if (!params.step) params.step = "1";

				arrIntCounters.push( new IntCounter(params.name, params.value, params.step) );

				return ""; // this tag is not for direct html generation, it is for definition of counters,
							// so, this callback returns "" to prevent tag's presence in the final html
			});

		// now process each counter's calculated values $[name-of-counter] on the page
		arrIntCounters.forEach( intCounter => {
			text = CustomTagParser.replaceAllCalculatedValues(text, intCounter.name, (name, sameValueRequested) => {
				let result = -1;
				if (intCounter.isFirstTime) {  // at the first time don't increment the value
					result = intCounter.value;
					intCounter.makeSnapshot();
					intCounter.isFirstTime = false; 
				} else {
					if (sameValueRequested) // don't increment as there is request to the same value as previous
						result = intCounter.value
					else {
						result = intCounter.increment();
						intCounter.makeSnapshot();
					}
				}

			  	return result+"";
			});
		});

		return {text, intCounters: arrIntCounters};
	}

	// In the lesson or in module description, or in the course description there could be a reference (link)
	// to some particular lesson or module.
	// <ref# params>Text</ref#>
	// params could be: module="" lesson="", either both or just the module.
	// context is an object {course: , module: , lesson: }. Module and lesson are optional.
	static parseInternalReferences(text, context) {
		const customTag = "ref#";
		text = CustomTagParser.replaceAllTags( text, customTag, (innerContent, params) => {

			if (params.module && params.lesson) {// this is reference to a lesson
				let moduleFolder = params.module === "#" ? context.module.moduleFolder : params.module;
				let lessonID = Course.makeLessonID(context.course.id, moduleFolder, params.lesson );
				let internalRefHTML =  
				`<span onclick='onClickLessonPreview("${lessonID}");' class='inner-reference'>${innerContent}</span>`;

				return internalRefHTML;
			}
			else if (params.module) { // this is reference to a module
				let moduleFolder = params.module === "#" ? context.module.moduleFolder : params.module;
				let moduleID = Course.makeModuleID(context.course.id, moduleFolder);
				let internalRefHTML =  `<span onclick='onClickModulePreview("${moduleID}");' 
								class='inner-reference'>${innerContent}</span>`;
				return internalRefHTML;
			}
			else return "";
		});
		return text;
	}

	// <rhythm-repeat n="2"> - decoration in displayrhythm section to make it more convenient to read
	static parseRhythmRepeat( text ) {
		const customTag = "rhythm-repeat";
		let idCounter = 0;
		let result = CustomTagParser.replaceAllTags( text, customTag,
			(innerContent, params) => {
				
				let html = 
				`<div><img src="img/repetition_line_1.png"/>
				${innerContent}
				<img src="img/repetition_line_2.png"/>:${params.n}</div>`;
				return html;
			});

		return result;
	}

	// There could be many exercises on the lesson page and one or many buttons "Go to random exercise".
	// Exercises should be organised into groups
	// <random-exercise-button elementID='warmup_exercise_' counter='N' 
	//        appearance='small'>Перейти на случайное упражнение</random-exercise-button>

	static parseRandomExerciseButtons(text) {
		const customTag = "random-exercise-button";
		let result = CustomTagParser.replaceAllTags( text, customTag, 
			(innerContent, params) => {
				let className = params.appearance == "small" ? "button-random-exercise-modest" : "button-random-exercise";
				let html = 
				`<button onclick="gotoRandomExercise('${params.elementID}', '${params.counter}');" 
						class="${className}">${innerContent}
				</button>`;
				return html;
			});

		return result;
	}

	/*
	Inner content of the tag is the base to build a random exercise. It is expected to be:
	
	phraseA-1, phraseA-2, praseA-3, ...
	-----
	phraseB-1, phraseB-2, ...
	-----
	...

	*/
	static parseRandomExerciseGenerator(text, context) {
		const customTag = "random-exercise-generator";
		let result = CustomTagParser.replaceAllTags( text, customTag, 
			(innerContent, params) => {
				return RandomExerciseRenderer.renderRandomExerciseGenerator(context, innerContent, params);
			});

		return result;
	}

	static parseRhythmRandomizer(text, context) {
		const customTag = "rhythm-randomizer";
		let result = CustomTagParser.replaceAllTags( text, customTag, 
			(innerContent, params) => {
				return RandomExerciseRenderer.renderRhythmRandomizer(context, innerContent, params);
			});

		return result;
	}

	////////////////////////////////////////////////////////////////////////////////////


	// Generic methog to replace all given tags and call a function for each tag
	// callback( tagInnerContent, params, fullTagText)
	// if the tag has some params, they will be passed to callback function as a second parameter
	// In some cases you may need not only innerContent but full tag text from opening tag to closing tag.
	// callback gets it as a third parameter
	static replaceAllTags(content, tagName, funcTagProcessor) {
		let closingTag = `</${tagName}>`;
		let idx1 = content.indexOf("<" + tagName);
		while( idx1 >=0 ) {

			let idx1_1 = content.indexOf( ">", idx1);
			if (idx1_1==-1)  throw SyntaxError(`The opening tag '${tagName}' does't have the closing '>'.`);

			let paramsRaw = content.substring(idx1+1 + tagName.length, idx1_1);
			let params = CustomTagParser.parseParams( paramsRaw );

			let idx2 = content.indexOf( closingTag );
			if (idx2==-1) throw SyntaxError(`Closing tag not found for '${tagName}'.`);
			let idx2_2 = idx2 + closingTag.length;
			
			let innerContent = content.substring( idx1_1+1, idx2 ).trim();
			let fullTagText = content.substring( idx1, idx2_2 ).trim();
			
			content = content.substring(0, idx1) + 
					funcTagProcessor( innerContent, params, fullTagText ) +
					content.substring( idx2_2 );

			idx1 = content.indexOf(`<${tagName}`);
		}

		return content;
	}

	// params should be separated by space.
	// can be or single name like "closed", "muted",
	// or key=value
	// Return: object with paramName=paramValue keys/value pairs.
	static parseParams(rawString) {
		let result = {};
		//let encodedString = encodeURIComponent(rawString.trim()); // Кодируем строку
		let nodeText = `<root><node ${rawString}></node></root>`;
		let xmlParser = new DOMParser();
		let xmlDoc = xmlParser.parseFromString( nodeText, "text/xml" );

		// Проверяем, есть ли ошибки при парсинге
	    var parseErrors = xmlDoc.getElementsByTagName('parsererror');
	    if (parseErrors.length > 0) {
	      throw new Error('XML parsing error: ' + parseErrors[0].textContent.trim());
	    }

		let node = xmlDoc.querySelector("node");

		for (let i = 0; i < node.attributes.length; i++) {
    		let attr = node.attributes[i];
			result[attr.name] = attr.value ? attr.value : "";
		};

		return result;
	}

	// finds each occurence of $[name] in content and replaces it to the value from callback function.
	// if $[name!] is found, the value is not increased (same number as before is requested).
	static replaceAllCalculatedValues(content, name, callback) {
		var regex = new RegExp('\\$\\[' + name + '(!|)\\]', 'g');

		// callback to replace matches
		function replacer(match, p1) {
			return callback(name, p1 === '!');
		}

		var result = content.replace(regex, replacer);
		return result;
	}
}

// Responsible for the foldable-section tag on the page.
class FoldableSectionRenderer {
	static get openSectionChar() {return '\u25B6'} // triangle
	static get closedSectionChar() {return '\u25BC'} // triangle

	static render( innerContent, params, id ) {
		const openSectionChar = FoldableSectionRenderer.openSectionChar;
		const closedSectionChar = FoldableSectionRenderer.closedSectionChar;

		const classForTitle = params.state==="0" ? "custom-foldable-section-closed" : "custom-foldable-section-open";
		const styleForContent = params.state==="0" ? `style="display: none"` : 'style="display: block"';
		const onclick = `onclick='FoldableSectionRenderer.onClickFoldableSection(${id})'`;

		let html = 
		`<p>
			<span class='custom-foldable-section-title ${classForTitle}' 
				${onclick}>
				${params.title} 
			</span>
			<span id='span-foldable-section-triangle_${id}' class=${classForTitle}
				${onclick}>
				${params.state==="0" ? openSectionChar : closedSectionChar} 
			</span>
			<span ${params.state==="0" ? "class='custom-foldable-section-thereismore'" : ""} id='foldable-section-thereismore_${id}'
				${onclick}>
				${params.state==="0" ? "..." : ""} 
			</span>
		</p>

		<div ${styleForContent} class='custom-foldable-section-content' id='div-foldable-section_${id}'>
			${innerContent}
		</div>`;

		return html;
	}

	static onClickFoldableSection(id) {
		// show or hide content of a foldable section
		let content = document.querySelector(`#div-foldable-section_${id}`);
		let isClosed = (content.style.display === 'none' || content.style.display === '');
  		content.style.display = (isClosed) ? 'block' : 'none';

  		// set the proper opening or closing triangle
  		document.querySelector(`#span-foldable-section-triangle_${id}`).innerHTML = 
  			isClosed ? FoldableSectionRenderer.closedSectionChar : FoldableSectionRenderer.openSectionChar;

  		// Show/hide THERE IS MORE ... section
  		let thereIsMore = document.querySelector(`#foldable-section-thereismore_${id}`);
  		thereIsMore.classList.toggle("custom-foldable-section-thereismore" );
  		thereIsMore.innerHTML = isClosed ? "" : "...";
	}
}


////////////////////////////////////////////////
class IntCounter {
	constructor(name, value, step) {
		this.name = name;
		this.value = parseInt( value );
		this.step = parseInt( step );
		this.isFirstTime = true;
		this.history = []; // all created numbers.
	}

	makeSnapshot() {
		if (this.history.indexOf(this.value) === -1 )
			this.history.push( this.value );
	}

	increment() {
		this.value += this.step;
		return this.value;
	}
}

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

	static textToShowHTML(rhythmText) {
		let html = (idx, line) => {
			return `<div style='color: gray; display: inline-block; min-width: 40px'>${idx}</div>${line}`;
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
			RandomExerciseRenderer.textToShowHTML(rhythmText), "big"
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
		let rhythmObj = ExerciseGenerator.generateRandomizedRhythm(innerTagContent);
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
			RandomExerciseRenderer.textToShowHTML(rhythmText), "small"
		);

		let id = rhythmPlayerControl.id;

		let html = 
		`<div id="div-random-rhythms-params${id}" style="display: none">
			instrument="${instrument}" tempo="${tempo}" textSize="small"
		</div>
		<div id='div-random-rhythms-base-${id}' style="display: none">${innerTagContent}</div>
		<div id="rhythm-player-control-${id}">
			${rhythmPlayerControl.render()}
		</div>`;

		return html;
	}
}


