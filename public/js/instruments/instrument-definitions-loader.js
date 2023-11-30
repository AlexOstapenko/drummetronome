 class InstrumentDefinition {
    static create(obj) {
        let def = new InstrumentDefinition();
        Object.assign( def, obj );
        return def;
    }

    strokeInfo() {
        let result = "";
        if (this.arrStrokeInfo && this.arrStrokeInfo.length > 0 ) {
            this.arrStrokeInfo.forEach( (strokeInfo, idx) => {
                result += strokeInfo.stroke;
                if ( strokeInfo.hint ) result += " (" + strokeInfo.hint + ")";
                if ( idx < this.arrStrokeInfo.length-1 )
                    result += " | ";
            });
        }
        return result;
    }

 }

/*
* 1. Information about ready-to-use instruments is stored in instruments/instruments.json file
* in the property "instrument-paths" - array of folders, each folder corresponds to one instrument.
* 2. Folder for an instrument should contain file instrument-definition.json, folder audio and (if any)
* folder img.
*/
class InstrumentDefinitionsLoader {
    constructor() {
        this.callbackDefinitionsLoaded = null;
        this.instrumentDefinitions = null;
        this.folderName = "instruments";
    }

    // 2 sequential calls to server: 
    // 1) get the json fiile with list of instrument folders
    // 2) load all instrument definitions, mentioned in the list from p.1
    loadDefinitions(callbackWhenDone) {
        this.instrumentDefinitions = {};
        this.callbackDefinitionsLoaded = callbackWhenDone;
        this.loadInstrumentList();
    }

    loadInstrumentList() {
        const jsonFilePath = this.folderName + '/instruments.json';

        // Загрузка JSON-файла с сервера
        fetch(jsonFilePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error loading file: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(jsonObject => {
            console.log('Activated instruments:', '\n' + jsonObject['instrument-paths'].join('\n') );
            this.loadInstrumentDefinitionJsons( jsonObject["instrument-paths"].map(path => this.folderName + "/" + path) );
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    /*
    * By the given array of paths to folders load instrument definitions
    * Each folder is a separate instrument. It should contain:
    * "instrument-definition.json" file 
    */
    async loadInstrumentDefinitionJsons(folders) {
      try {
        const promises = folders.map(async (folder) => {
          // Асинхронно загружаем каждый JSON-файл
          let response = await fetch(`${folder}/instrument-definition.json`);

          // Проверяем, был ли успешный HTTP-статус
          if (!response.ok) {
            throw new Error(`Ошибка загрузки файла ${filePath}: ${response.status} ${response.statusText}`);
          }

          // Асинхронно преобразуем ответ в JSON
          let definitionPromise = response.json();
          let definition = await definitionPromise;
          definition.folder = `${folder}`;
          this.processStrokePaths(definition);
          return definition;
        });

        // Дожидаемся завершения всех загрузок
        this.instrumentDefinitions = await Promise.all(promises);
        this.instrumentDefinitions = this.instrumentDefinitions.map(json => InstrumentDefinition.create(json));

        // Вызываем callback-функцию с загруженными данными
        if ( this.callbackDefinitionsLoaded )
            this.callbackDefinitionsLoaded( this.instrumentDefinitions );

      } catch (error) {
        // Обработка ошибок
        console.error('Произошла ошибка:', error);
      }
    }

    processStrokePaths(definition) {
        if (!definition.arrStrokeInfo) return;
        const rootString = "#root#/";

        definition.arrStrokeInfo.forEach( item => {
            if (item.file.indexOf(rootString)===0) { // if starts with "#root#/"
                item.file = item.file.replace(rootString, this.folderName+"/");
                item.folderRedefined = true;
            };
        })
    }
}




