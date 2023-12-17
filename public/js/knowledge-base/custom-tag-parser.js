class CustomTagParser {

	static get openSectionChar() {return '\u25B6'}
	static get closedSectionChar() {return '\u25BC'}

	static parseFoldableSections(text) {
		const tagFoldableSection = "foldable-section";
		let idx = 0;

		let openSectionChar = CustomTagParser.openSectionChar;
		let closedSectionChar = CustomTagParser.closedSectionChar;

		let result = CustomTagParser.replaceAllTags(
			text, tagFoldableSection,
			(innerContent, params) => {

				let classForTitle = params.state==="0" ? "custom-foldable-section-closed" : "custom-foldable-section-open";
				let styleForContent = params.state==="0" ? `style="display: none"` : 'style="display: block"';
				let onclick = `onclick='CustomTagParser.onClickFoldableSection(${idx})'`;

				let html = 
				`<p>
					<span class='custom-foldable-section-title ${classForTitle}' 
						${onclick}>
						${params.title} 
					</span>
					<span id='span-foldable-section-triangle_${idx}' class=${classForTitle}
						${onclick}>
						${params.state==="0" ? openSectionChar : closedSectionChar} 
					</span>
					<span ${params.state==="0" ? "class='custom-foldable-section-thereismore'" : ""} id='foldable-section-thereismore_${idx}'
						${onclick}>
						${params.state==="0" ? "..." : ""} 
					</span>
				</p>

				<div ${styleForContent} class='custom-foldable-section-content' id='div-foldable-section_${idx}'>
					${innerContent}
				</div>`;

				idx++;
				return html;
		});

		return result;
	}

	static onClickFoldableSection(id) {
		// show or hide content of a foldable section
		let content = document.querySelector(`#div-foldable-section_${id}`);
		let isClosed = (content.style.display === 'none' || content.style.display === '');
  		content.style.display = (isClosed) ? 'block' : 'none';

  		// set the proper opening or closing triangle
  		document.querySelector(`#span-foldable-section-triangle_${id}`).innerHTML = 
  			isClosed ? CustomTagParser.closedSectionChar : CustomTagParser.openSectionChar;

  		// Show/hide THERE IS MORE ... section
  		let thereIsMore = document.querySelector(`#foldable-section-thereismore_${id}`);
  		thereIsMore.classList.toggle("custom-foldable-section-thereismore" );
  		thereIsMore.innerHTML = isClosed ? "" : "...";
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

}