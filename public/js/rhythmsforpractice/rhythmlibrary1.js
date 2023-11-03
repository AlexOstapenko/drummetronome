// Predefined rhythms to choose (UI element) and play

const FRAMEDRUM_EXERCISES_IDS = {
  PREFIX: "Warmup exercise #",
  CATEGORY: "fd_warmups",
  NAME: "Lap style warmups (Tar)" 
}

class RhythmLibrary {

  constructor() {
    this.categories = [];
  }
  
  trimRhythms() {
    this.categories.forEach( (cat,catIdx) => {
      cat.rhythms.forEach( (rhythmInfo,rIdx) => {
        let text = rhythmInfo.text;
        this.categories[catIdx].rhythms[rIdx].text = trimLinesInRhythm(text);
      })
    });
  }

}

const rhythmLibrary = new RhythmLibrary();

function addRhythmsArray(arrRhythms, category, nameGeneratorCallback, instrumentName, categoryName) {
  
    // create new category if it doesn't exist
    if ( !rhythmLibrary.categories[category] ) 
      rhythmLibrary.categories[category] = 
        {id: category, name: categoryName ? categoryName : category, rhythms: []};

    let categoryContent = rhythmLibrary.categories.filter( item => item.id===category )[0];

    function addNewRhythm(txt) {
      let rhythmsCount = categoryContent.rhythms.length;
      let nameOfRhythm = nameGeneratorCallback ? nameGeneratorCallback( rhythmsCount ) : ((rhythmsCount+1)+"");
      categoryContent.rhythms.push( {name: nameOfRhythm, text: txt, instr: instrumentName} );
    }

    function trimLines(txt) {
      let arr = txt.split('\n');
      let arr1 = arr.map( item => item.trim() );
      return arr1.join("\n");
    }

    arrRhythms.forEach( txt => {
      addNewRhythm( trimLines(txt) );
    })
}

