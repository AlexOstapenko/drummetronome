// Remove unnessesary spaces in the beginning of each line
function trimLinesInRhythm(txt) {
    let arr = txt.split('\n');
    let arr1 = arr.map( item => item.trim() );
    return arr1.join("\n");
}

/* Задача: все неспецифичные операторы повтора ":" превратить в повторы фраз, перед которыми они стоят.
Неспецифичный - это такой, который не стоит вплотную к слогу или скобковому выражению. 
Тогда он относится ко всему, что слева, но до такого же несецифичного оператора левее 
или до начала строки (то есть он действует только на то, что находится в этой строке). 
Или до начала его контекста в виде скобок. То есть, действие неспецифичного оператора не распространяется за пределы контекста.
То есть было: "фраза : 3"
стало: "(фраза) (фраза) (фраза)"

Пример: (D T :2 K ) :2 P Pm :2
Станет: ( (D T) (D T) K ) ( (D T) (D T) K ) (P Pm) (P Pm)
*/

// RULES
// In the end of line can be ": N" - it means - 
//      repeat the text from this line N times.
// If the line starts from // - ignore this line (comment)
// The rhythm can consists of 2 parts: precount, separated by \n***\n from the main text.
// Precount should be played just once. So if there is precount part in the text return value is array of 2 values:
// 0 - precount, 1 - main text.

/* 
    More examples

    Text can be something like this:

    ( 
        D L:3 T K (R R L L)/2 
    ):4 D L L L T L:3 (D K T K)2/3

    it will be first converted to:

    D L L L T K (R R L L)/2
    D L L L T K (R R L L)/2
    D L L L T K (R R L L)/2
    D L L L T K (R R L L)/2
    D L L L T L L L
    D2/3 K2/3 T2/3 K2/3
    
    Ex2: 
    L/2:3 = L/2 L/2 L/2

    Ex3:
    Non-specific repetitions char :
    D K : 2 S T :2 will be treated as: 2 times (D K) and 2 times (S T)
    D K D K S T S T

    but this is specific repetition char:
    T:4 - it belongs to T

    So:

    T:2 D:2 :4 - means 4 times (T T D D) 
*/
function processRawTextRhythm( text ) {    
   
    function cleanRawTextRhythm(str) {
        const lines = nonEmptyValues( str.split("\n") );
        const effectiveLines = lines.filter( line => line.slice(0,2) !== "//" );
        return effectiveLines.join("\n");
    }

    let exprParser = new ExpressionParser();
    const precountSeparator = "\n***\n";
    const precountSeparatorIdx = text.indexOf(precountSeparator);
    let precount = "";
    if ( precountSeparatorIdx!==-1 ) {
        let arr = text.split(precountSeparator);
        precount = arr[0];
        text = arr[1];
        precount = exprParser.parse( cleanRawTextRhythm(precount) );
    }

    // apply all non-specific operators of repetition
    let normalizedMainRhythm = exprParser.parse( cleanRawTextRhythm(text) );
    return precount === "" ? normalizedMainRhythm : [precount, normalizedMainRhythm];
}
