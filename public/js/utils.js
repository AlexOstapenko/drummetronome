function isOdd(num)
{
  return num%2;
}

function isEven(num)
{
  return (!isOdd(num));
}

function getRandomElement(arr)
{
	return arr[ getRandomInt(0, arr.length) ];
}

/*
* Returns random number between min and max, including min but not including max
*/
function getRandomInt(min, max) 
{
  return min + Math.floor(Math.random() * (max - min));
}

function trimArray(arr)
{
    for(i=0;i<arr.length;i++)
    {
        arr[i] = arr[i].replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    }
    return arr;
}

function nonEmptyValues(arr)
{
  return removeEmptyElements( trimArray(arr) );
}

function removeEmptyElements(arr)
{
  var result = [];
  for(var i=0; i<arr.length; i++)
    if (arr[i].length > 0) result.push(arr[i]);
  return result;
}

function strRemoveSpaces(str)
{
  let result = "";
  for(let i=0; i < str.length; i++)
    if ( str[i]!=' ' && str[i]!= '\n')
      result += str[i];
  return result;
}

/*
* For a given string adds single space between all chars
*/
function addSeparator(txt, separator)
{
  return txt.split("").join( separator===undefined ? " " : separator);
}

function containsValue(arr, val)
{
  let result = false;
  loop:
  for(let i=0; i < arr.length; i++)
  {
    if (arr[i]==val)
    {
      result = true;
      break loop;
    }
  }
  return result;
}


function toInteger(value) {
    // Попытаемся преобразовать значение в целое число
    const integer = parseInt(value, 10);
    // Проверим, было ли успешное преобразование
    if (!isNaN(integer) && Number.isInteger(integer)) {
        return integer;
    }
    return null; // Возвращаем null, если не удалось преобразовать
}

/////////////////////////////////////////////////////////
// TWO FUNCTIONS = make and combinations work together
// All possible rearrangements of an array

function make(arr, el) {
  var i, i_m, item;
  var len = arr.length;
  var res = [];

  for(i = len; i >= 0; i--) {
    res.push(
      ([]).concat(
        arr.slice(0, i),
        [el],
        arr.slice(i, i_m)
      )
    );
  }

  return res;
}

function combinations(arr) {
  var prev, curr, el, i;
  var len = arr.length;
    
  curr = [[arr[0]]];

  for(i = 1; i < len; i++) {
    el = arr[i];
    prev = curr;
    curr = [];

    prev.forEach(function(item) {
      curr = curr.concat(
        make(item, el)
      );
    });
  }

  return curr;
}
/////////////////////////////////////////////////////

// -----

function unique(arr) {

  var result = [];
  var obj = {};

  // I hope this string will not appear as an element of arr
  var SEPARATOR = "#^#sep#!@#"; 

  if (arr.length > 0)
  {
    let isArray = Array.isArray( arr[0] );
    
    for (var i = 0; i < arr.length; i++) 
    {
      var str = (isArray ? arr[i].join(SEPARATOR) : arr[i] );
      obj[str] = true; // запомнить строку в виде свойства объекта
    }

    var arrKeys = Object.keys(obj);
    for(var i=0; i < arrKeys.length; i++)
    	result.push( isArray ? arrKeys[i].split( SEPARATOR ) : arrKeys[i] );

  }
  return result; 
}

function unique2(arr) {

  var result = [];
  var isArray = false;
  
  // I hope this string will not appear as an element of arr
  var SEPARATOR = "#^#sep#!@#"; 

  if (arr.length > 0)
  {
     isArray = Array.isArray( arr[0] );
    
    nextInput:
      for (var i = 0; i < arr.length; i++) 
      {
        var str = (isArray ? arr[i].join(SEPARATOR) : arr[i] );

        for (var j = 0; j < result.length; j++) 
        { // ищем, был ли он уже?

          if (result[j] == str) continue nextInput; // если да, то следующий
        }

        result.push( str );
      }
  }

  if (isArray)
  {
    for(let i=0; i<result.length; i++)
      result[i] = result[i].split( SEPARATOR );
  }

  return result;
}

function numOfUniqueElements(arr)
{
  let arrUnique = unique(arr);
  return arrUnique.length;
}

// arr - plain array of several components
// each formula will be as string where all components are separated by separator
function getUniqueCombinations(arr, eachAsString, separator)
{	
	var arrCombinations = combinations(arr);
	var arrUnique = unique( arrCombinations );

  var result = [];

  if( eachAsString )
  {
    for(var k=0; k < arrUnique.length; k++)
      result.push( arrUnique[k].join(separator));
  }
  else
    result = arrUnique;

	return result;
}

