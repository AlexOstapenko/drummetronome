// Predefined rhythms to choose (UI element) and play

let RHYTHMS_DB = {
    categories : 
    [
        { id: "arab_rhythms", name : "Арабские ритмы",
            rhythms: [
                { name: "Максум (8)", text: "DT–TD–T–" },
                { name: "Максум (16)", text: "D–T–––T–D–––T–––" },
                { name: 'Мальфуф ("пустой")', text: "D––T––T–" },
                { name: 'Мальфуф', text: "DkkTkkTk" },
                { name: 'Аюб', text: "D––KD–T–" },
                { name: 'Карачи', text: "T–––T–D–" },
                { name: 'Карачи-a', text: "T––kT–D–" },
                { name: 'Чифтетели (Вахда кебира)', text: "D–kT–kT–D–D–T–––" },
                { name: 'Чифтетели (наполненный)', text: "D–tK–kT–DkDkT–tk" },
                { name: 'Самаи', text: "D––T–DDT––" }
            ]
        },

        { id: "odd_rhythms", name: "Нечетные размеры",
            rhythms: [
                { name: "7/8 a (2 2 3)", text: "D–D–Tkk" },
                { name: "7-8 b", text: "D–TT–T–" },
                { name: "9-8 a", text: "D–T–D–TKK" },
                { name: "9-8 b", text: "D–T–D–TT–" },
                { name: "18-8 a", text: "D–tkT–tkD–tkT–T–tk" },
                { name: "18-8 b", text: "D–tkS–tkDkkDkkP–tk" },
                { name: "36-8 a", text: "D–tkS–tkDkkDkkP–tkD–tkP–tkD–K–K–P–P–" }
                
            ]
        },

        { id: "diff_ex", name: "Разные упражнения",
            rhythms: [
                { name: "Загадочный кач", text: "tktkS–TKDkD–P–P–" },
                { name: "Прикольный ритм на 14", text: "DkkPkDkkDkkP–P–" },
                { name: "20-ка", text: "D–kkTKP–K–K–D–D–TKPK" },
                
            ]
        }


    ],
    htmlElementIDToRender : "",
    htmlElementIDToSelectRhythms: "",

    render: function() {
        let elem = document.getElementById(this.htmlElementIDToRender);
        // create interactive div for each category
        let arr = this.categories.map( cat => {
            let result = 
            "<div onclick='clickCategory(\"" + cat.id + "\")' class='db-category'><div class='db-category-text'>" +  
            cat.name +
            "</div></div>";
            return result;
        });
        elem.innerHTML = arr.join("<br>");
    } 
};

RHYTHMS_DB.htmlElementIDToRender = "divDBCategories";
RHYTHMS_DB.htmlElementIDToSelectRhythms = "divRhythmListForCategory";

function clickCategory(id) {
    showRhythms( id );
}

function showRhythms( categoryID ) {
    let selectedCat = RHYTHMS_DB.categories.find( cat => cat.id===categoryID );

    let divRhythms = document.getElementById( RHYTHMS_DB.htmlElementIDToSelectRhythms );
    let divRhythmsSelector = document.getElementById( "divRhythmsSelector" );
    
    divRhythms.style.left = 0;
    divRhythmsSelector.innerHTML = selectedCat.rhythms.map( (rhythm, idx) => {
        let result = "<div class='rhythm-to-select' onclick='clickRhythmSelected(\"" + categoryID + "\", " + idx  + ")'>"; 
        result += rhythm.name;
        result += "</div>";
        return result;
    }).join("");
}

function clickCloseRhythmsListForCategory() {
    let divRhythms = document.getElementById( RHYTHMS_DB.htmlElementIDToSelectRhythms );
    divRhythms.style.left = "-30000px";
}

function clickRhythmSelected( categoryID, rhythmIdx ) {
    let rhythm = RHYTHMS_DB.categories.find( cat => cat.id === categoryID ).rhythms[rhythmIdx]; 
    rhythmBoard.setNewRhythm( rhythm.text );
    rhythmBoard.render();
    
    clickCloseRhythmsListForCategory();
}