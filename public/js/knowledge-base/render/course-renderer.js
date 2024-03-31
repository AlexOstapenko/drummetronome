/*
* Renders course, modules and lesson previews.
* For rendering lessons there is specialized class LessonRenderer.
*/

class CourseRenderer {

	constructor() {
		this.divContainerID = "";
		this.bgColorClasses = ['bg-color-yellow', 'bg-color-pink', "bg-color-green", 
			"bg-color-red", "bg-color-blue",  "bg-color-violet", "bg-color-orange"];
	}

	set mainDivID(id) {
		this.divContainerID = id;
	}

	get divContainer() { return document.getElementById(this.divContainerID); }

	renderCoursePreview(course) {
		let html = 
		`<div class="course-preview">
			<img src='${course.img.icon}' onclick='CourseRunnerGlobals.onClickCoursePreview(${course.id})'>
			<div class='course-name'>${course.name}</div>
		</div>`;
		this.divContainer.className = 'courses-container';
		this.divContainer.innerHTML = html;
	}

	renderCourse(course) {

		const bgs = this.bgColorClasses;
		let bgIdx = -1;

		let introHTMLParsed = this.parseCustomTags(course.introHTML);

		let html = 
		`<div class="course-view">
		${this.renderCourseTitle(course)}
		<div class='course-view-intro'>${introHTMLParsed}</div>
		<h1>${CURR_LOC().course.modules}</h1>
		<div class='cards-container'>`;
		course.modules.forEach( m => {
			bgIdx++; if (bgIdx == bgs.length) bgIdx = 0; // choose next overlay color

			html += 
			`<div class="card-preview" onclick="CourseRunnerGlobals.onClickModulePreview('${course.id}@@@${m.moduleFolder}')">
				<div class="card-preview-img-container">
					<img class='card-preview-img' src='${m.img.icon}'>	
					<div class="card-preview-img-overlay ${bgs[bgIdx]}"></div>
				</div>
				<div class='card-preview-name'>${m.name}</div>
			</div>`;
		});
		html += `</div></div>`;
		this.divContainer.className = "";
		this.divContainer.innerHTML = html;	
	}

	renderCourseTitle(course) {
		let result = 
		`<div class='course-view-course-title-container' onclick="CourseRunnerGlobals.onClickCoursePreview(${course.id}, null);">
			<img src='${course.img.titleIcon}' width="50px" height="50px"></img>
			<div class='course-view-course-title'>
				${course.getNameHTML()}
			</div>
		</div>`;
		result = result.split("\n").map(arrItem=>arrItem.trim()).join("");
		return result;
	}


	renderModule(courseModule) {
		let course = courseModule.course;
		const bgs = this.bgColorClasses;
		let bgIdx = -1;

		let renderHeaderLinks = (course) => {
			let html = 
			`<div class='page-header'>
				<span class='lesson-header-link lesson-header-link-1'
					onclick='CourseRunnerGlobals.onClickParentCourse(${course.id})'>${CURR_LOC().course.backToCourse}</span>
			</div>
			`;
			return html;
		};

		let parsedIntroHTML = this.parseCustomTags( courseModule.introHTML, {course: course, module: courseModule});
		let moduleNumber = courseModule.getModuleNumber();
		let html = 
		`<div class="page-container">
			${this.renderCourseTitle(course)}
			<div class="page-content">
				<h2><span class='module-title'>
						${CURR_LOC().course.module} ${moduleNumber}:
					</span> 
					${courseModule.name}
				</h2>
				${parsedIntroHTML}
				<h3>${CURR_LOC().course.lessons}:</h3>
				<div class='cards-container'>`;
			
		courseModule.lessons.forEach( (lesson,idx) => {
		bgIdx++; if (bgIdx == bgs.length) bgIdx = 0; // choose next overlay color

			// add LESSON CARDS
			html += 
					`<div class="card-preview" onclick="CourseRunnerGlobals.onClickLessonPreview('${lesson.id}')">
						<div class="card-preview-img-container">
							<img class='card-preview-img' src='${lesson.img.icon}'>	
							<div class="card-preview-img-overlay ${bgs[bgIdx]}"></div>
						</div>
						<div class='card-preview-name'><b>${idx+1}.</b> ${lesson.name}</div>
					</div>`;
		});
		html += `</div>
			</div>
		</div>`;
		
		this.divContainer.className = "";
		this.divContainer.innerHTML = html;	
	}

	parseCustomTags(content, context) {
		content = CustomTagParser.parseFoldableSections( content );
		content = CustomTagParser.parseInternalReferences( content, context );
		content = CustomTagParser.parseGlobalValues( content, context );
		return content;
	}
}