/*
* Filters those numbers (in range 1 .. (2 pow howManyBits), 
* which have howMany1 of "1" in its binary representation.
E.g. howManyBits = 3, howMany1 = 2
110
011
101
*/
function filterBinaryNumbers(howManyBits, howMany1)
{
  var arr = [];
  var doFilter = true;
  if (howMany1 === undefined) // it means choose all numbers
    doFilter = false;

  if (!doFilter || howMany1 >= 0)
  {
    var maxNumber = Math.pow(2, howManyBits);

    // let's filter those numbers which have howMany1 of "1" in its binary representation.
    for(var i = 0; i < maxNumber; i++)
    {
      if ( !doFilter || howManyOnes(i) == howMany1 )
      {
        arr.push( 
          completeBinaryNumber( (i).toString(2), howManyBits) 
          );
      }
    }
  }

  return arr;
}

function completeBinaryNumber(str, howManyBits)
{
  var prefix = "";
  var num = howManyBits - str.length; 
  if ( num > 0 ) 
  {
    for(var i=0; i < num; i++)
    {
      prefix += "0";
    }
  }
  return prefix + str;
}

function howManyOnes(num)
{

  var sBinary = (num).toString(2);
  var len = sBinary.length;
  var counter = 0;
  for(var i=0; i < len; i++)
  {
    if ( sBinary[i] == '1' )
      counter++;
  }
  return counter;
}

/*
* STACK
*/

class Stack
{

  constructor()
  {
    this._size = 0;
    this._storage = {};
  }

  push(data)
  {
    var size = ++this._size;
    this._storage[size] = data;
  }

  pop() 
  {
    var size = this._size, result=null;

    if (size) 
    {
        result = this._storage[size];

        delete this._storage[size];
        this._size--;
    }
    return result;
  }

  getLastValue()
  {
    return this._size ? this._storage[this._size] : null;
  }

  size()
  {
    return this._size;
  }
}

// ------------------------------------------------

function copyObject(obj)
{
  let result = {};
  let arr = Object.keys(obj);
  for( let i=0; i < arr.length; i++)
    result[arr[i]] = obj[arr[i]];
  return result;
}

function copyToObject(objDestination, objSource)
{
  let arr = Object.keys(objSource);
  for( let i=0, L = arr.length; i < L; i++)
    objDestination[arr[i]] = objSource[arr[i]];
  //return result;
}


///////////////
function findPosX(obj) {
    var curleft = 0;
    if (obj.offsetParent) {
        while (1) {
            curleft+=obj.offsetLeft;
            if (!obj.offsetParent) {
                break;
            }
            obj=obj.offsetParent;
        }
    } else if (obj.x) {
        curleft+=obj.x;
    }
    return curleft;
}
 
function findPosY(obj) {
    var curtop = 0;
    if (obj.offsetParent) {
        while (1) {
            curtop+=obj.offsetTop;
            if (!obj.offsetParent) {
                break;
            }
            obj=obj.offsetParent;
        }
    } else if (obj.y) {
        curtop+=obj.y;
    }
    return curtop;
}

////////////////////////////////////////////////////////////////////////////////////////////////

function generateUID() 
{
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace( /[xy]/g, 
        function ( c ) {
          var r = Math.random() * 16 | 0;
          return ( c == 'x' ? r : ( r & 0x3 | 0x8 ) ).toString( 16 );
        });
}

///////////////////////////
// x gives position in the range a1-a2. finds relative position in the other range b1-b2
function mapValue(x, a1, a2, b1, b2 )
{
  let rel = (x-a1)/(a2-a1);
  let y = b1 + (b2-b1)*rel;
  return y;
}

function multiplyString(str, numOfTimes)
{
  return str.repeat(numOfTimes);

  /*let result = "";
  for(let i=0; i < numOfTimes; i++)
    result += str;
  return result;*/
}

// ---------------------------

function readJSONFile(url, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", url, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}


// ---------------------------


function animateCss(element, animationName, moreClasses, callback) {
    const node = document.querySelector(element)
    node.classList.add('animated', animationName)

    let arrMoreClasses = Array.isArray(moreClasses) ? moreClasses : 
      (typeof moreClasses === 'string' && moreClasses!="" ? moreClasses.split(" ") : []);


    arrMoreClasses.forEach( clsName => node.classList.add(clsName) );


    function handleAnimationEnd() {
        node.classList.remove('animated', animationName);
        arrMoreClasses.forEach( clsName => node.classList.remove(clsName) );

        node.removeEventListener('animationend', handleAnimationEnd)

        if (typeof callback === 'function') callback()
    }

    node.addEventListener('animationend', handleAnimationEnd)
}

