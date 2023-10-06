// Predefined rhythms to choose (UI element) and play

const FRAMEDRUM_EXERCISES_IDS = {
  PREFIX: "Warmup exercise #"
}

let RHYTHMS_DB = {
  categories : 
  [
    { id: "arab_rhythms", name : "Arabic rhythms",
      rhythms: [
        { name: "Maqsum (8)", text: "D T - T D - T -" },
        { name: "Maqsum (16)", text: "D - T - - - T - D - - - T - - -" },
        { name: 'Malfuf ("plain")', text: "D - - T - - T -" },
        { name: 'Malfuf', text: "D k k S k k S k" },
        { name: 'Ayub', text: "D - - K D - T -" },
        { name: 'Karachi', text: "T - - T - D -" },
        { name: 'Karachi-a', text: "T - - k T – D –" },
        { name: 'Chifteteli (Wahda kebira)', text: "D - k T - k T - D - D - T - - -" },
        { name: 'Chifteteli (filled)', text: "D - t K - k T - D k D k T - t k" },
        { name: 'Samai', text: "D - - T - D D T - -" }
      ]
    },

    { id: "odd_rhythms", name: "Odd rhythms",
      rhythms: [
        { name: "7/8 a (2 2 3)", text: "D - D - T k k" },
        { name: "7-8 b", text: "D - T T - T -" },
        { name: "9-8 a", text: "D - T - D - T k k" },
        { name: "9-8 b", text: "D - T - D - T T -" },
        { name: "18-8 a", text: "D - t k T - t k D - t k T - T - t k" },
        { name: "18-8 b", text: "D - t k S - t k D k k D k k P - t k" },
        { name: "36-8 a", text: "D - t k S - t k D k k D k k S - t k D - t k S - t k D - K - K - S - S -" }
        
      ]
    }, 

    {
      id : "fd_warmups", name : "Frame drum warm ups",
        rhythms: [

{name: FRAMEDRUM_EXERCISES_IDS.PREFIX + "1", text: 
`R R R R L L L L : 3
R R L L R R L L`},

{name: FRAMEDRUM_EXERCISES_IDS.PREFIX + "2", text: 
`R R R R L L L L : 3
R R L L (R R R R L L L L)/2`},

{name: FRAMEDRUM_EXERCISES_IDS.PREFIX + "3", text: 
`R R R R L L L L (R R R R L L L L)/2 R R L L`},

{name: FRAMEDRUM_EXERCISES_IDS.PREFIX + "4", text: 
`R R R R L L L L (R R R R)/2 L L (R R R R L L L L)/2`},

{name: FRAMEDRUM_EXERCISES_IDS.PREFIX + "5", text: 
`(R R R R L L L L)/2 R R (L L L L)/2
(R R R R L L L L)/2 (R R R R)/2 L L`},

{name: FRAMEDRUM_EXERCISES_IDS.PREFIX + "6", text: 
`(R R R R)/2 L R (L L L L)/2 R L`},

{name: FRAMEDRUM_EXERCISES_IDS.PREFIX + "7", text: 
`(R R R R)/2 (L L L L)/2 (R R R R)/2 LR
(L L L L )/2 (R R R R )/2 (L L L L )/2 R L`},

{name: FRAMEDRUM_EXERCISES_IDS.PREFIX + "8", text: 
`D L L L (D L L L T L L L )/2`},

{name: FRAMEDRUM_EXERCISES_IDS.PREFIX + "9", text: 
`D L L L (D L L L D L L L )/2 R R L L (R R L L R R L L )/2`},

{name: FRAMEDRUM_EXERCISES_IDS.PREFIX + "10", text: 
`D L L L (D L L L D L L L )/2 T L L L (R R L L T L L L )/2`},

{name: FRAMEDRUM_EXERCISES_IDS.PREFIX + "11", text: 
`D L L L (D L L L T L L L )/2
(D L L L R R R L L L L R R R R L)/2`},

{name: FRAMEDRUM_EXERCISES_IDS.PREFIX + "12", text: 
`D L L L (D L L L T L L L )/2
(R R R R L L L L )/2 
(R R R R L L L L )/4
(R L L L )/2`},

{name: FRAMEDRUM_EXERCISES_IDS.PREFIX + "13", text: 
`D L (R R R R L L L L )/4 
R L (R R R R L L L L )/4
D L (R R R R L L L L )/4
(R R R R L L L L )/2`},

{name: FRAMEDRUM_EXERCISES_IDS.PREFIX + "14", text: 
`D L L L (D L L L T L L L )/2
(D L – L R L – L R R R R L L L L )/2`},

{name: FRAMEDRUM_EXERCISES_IDS.PREFIX + "15", text: 
`D L L L (D L L L T L L L )/2
(D L – L R L – L)/2 (R R R R L L L L )/4 (R L – L)/2`},

{name: FRAMEDRUM_EXERCISES_IDS.PREFIX + "16", text: 
`(D L L L )/2 (R R R R L L L L )/4
(T L L L )/2 (R R R R L L L L )/4
(D L L L )/2 (R R R R L L L L )/4
( R R L L )/4 (D L L L )/2 (T L L L )/4 `},

{name: FRAMEDRUM_EXERCISES_IDS.PREFIX + "17", text: 
`(D L L )/2 (D L L L R R R L L L )/4`},

{name: FRAMEDRUM_EXERCISES_IDS.PREFIX + "18", text: 
`(D L L )/2 (D L L L R R R R L L )/4`},

{name: FRAMEDRUM_EXERCISES_IDS.PREFIX + "19", text: 
`(D L L )/2 ( D L L  R R R L L L L )/4`},

{name: FRAMEDRUM_EXERCISES_IDS.PREFIX + "20", text: 
`(D L L )/2 (D L L L R R R L L L )/4
(D L L )/2 (D L L L R R R R L L )/4
(D L L )/2 (D L L L R R R L L L )/4
(D L L )/2 ( D L L  R R R L L L L )/4`},

{name: FRAMEDRUM_EXERCISES_IDS.PREFIX + "21", text: 
`D L L (D L L L R R R L L L )/2
D L L (D L L L R R R L L L )/4 (D L L L R R R L L L )/4`},

{name: FRAMEDRUM_EXERCISES_IDS.PREFIX + "22", text: 
`(D L L L R R R R )/2 L L L L 
(T L L L R R R R )/2 L L L L
(D L L L R R R R )/2 L L L L
(R R R R L L L L )/2 T L L L `},

{name: FRAMEDRUM_EXERCISES_IDS.PREFIX + "23", text: 
`(D L L L R R R R )/2 L L L L 
(T L L L T L L L R R R R L L L L )/2
(D L L L R R R R )/2 L L L L 
(T L L L  R R L L  R R R R L L L L )/2`},

{name: FRAMEDRUM_EXERCISES_IDS.PREFIX + "24", text: 
`(D2 T K)/2 (R R R R L L L L)/4
(T K)/2 (R R R R L L L L)/4 (D K)/2`
}

        ]
    }



  ],
  htmlElementIDToRender : "",
  htmlElementIDToSelectRhythms: "",

  render: function() {
    if( !this.htmlElementIDToRender ) return;
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
    let result = "<div class='rhythm-to-select' onclick='clickRhythmSelected(\"" + categoryID + "\", " + idx + ")'>"; 
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
  
  rhythmEditorsManager.setRhythmToCurrentEditor( rhythm.text );

  clickCloseRhythmsListForCategory();
}