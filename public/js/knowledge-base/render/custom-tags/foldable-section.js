// Responsible for the foldable-section tag on the page.
class FoldableSectionRenderer {
	//static get openSectionChar() {return '\u25B6'} // triangle
	//static get closedSectionChar() {return '\u25BC'} // triangle
	static get openSectionChar() {return '<span class="custom-foldable-section-str">+</span>'} // +
	static get closedSectionChar() {return '<span class="custom-foldable-section-str">–</span>'} // -

	static render( innerContent, params, id ) {
		const openSectionChar = FoldableSectionRenderer.openSectionChar;
		const closedSectionChar = FoldableSectionRenderer.closedSectionChar;

		const classForTitle = params.state==="0" ? "custom-foldable-section-closed" : "custom-foldable-section-open";
		const styleForContent = params.state==="0" ? `style="display: none"` : 'style="display: block"';
		const onclick = `onclick='FoldableSectionRenderer.onClickFoldableSection(${id})'`;

		let html = 
		`<div class='custom-foldable-section-container'>
			<div class="custom-foldable-section-title-container">
				<span class='custom-foldable-section-title ${classForTitle}' 
					${onclick}>
					${params.title} 
				</span>
				<span class='custom-foldable-section-toggle' id='foldable-section-toggle_${id}'
					${onclick}>
					${params.state==="0" ? openSectionChar : closedSectionChar}
				</span>
			</div>
			
			<div ${styleForContent} class='custom-foldable-section-content' id='div-foldable-section_${id}'>
				${innerContent}
			</div>
		</div>`;

		return html;
	}



	// static render( innerContent, params, id ) {
	// 	const openSectionChar = FoldableSectionRenderer.openSectionChar;
	// 	const closedSectionChar = FoldableSectionRenderer.closedSectionChar;

	// 	const classForTitle = params.state==="0" ? "custom-foldable-section-closed" : "custom-foldable-section-open";
	// 	const styleForContent = params.state==="0" ? `style="display: none"` : 'style="display: block"';
	// 	const onclick = `onclick='FoldableSectionRenderer.onClickFoldableSection(${id})'`;

	// 	let html = 
	// 	`<div>
	// 	<p>
	// 		<span class='custom-foldable-section-title ${classForTitle}' 
	// 			${onclick}>
	// 			${params.title} 
	// 		</span>
	// 		<span id='span-foldable-section-triangle_${id}' class=${classForTitle}
	// 			${onclick}>
	// 			${params.state==="0" ? openSectionChar : closedSectionChar} 
	// 		</span>
	// 		<span ${params.state==="0" ? "class='custom-foldable-section-thereismore'" : ""} id='foldable-section-thereismore_${id}'
	// 			${onclick}>
	// 			${params.state==="0" ? "..." : ""} 
	// 		</span>
	// 	</p>

	// 	<div ${styleForContent} class='custom-foldable-section-content' id='div-foldable-section_${id}'>
	// 		${innerContent}
	// 	</div>
	// 	</div>`;

	// 	return html;
	// }

	static onClickFoldableSection(id) {
		// show or hide content of a foldable section
		let content = document.querySelector(`#div-foldable-section_${id}`);
		let isClosed = (content.style.display === 'none' || content.style.display === '');
  		content.style.display = (isClosed) ? 'block' : 'none';

  		// // set the proper opening or closing triangle
  		// document.querySelector(`#span-foldable-section-triangle_${id}`).innerHTML = 
  		// 	isClosed ? FoldableSectionRenderer.closedSectionChar : FoldableSectionRenderer.openSectionChar;

  		// Show/hide THERE IS MORE ... section
  		let thereIsMore = document.querySelector(`#foldable-section-toggle_${id}`);
  		//thereIsMore.classList.toggle("custom-foldable-section-thereismore" );
  		thereIsMore.innerHTML = isClosed ? this.closedSectionChar : this.openSectionChar;
	}
}