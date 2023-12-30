class CustomTagParser {

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
	static parseInternalReferences(text, funcReferenceProcessor) {
		const customTag = "ref#";
		text = CustomTagParser.replaceAllTags( text, customTag, (innerContent, params) => {
			return funcReferenceProcessor(innerContent ? innerContent : "", params);
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
				`<div><b style='color: gray'>---------</b>
				${innerContent}
				<b style='color: gray;'>---------</b>:${params.n}</div>`;
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
	
	////////////////////////////////////////////////////////////////////////////////////


	// Generic methog to replace all given tags and call a function for each tag
	// if the tag has some params, they will be passed to callback function as a second parameter
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
			
			content = content.substring(0, idx1) + 
					funcTagProcessor( innerContent, params ) +
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

