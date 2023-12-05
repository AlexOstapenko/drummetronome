function onDocumentLoaded() {

	// tempoCtrl = tempoControlsManager.createTempoControl("divTempo2");
	// tempoCtrl.render();

}

function loadCourse() {

	let ocl = new OnlineCourseLoader();
	ocl.loadCourse( "/rhythm-knowledge-base/courses/" + 
		document.getElementById("inputCourseFolder").value, course => {
			console.log( course );

			let div = document.getElementById("divOnlineCourse");

			div.innerHTML = 
			`<img src='${course.img.icon}'>
			<br>
			<span>${course.name}</span>`;






		} );;
}