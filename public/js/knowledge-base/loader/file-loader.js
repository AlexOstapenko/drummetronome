class FileLoader {

	loadFile(filePath, callback) {
		let lodedFiles = this.loadFilesFromServer( [filePath], (fileContents, isError) => {
			if (!isError && fileContents)
				callback( fileContents[0] );
			else
				callback(null);
		});
	}

	loadFiles(arrFiles, callback) {
		return this.loadFilesFromServer( arrFiles, callback );
	}
	
	// callback takes 2 params: fileContent, isError
	loadFilesFromServer(filePaths, callback) {
	    const fileContents = [];
	    let filesToLoad = filePaths.length;

	    const handleError = (errMsg) => {
	    	console.log(errMsg);
            filesToLoad--;

            if (filesToLoad === 0) {
                callback(null, true);
            }
	    }

		const handleSuccess = () => {
			fileContents.push(data);
            filesToLoad--;

            if (filesToLoad === 0) {
                callback(fileContents, false);
            }
		}

		for (const filePath of filePaths) {
	    	try {
		        fetch(filePath)
		            .then(response => {
		            	if (!response.ok)
		            		handleError(`File cannot be loaded.\n${filePath}\nStatus: (${response.status}) ${response.statusText}.`);
		            	else
		            		return response.text();
		            })
		            .then(data => {
		                fileContents.push(data);
		                filesToLoad--;

		                if (filesToLoad === 0) {
		                    callback(fileContents, false);
		                }
		            })
		            .catch(error => {
		                handleError(`${error.message}\n${error.stack}`);
		            });
	        } catch( error ) {
				handleError(`${error.message}\n${error.stack}`);
	        }
        }
	    
	}

}