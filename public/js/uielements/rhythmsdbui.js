
/*
Selecting rhythm from a library
*/
class RhythmsDBUIController { 

  constructor() {
    this.htmlElementIDToRender = "divDBCategories";
    this.htmlElementIDToSelectRhythms_Container = "divRhythmListForCategory";
    this.htmlElementIDToSelectRhythms = "divRhythmsSelector";
    this.openedCategory = "";
  }

  render() {
    if( !this.htmlElementIDToRender ) return;
    let elem = document.getElementById(this.htmlElementIDToRender);
    
    // create interactive div for each category
    let arr = RhythmLibrary1.categories.map( cat => {
      let result = 
      `<button class='button-db-category' onclick="rhythmsDBUI.clickCategory('${cat.id}')">${cat.name}</button>`
      return result;
    });
    elem.innerHTML = arr.join("");
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
    let selectedCat = RhythmLibrary1.categories.find( cat => cat.id===categoryID );

    let divRhythms = document.getElementById( this.htmlElementIDToSelectRhythms_Container );
    let divRhythmsSelector = document.getElementById( this.htmlElementIDToSelectRhythms );
    
    //divRhythms.style.left = "50px";
    divRhythmsSelector.innerHTML = selectedCat.rhythms.map( (rhythm, idx) => {
      let result = `<div class='rhythm-to-select' onclick="rhythmsDBUI.clickRhythmSelected('${categoryID}', ${idx})">${rhythm.name}</div>`;
      return result;
    }).join("");

    let divWidth = divRhythmsSelector.offsetWidth;
    divRhythms.style.left = (window.innerWidth/2 - divWidth/2) + 'px';
  }

  clickCloseRhythmsListForCategory() {
    let divRhythms = document.getElementById( this.htmlElementIDToSelectRhythms_Container );
    divRhythms.style.left = "-30000px";
    this.openedCategory = "";
  }

  clickRhythmSelected( categoryID, rhythmIdx ) {
    let rhythm = RhythmLibrary1.categories.find( cat => cat.id === categoryID ).rhythms[rhythmIdx]; 
    rhythmEditorsManager.setRhythmToCurrentEditor( rhythm.text );
    this.clickCloseRhythmsListForCategory();
  }
}

const rhythmsDBUI = new RhythmsDBUIController();
