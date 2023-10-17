
/*
Selecting rhythm from a library
*/
class RhythmsDBUIController { 

  constructor() {
    this.htmlElementIDToRender = "divDBCategories";
    this.htmlElementIDToSelectRhythms_Container = "divRhythmListForCategory";
    this.htmlElementIDToSelectRhythms = "divRhythmsSelector";
    this.elementID_Title = "spanRhythmCategoryName";
    this.openedCategory = "";
    this.elementID_lastChoiceFromLib = 'divLastChoiceFromLib';
    this.lastChoice = {category: "", rhythm: ""};
  }

  render() {
    if( !this.htmlElementIDToRender ) return;
    let elem = document.getElementById(this.htmlElementIDToRender);
    
    // create interactive div for each category
    let arr = rhythmLibrary.categories.map( cat => {
      let result = `<div class='div-db-category' onclick="rhythmsDBUI.clickCategory('${cat.id}')">${cat.name}</div>`;

      //`<button class='button-db-category' onclick="rhythmsDBUI.clickCategory('${cat.id}')">${cat.name}</button>`
      return result;
    });
    elem.innerHTML = 
    `<div class='div-db-categories'>
        ${arr.join("")}
    </div>
    `;

    this.updateLastChoiceUI();
  } 

  updateLastChoiceUI() {
    let txt = "";
    if ( this.lastChoice.category.trim()!=="" || this.lastChoice.rhythm.trim()!=="")
      txt = `<b>Last seen:</b><br>${this.lastChoice.category} | ${this.lastChoice.rhythm}`;
    document.getElementById(this.elementID_lastChoiceFromLib).innerHTML = txt;
  }

  clickCategory(id) {
    if (this.openedCategory === id)
      this.clickCloseRhythmsListForCategory();
    else {
      this.showRhythms( id );
      this.openedCategory = id;
    }
  }

  showRhythms( categoryID ) {
    let selectedCat = rhythmLibrary.categories.find( cat => cat.id===categoryID );

    let divRhythms = document.getElementById( this.htmlElementIDToSelectRhythms_Container );
    let divRhythmsSelector = document.getElementById( this.htmlElementIDToSelectRhythms );
    let elementTitle = document.getElementById( this.elementID_Title );
    
    //divRhythms.style.left = "50px";
    divRhythmsSelector.innerHTML = selectedCat.rhythms.map( (rhythm, idx) => {
      let result = `<div class='rhythm-to-select' onclick="rhythmsDBUI.clickRhythmSelected('${categoryID}', ${idx})">${rhythm.name}</div>`;
      return result;
    }).join("");

    // set the title to category name

    elementTitle.innerHTML = selectedCat.name;

    const divW = divRhythmsSelector.offsetWidth;
    const divH = divRhythmsSelector.offsetHeight;

    divRhythms.style.left = (window.innerWidth/2 - divW/2) + 'px';
    divRhythms.style.top = window.scrollY + "px";
  }

  clickCloseRhythmsListForCategory() {
    let divRhythms = document.getElementById( this.htmlElementIDToSelectRhythms_Container );
    divRhythms.style.left = "-30000px";
    this.openedCategory = "";
  }

  clickRhythmSelected( categoryID, rhythmIdx ) {
    let category = rhythmLibrary.categories.find( cat => cat.id === categoryID );
    let rhythm = category.rhythms[rhythmIdx]; 
    rhythmEditorsManager.setRhythmToCurrentEditor( rhythm.text );
    this.clickCloseRhythmsListForCategory();
    this.lastChoice = {category: category.name, rhythm: rhythm.name};
    this.updateLastChoiceUI();
  }
}

const rhythmsDBUI = new RhythmsDBUIController();
