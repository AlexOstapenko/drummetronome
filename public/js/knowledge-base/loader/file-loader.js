class FileLoader {

	loadFile(filePath, callback) {

		console.log( "Loading file: " + filePath );
		let lodedFiles = this.loadFilesFromServer( [filePath], (fileContents) => {
			if (fileContents)
				callback( fileContents[0]);
		});
	}

	loadFiles(arrFiles) {
		return this.loadFilesFromServer( arrFiles );
	}
	
	loadFilesFromServer(filePaths, callback) {
	    const fileContents = [];
	    let filesToLoad = filePaths.length;

	    for (const filePath of filePaths) {
	        fetch(filePath)
	            .then(response => response.text())
	            .then(data => {
	                fileContents.push(data);
	                filesToLoad--;

	                if (filesToLoad === 0) {
	                    callback(fileContents);
	                }
	            })
	            .catch(error => {
	                console.error(`Ошибка при загрузке файла ${filePath}: ${error.message}`);
	                filesToLoad--;

	                if (filesToLoad === 0) {
	                    callback(null);
	                }
	            });
	    }
	}

}