function createRhythmLibrary() {
  rhythmLibrary.categories = 
  [
    { id: "arab_rhythms", name : "Arabic rhythms",
      rhythms: [
        { name: "Maqsum (8)", text: "D T - T D - T -", instr: INSTRUMENT_DARBUKA.instrumentName},
        { name: "Maqsum (16)", text: "D - T - - - T - D - - - T - - -", instr: INSTRUMENT_DARBUKA.instrumentName },
        { name: 'Malfuf ("plain")', text: "D - - T - - T -", instr: INSTRUMENT_DARBUKA.instrumentName },
        { name: 'Malfuf', text: "D k k S k k S k", instr: INSTRUMENT_DARBUKA.instrumentName },
        { name: 'Ayub', text: "D - - K D - T -", instr: INSTRUMENT_DARBUKA.instrumentName },
        { name: 'Karachi', text: "T - - T - D -", instr: INSTRUMENT_DARBUKA.instrumentName },
        { name: 'Karachi-a', text: "T - - k T – D –", instr: INSTRUMENT_DARBUKA.instrumentName },
        { name: 'Chifteteli (Wahda kebira)', text: "D - k T - k T - D - D - T - - -", instr: INSTRUMENT_DARBUKA.instrumentName },
        { name: 'Chifteteli (filled)', text: "D - t K - k T - D k D k T - t k", instr: INSTRUMENT_DARBUKA.instrumentName },
        { name: 'Samai', text: "D - - T - D D T - -", instr: INSTRUMENT_DARBUKA.instrumentName }
      ]
    },

    { id: "odd_rhythms", name: "Odd rhythms",
      rhythms: [
        { name: "7/8 a (2 2 3)", text: "D - D - T k k", instr: INSTRUMENT_DARBUKA.instrumentName },
        { name: "7-8 b", text: "D - T T - T -", instr: INSTRUMENT_DARBUKA.instrumentName },
        { name: "9-8 a", text: "D - T - D - T k k", instr: INSTRUMENT_DARBUKA.instrumentName },
        { name: "9-8 b", text: "D - T - D - T T -", instr: INSTRUMENT_DARBUKA.instrumentName },
        { name: "18-8 a", text: "D - t k T - t k D - t k T - T - t k", instr: INSTRUMENT_DARBUKA.instrumentName },
        { name: "18-8 b", text: "D - t k S - t k D k k D k k S - t k", instr: INSTRUMENT_DARBUKA.instrumentName  },
        { name: "36-8 a", text: "D - t k S - t k D k k D k k S - t k D - t k S - t k D - K - K - S - S -", instr: INSTRUMENT_DARBUKA.instrumentName  }
        
      ]
    }, 

    { id : FRAMEDRUM_EXERCISES_IDS.CATEGORY, name : FRAMEDRUM_EXERCISES_IDS.NAME,
    rhythms:[] }, // will be defined later in this file


    { id: "compositions_1", name : "Compositions",
      rhythms: [
      { 
        name: "Intro to Malfuf", text: 
          `D/4 : 8
          T/2 : 4
          X : 4

          (K - t k D -)/4 :2
          (X X)/2
          (D X D D K D)/2 (T K T K)/4

          (D k k S k k S k)/2 :16`, instr: INSTRUMENT_DARBUKA.instrumentName},
        { name: "7/8 phrase for Tar", text:
          `D ki D ki D ki ki
          T ki T ki T ki ki
          X ki X ki X ki ki
          P ki P ki (A B C A B C)/2

          D ki D ki D ki ki
          T ki T ki T ki ki
          R R R R L L L
          T ki T ki D K ki

          D ki D ki D ki ki
          T ki T ki T ki ki
          R R R R L L L
          P ki P ki (A B C A B C)/2

          D ki D ki T ki ki
          D ki D ki T ki ki
          R R R R L L L
          T ki T ki ( T A B C A B C A B)/3`, instr: INSTRUMENT_COOPERMAN_TAR.instrumentName
      },

      {
        name: "Composition for Dmitry", text:
        `// PRECOUNT
        T2 T2 T:4
        ***
        // INTRO
        (D k t D):3 D K - K    :3

        // First break
        (D D D D)/2 (T T T T)/2    :3
        T4

        (D k t D):3 D K - K    :3

        // Second break
        (D D D D)/2 T    :4
        (D D D D)/2 (T K T K)/2

        // PART 2
        D k t    :4
        T K T K

        D k t   :4
        T - K -

        D k t   :4
        T K T K

        (T k t k)/2:6
        T4

        // PART 2 - AYUB
        (
        (D - - D D - T -)/2:3
        (D K - D D - T -)/2

        (D - - D D - T -)/2:3
        D D D T
        ):4`, instr: INSTRUMENT_DARBUKA.instrumentName
      },
      {
        name: "Composition of Nina for konnakol", text:
        `X2:4

        // 1 PART
        D - T k k T - k
        T k k D - X Pm Pl
        D - T k k T - k
        (T K T K)/2 D :2 (T K T K)/2
        D - T k k T - k
        (X k k D k k T K d d T K d d T K)/2
        T k k T - k :2
        (T k k T k k T k)/2

        // 2 PART
        D2 (T k d d T k k :2)
        T2 k k D5 d+X2:2 X k k
        T k k D2 :2 T k d d T k
        (T k k k)/2 D : 2 (T K d d)/2
        ( T k k T k k (T k d d):2 T K)/2
        `, instr: INSTRUMENT_DARBUKA.instrumentName
      }
      ]
    }, // end of category
    {
      id: "kosmosky_1", name: "Kosmosky compositions",
      rhythms: [
        {name: "Tender sun", text: 
          `O G E O A F B D
           O G E O A2 F2
           O G E O A F B D
           O G E A F2 B-E2`, 
           instr: INSTRUMENT_KOSMOSKY.instrumentName},
        {name: "Dancy Groove For Practice", text:
          `O-Z-^ B D-^ E
           O-^ B D-^ E :2
           G-^ A Bh-Z-^ Dh-^/2 ^/2`, 
          instr: INSTRUMENT_KOSMOSKY.instrumentName}
      ]
    }
  ];

  addRhythmsArray([

    // -----------------  
    `R R R R L L L L : 3
    R R L L R R L L`,

    // -----------------
    `R R R R L L L L : 3
    R R L L (R R R R L L L L)/2`,

    // -----------------
    `(D+R R R R L L L L)/2 R:4 L:4 R:2 L:2`,

    // -----------------
    `R R R R L L L L (R R R R L L L L)/2 R R L L`, 

    // -----------------
    `R R R R L L L L (R R R R)/2 L L (R R R R L L L L)/2`, 

    // -----------------
    `(R R R R L L L L)/2 R R (L L L L)/2
    (R R R R L L L L)/2 (R R R R)/2 L L`, 

    // -----------------
    `(R R R R)/2 L R (L L L L)/2 R L`, 

    // -----------------
    `(R R R R)/2 (L L L L)/2 (R R R R)/2 L R
    (L L L L )/2 (R R R R )/2 (L L L L )/2 R L`, 

    // -----------------
    `D D T ( L L L L)/4 :3
    (D L L L R R R R L L L L R R L L )/4`,

    // -----------------
    `D L L L (D L L L T L L L )/2`, 

    // -----------------
    `D L L L (D L L L D L L L )/2 R R L L (R R L L R R L L )/2`, 

    // -----------------
    `D L L L (D L L L D L L L )/2 T L L L (R R L L T L L L )/2`, 

    // -----------------
    `D L L L (D L L L T L L L )/2
    (D L L L R R R L L L L R R R R L)/2`,

    // -----------------
    `D L L L (D L L L T L L L )/2
    (R R R R L L L L )/2 
    (R R R R L L L L )/4
    (R L L L )/2`, 

    // -----------------
    `D L (R R R R L L L L )/4 
    R L (R R R R L L L L )/4
    D L (R R R R L L L L )/4
    (R R R R L L L L )/2`, 

    // -----------------
    `D L L L (D L L L T L L L )/2
    (D L – L R L – L R R R R L L L L )/2`, 

    // -----------------
    `D L L L (D L L L T L L L )/2
    (D L – L R L – L)/2 (R R R R L L L L )/4 (R L – L)/2`, 

    // -----------------
    `(D L L L )/2 (R R R R L L L L )/4
    (T L L L )/2 (R R R R L L L L )/4
    (D L L L )/2 (R R R R L L L L )/4
    ( R R L L )/4 (D L L L )/2 (T L L L )/4 `,

    // -----------------
    `(D L L )/2 (D L L L R R R L L L )/4`, 

    // -----------------
    `(D L L )/2 (D L L L R R R R L L )/4`, 

    // -----------------
    `(D L L )/2 ( D L L  R R R L L L L )/4`, 

    // -----------------
    `(D L L )/2 (D L L L R R R L L L )/4
    (D L L )/2 (D L L L R R R R L L )/4
    (D L L )/2 (D L L L R R R L L L )/4
    (D L L )/2 ( D L L  R R R L L L L )/4`,

    // -----------------
    `D L L (D L L L R R R L L L )/2
    D L L (D L L L R R R L L L )/4 (D L L L R R R L L L )/4`,

    // -----------------
    `(D L L L R R R R )/2 L L L L 
    (T L L L R R R R )/2 L L L L
    (D L L L R R R R )/2 L L L L
    (R R R R L L L L )/2 T L L L `,

    // -----------------
    `(D L L L R R R R )/2 L L L L 
    (T L L L T L L L R R R R L L L L )/2
    (D L L L R R R R )/2 L L L L 
    (T L L L  R R L L  R R R R L L L L )/2`, 

    // -----------------
    `(D2 T K)/2 (R R R R L L L L)/4
    (T K)/2 (R R R R L L L L)/4 (D K)/2`, 

    // -----------------
    `D2 a a
    T2 a a
    T2 :4

    (
    D L L L R R L L T L L L R R L L 
    D L L L R R L L T L L L (R R R R L L L L)/2
    ):2
    
    D L L L R R L L T L L L (R R R R L L L L )/2 : 2
    D L L L (R R R R L L L L)/2 T L L L (R R R R L L L L)/2 : 2

    (D L L L R R R R L L L L R R L L )/2
    (T L L L R R R R L L L L R R L L )/2
    (D L L L R R R R L L L L R R L L )/2
    (T L L L R R R R L L L L )/2 R L`,

    `D (L L L L)/2 T (L L L L D L L L)/2
    D (L L L L)/2 T (L L L L R R L L)/2`

    ], 
    FRAMEDRUM_EXERCISES_IDS.CATEGORY, 
    idx => FRAMEDRUM_EXERCISES_IDS.PREFIX + (idx+1),
    INSTRUMENT_COOPERMAN_TAR.instrumentName
  );

  rhythmLibrary.trimRhythms();
}

///////////////////////////////
createRhythmLibrary();







