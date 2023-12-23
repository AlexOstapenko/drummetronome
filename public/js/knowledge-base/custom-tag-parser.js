class CustomTagParser {

	static parseFoldableSections(text) {
		const customTag = "foldable-section";
		let idCounter = 0;
		let result = CustomTagParser.replaceAllTags( text, customTag,
			(innerContent, params) => FoldableSectionRenderer.render( innerContent, params, idCounter++) );

		return result;
	}

	// Parses the custom tag below. Creates object IntCounter and then searches all occurencies 
	// <int-counter name="exerciseNum" value="1" step="1"></int-counter>
	static parseIntCounters(text) {
		const customTag = "int-counter";

		let arrIntCounters = [];
		text = CustomTagParser.replaceAllTags( text, customTag,
			(innerContent, params) => {
				// ignore inner content, we are interested in params
				arrIntCounters.push( new IntCounter(params.name, params.value, params.step) );

				return ""; // this tag is not for direct html generation, it is for information,
							// so, this callback returns "" instead of full custom tag to prevent it's 
							// occurence in the final html
		});

		// now process each counter on the page separately
		arrIntCounters.forEach( intCounter => {
			text = CustomTagParser.replaceAllCalculatedValues(text, intCounter.name, name => {
				let returnValue = intCounter.value;
				intCounter.increment();
				return returnValue;
			});
		});

		return text;
	}

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

	// finds each occurence of ${name} in text and replaces it to the value from callback function
	static replaceAllCalculatedValues(content, name, callback) {
		let substr = "$[" + name + "]";
		let idx1 = content.indexOf(substr);
		while( idx1 >=0 ) {
			let idx2 = idx1 + substr.length;
			
			content = content.substring(0, idx1) + 
					callback( name ) +
					content.substring( idx2 );

			idx1 = content.indexOf(substr);
		}

		return content;
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
	}

	increment() {
		this.value += this.step;
	}
}

