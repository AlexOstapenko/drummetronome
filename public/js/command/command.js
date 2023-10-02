// requires utils.js

let COMMANDS_USER_MSG = 
{
	OPENING_BRACKET_NOTFOUND: "There is closing bracket, but no opening bracket is found:\n\n%1\n\nPosition: %2.",
	WRONG_CLOSING_BRACKET: "Wrong closing bracket is found:\n\n%1\n\nPosition: %2",
	BRACKET_NOT_CLOSED: "Bracket is not closed:\n\n%1\n\nPosition: %2",

	formatMessageText: function(message)
	{
		let result = message;
		for(let i=0; i < arguments.length; i++)
		{
			result = result.replace("%"+i, arguments[i]);
		}
		return result;
	}
}

const COMMAND_OPENING_BRACKETS = "({[<";
const COMMAND_CLOSING_BRACKETS = ")}]>";

class BracketsUtils
{
	constructor()
	{
	}

	static getCouple(br)
	{
		let result = "";
		let idx = -1;
		let strOpposite = "";
		if (COMMAND_OPENING_BRACKETS.includes(br))
		{
			idx = COMMAND_OPENING_BRACKETS.indexOf(br);
			strOpposite = COMMAND_CLOSING_BRACKETS;
		}
		if (idx == -1)
		{
			idx = COMMAND_CLOSING_BRACKETS.indexOf(br);
			if (idx != -1)
				strOpposite = COMMAND_OPENING_BRACKETS;
		}

		if (idx >=0 )
			result = strOpposite[idx];

		return result;
	}

	/*
	* Excludes the given opening bracket from the list of all and returns the rest
	*/
	static otherOpeningBrackets(charBracket)
	{
		return COMMAND_OPENING_BRACKETS.replace(charBracket,"");
	}

	static checkClosingBracket(stack, ch, idx, callbackSuccess)
	{
		let isError = false;
		let lastStackValue = stack.getLastValue();
		let errorText = "";
		if ( lastStackValue == null )
		{
			isError = true;
			errorText = COMMANDS_USER_MSG.formatMessageText(
				COMMANDS_USER_MSG.OPENING_BRACKET_NOTFOUND, ch, idx);
		}
		else 
		{
			if ( BracketsUtils.getCouple(ch) != lastStackValue )
			{
				isError = true;
				errorText = COMMANDS_USER_MSG.formatMessageText(
					COMMANDS_USER_MSG.WRONG_CLOSING_BRACKET, ch, idx);
			}
			else
				if (!(callbackSuccess === undefined))
					callbackSuccess( stack );
		}

		return errorText;
	}

	/*
	* Reverses string and all the brackets: 
	* Example: (123)[ab] -> [ba](321)
	*/
	static reverse(str)
	{
		let result = "";
		for(let L=str.length, i=L-1; i >= 0; i--)
		{
			let ch = str[i];
			if ( COMMAND_OPENING_BRACKETS.includes(ch) || COMMAND_CLOSING_BRACKETS.includes(ch) )
				ch = BracketsUtils.getCouple(ch);
			
			result += ch;
		}
		return result;
	}


}


class CommandParser
{
	/*
	* In a given string separates all commands, splitted by " ". 
	* If a space is included in a command within 
	* any type of brackets () {} [] - it is not considered as a global separator. 
	* Only those spaces which do not belong to any block are treated so.
	* If asStrings is true, returns each command as a string, otherwise as an instance of Command.
	* E.g. the given string: "@r(something) A B C @g(something) | {A b b}:4 D=[ta ka]"
	* will produce an array: 
	* "@r(something)", "A", "B", "C", "@g(something)", 
	*  "|", "{A b b}:4", "D", "=", "[ta ka]"
	*
	* This functoin will alert an error if there is some mistakes in opening/closing brackets.
	* E.g. {A @r( } - the bracket "(" is not closed after @r.
	* 
	* Returns array of strings or instances of Command class.
	*/
	
	splitCommands(scriptString, asStrings, separatorChar)
	{
		let result = [];
		let startIdx = 0;
		let txt = scriptString.trim();
		let stack = new Stack();
		let isError = false;
		let errorText = "";
		separatorChar = (separatorChar===undefined ? ' ' : separatorChar);

		for(let i=0; i < txt.length && !isError; i++)
		{
			let ch = txt[i];
			let isLastChar = (i == (txt.length-1));

			if ( COMMAND_OPENING_BRACKETS.includes(ch) )
				stack.push(ch);
			else if ( COMMAND_CLOSING_BRACKETS.includes(ch) )
			{
				errorText = BracketsUtils.checkClosingBracket(stack, ch, i, function(stack){stack.pop();});
				if (errorText != "")
					isError = true;
			}

			let stackSize = stack.size();

			if (!isError)
			{
				if ( (ch==separatorChar || ch=='\n' || isLastChar ) && stackSize == 0 )
				{
					let num = (i - (isLastChar ? 0:1)) - startIdx+1;
					let commandText = txt.substr(startIdx, num).trim();
					
					if (commandText != "")
					{
						if (asStrings)
							result.push( commandText );
						else
				  			result.push( new Command( commandText ) );
					}

				  	startIdx = i+1;
				}
				else if( isLastChar && stackSize > 0 )
				{
					isError = true;
					errorText = COMMANDS_USER_MSG.formatMessageText(
							COMMANDS_USER_MSG.BRACKET_NOT_CLOSED, stack.getLastValue(), i);
				}
			}
		}

		if (isError) 
			throw new SyntaxError(errorText);

		return result;
	}

	/*
	* Removes spaces to the left and right from the specified instruction
	*/
	removeSpaces(commandText, instruction)
	{
		return trimArray( commandText.split(instruction) ).join(instruction);
	}

	/*
	* Before each character from strCharsToAddSpace adds a space IF there is no space
	*/
	addSpaceBeforeEach(commandText, strCharsToAddSpace, cancelChars)
	{
		cancelChars = cancelChars ? cancelChars : ""; 
		for(let i=0; i < strCharsToAddSpace.length; i++)
		{
			let ch =  "" + strCharsToAddSpace[i];
			let newCommandText = "";

			for(let k=0; k < commandText.length; k++)
			{
				if (k > 0 && commandText[k]==ch && commandText[k-1]!=" " && !cancelChars.includes(commandText[k-1]) )
					newCommandText += " ";
				newCommandText += commandText[k];
			}
			commandText = newCommandText;
		}

		return commandText;
	}

	replaceAll(commandText, piece, replacement )
	{
		return commandText.split(piece).join(replacement);
	}
}

/*
* --------------------------------
*/
class Command
{
	/*
	* commandText is of format: {cmd(a,b,c,...)}*2:4!
	*/
	constructor(txt)
	{
		this.commandText = txt;
	}

	/*
	* Extracts parameters of a command from cmdName(a, b, c...) string and returns array [a,b,c,...]
	*/
	getArgs(splitter)
	{
		splitter = ( splitter === undefined ? ',' : splitter );
	  	let result = [];

	  	// search for brackets
	  	let brIndex = -1;
		let doSearch = true;
		let otherBracketsCounter = 0;
	  	for(let i=0; i < this.commandText.length && doSearch; i++)
		{
			let ch = this.commandText[i];
			if (ch == "{" || ch=="[" )
				doSearch = false;
			else if (ch =="(")
			{
				brIndex = i;
				doSearch = false;
			}
		}

		// get data from within the brackets
		if (brIndex >= 0)
		{
			let collectedTxt = "";
			let tmpCmd = new Command(this.getDataFromBrackets( "(" ));
			for(let i=0, L = tmpCmd.commandText.length; i < L; i++)
			{
				let ch = tmpCmd.commandText[i];
				if (ch == splitter && tmpCmd.isOutsideOfAnyBlock(i))
				{
					result.push(collectedTxt);
					collectedTxt = "";
				}
				else
				{
					collectedTxt += ch;
					if (i==L-1)
						result.push(collectedTxt);
				}
			}
		}

		if (result.length==0) result = null;
	  	return result;
	}

	/*
	* For example we have a command: A(args):4! 
	* getModifier can get for you the "4" as a value of modifier ":". 
	* For this you can call this function like this:
	* getModifier(":", "!")
	* If the function will not meet any stopChars, it will read the command string untill the end.
	*
	* Another example. Command is: {A*3}*2:4. getModifier("*", ":") will return "2". There is two
	* modifiers of type "*" in this command, but *3 belongs to "A" and is inner modifier of the {...} block.

	*/

	getModifier(modif, stopChars)
	{
		let result = "";
		if (stopChars===undefined) stopChars = "";

		let idx = this.indexOfModifier( modif );
		if (idx >=0 )
			result = this.getInstructionFromIndex(idx, stopChars);
		
		return result;
	}

	// checks if a char by given idx is 
	isOutsideOfAnyBlock(idx)
	{
		if (idx > this.commandText.length)
			idx = this.commandText.length-1;

		let stack = new Stack();
		for(let i=0; i < idx ; i++)
		{
			let ch = this.commandText[i];

			if ( COMMAND_OPENING_BRACKETS.includes(ch) )
				stack.push(ch);
			else if ( COMMAND_CLOSING_BRACKETS.includes(ch) )
			{
				let errText = 
					BracketsUtils.checkClosingBracket( stack, ch, i, function(stack){stack.pop();})
				if (errText != "")
					throw new SyntaxError(errText);
			}
		}

		// check stack - if there is something, it means we are still inside some block
		return stack.size()==0;
	}

	/*
	* Gets all chars from the specified index to the end of the command or until meets any of stopChars.
	*/
	getFromIndex(idx, stopChars)
	{
		let result = "";
		for( let i=idx; 
			 i < this.commandText.length && !stopChars.includes( this.commandText[i]); 
			 i++ )
			result += this.commandText[i];
		return result;
	}

	/*
	* Takes all chars from idx+1 to the end of the command or any of char in stopChars.
	* Instruction is single char so it's length is 1.
	* Index should point to exact place of this instruction.
	* E.g. "A:2" idx=1, <ta ki ta>, idx = 0.
	* Be careful, this function doesn't perform any validation.
	*/
	getInstructionFromIndex(idx, stopChars)
	{
		return this.getFromIndex(idx+1, stopChars);
	}

	/*
	* Searches for index of a first appearance of a given modifier which doesn't belong to any block.
	* Assume that modif is not a bracket
	*/
	indexOfModifier(modif, searchFromEnd)
	{
		let commandStr = searchFromEnd ? BracketsUtils.reverse(this.commandText) : this.commandText;

		let result = -1;
		let stack = new Stack();

		for(let i=0; i < commandStr.length && result == -1; i++ )
		{
			let ch = commandStr[i];
			if (COMMAND_OPENING_BRACKETS.includes(ch))
				stack.push(ch);
			else if (COMMAND_CLOSING_BRACKETS.includes(ch))
			{
				let errText = 
					BracketsUtils.checkClosingBracket( stack, ch, i, function(stack){stack.pop();})
				if (errText != "")
					throw new SyntaxError(errText);
			}

			if (ch == modif && stack.size() == 0)
				result = i;
		}

		return searchFromEnd ? (commandStr.length-1-result) : result;
	}

	/*
	indexOfModifier(modif, searchFromEnd)
	{
		let result = -1;
		let stack = new Stack();

		let L = this.commandText.length;
		let startIdx = searchFromEnd ? (this.commandText.length-1) : 0;
		let checkFunc = searchFromEnd ? 
			function(i) { return i >= 0;} :
			function(i) { return i < L;};

		let changeIdx = searchFromEnd ? 
			function(i) {return i-1;} :
			function(i) {return i+1;};

		for(let i=startIdx; checkFunc(i) && result == -1; i=changeIdx(i) )
		{
			let ch = this.commandText[i];
			if (COMMAND_OPENING_BRACKETS.includes(ch))
				stack.push(ch);
			else if (COMMAND_CLOSING_BRACKETS.includes(ch))
			{
				let errText = 
					BracketsUtils.checkClosingBracket( stack, ch, i, function(stack){stack.pop();})
				if (errText != "")
					throw new SyntaxError(errText);
			}

			if (ch == modif && stack.size() == 0)
				result = i;
		}
		return result;
	}
	*/

	checkIfHasModifier(modif)
	{
		return this.indexOfModifier(modif) >= 0;
	}

	getDataFromBrackets(openingBracket, searchFromEnd)
	{
		let result = "";
		let indexes = this.getBracketIndexes(openingBracket, searchFromEnd);
		if (indexes.idx1 >=0 && indexes.idx2 > 0)
		{
			result = this.commandText.substring(indexes.idx1+1, indexes.idx2);
		}

		return result;
	}

	/*
	* Returns object: {idx1: , idx2: }
	* idx1 - opening bracket
	* idx2 - corresponding closing bracket
	*/
	getBracketIndexes(openingBracket, searchFromEnd)
	{
		let commandStr = searchFromEnd ? BracketsUtils.reverse(this.commandText) : this.commandText;

		let result = {idx1: -1, idx2: -1};
		let closingBracket = BracketsUtils.getCouple(openingBracket);
		let stack = new Stack();

		let doSearch = true;
		for(let i = 0; doSearch && i < commandStr.length; i++)
		{	
			let ch = commandStr[i];
			if ( COMMAND_OPENING_BRACKETS.includes(ch) )
			{
				if (ch == openingBracket && stack.size()==0) //this.isOutsideOfAnyBlock(i))
					result.idx1 = i;

				stack.push(ch);
			}
			else if ( COMMAND_CLOSING_BRACKETS.includes(ch) )
			{
				stack.pop();	
				if (ch == closingBracket && stack.size() == 0)
				{
					result.idx2 = i;
					doSearch = false;
				}
				
			}
		}

		if (searchFromEnd)
		{
			let result1 = {idx1:-1, idx2: -1};
			if ( result.idx1 >= 0)
				result1.idx2 = this.commandText.length-1-result.idx1;
			if (result.idx2 >= 0 )
				result1.idx1 = this.commandText.length-1-result.idx2;
			result = result1;
		}

		return result;
	}

	/*
	* Searches for a 0-level modifier in a command and returns array of 2 values: 
	* substring before modifier and substring after modifier
	*/
	splitByModifier(modif, searchFromEnd)
	{
		let result = [];
		let idx = this.indexOfModifier(modif, searchFromEnd);
		if (idx==-1)
			result.push(this.commandText, "");
		else
		{
			result.push(this.commandText.substring(0, idx),
						this.commandText.substring(idx+1));
		}
		return result;
	}

	toString() { return this.commandText; }
}

////////////////////////////////////////////////////////////////////////////////////
class CommandWithOrderedArgs extends Command
{
	constructor(txt)
	{
		super(txt);

		this.argValueCallback = null;
		this.argIndexCallback = null;
		this.keyToIndex = {};

		//this.maxNumOfArgs = 0;
	}

	// This function will process UNORDERED arguments from the command
	// arguments for callback: ( data )
	// data - piece of data to be parsed by client code. Argument value should be returned.
	set getArgValueCallback(callback) { this.argValueCallback = callback; }
	get getArgValueCallback() {return this.argValueCallback;}

	// This callback function gets full piece of argument data (one parameter)
	// Should return an index of argument contained in data.
	// Should return -1 if this arg cannot be identified (identification is used in case of unordered list)
	set getArgIndexCallback(callback) {this.argIndexCallback = callback;}
	get getArgIndexCallback() { return this.argIndexCallback; }

	// If the key is standart prefix, followed by data (e.g. "gap:data"), you can register
	// this key ("gap:" in the example) and it will be processed automatically. You don't need to process
	// such arguments in callback functions.
	setIndexByKey(txtKey, idx)
	{
		this.keyToIndex[txtKey] = idx;
	}

	getIndexByKey(txtKey)
	{
		return this.keyToIndex[txtKey];
	}

	// Returns a key if data starts from any of keys defined in the object.
	getKeyFromData(data)
	{
		let result = "";
		let keys = Object.keys(this.keyToIndex);
		for(let i=0; i < keys.length && result == ""; i++)
		{
			if( data.indexOf(keys[i]) == 0 )
				result = keys[i];
		}

		return result;
	}

	// Arguments are given as (...) part of a command. It could be two options: 
	// 1) ordered list of args, separated by comma, so we know the index of each arg.
	// 2) unordered list, separated by " ", it should be possible to identify each arg and find out it's index
	//    so we can get ordered list of args from unordered one.
	// Examples:
	// 1) @r(1,0+,free,textArg) <- ordered
	// 2) @r(free #1)  			<- unordered
	// Returns ordered array of parsed argument values. Some of them could be undefined 
	// if they are not provided in the command
	analyseArgs()
	{
		let result = null;

		let dataFromBrackets = this.getDataFromBrackets("(").trim();
		
		if (dataFromBrackets.length > 0) // there are some arguments
		{
			let cmd = new Command( dataFromBrackets );
			if (cmd.indexOfModifier(",") == -1 )
			{
				// wether it's only one parameter (identified by it's key) 
				// or several separated by "space" (definitely unordered)
				let cmdParser = new CommandParser();
				let arr = cmdParser.splitCommands(cmd.commandText, true);

				if ( arr.length > 1 ) 
						result = this.processArgs( arr, false );
				else if ( arr.length==1 ) // just to be sure
				{
					if ( this.getKeyFromData(arr[0]) != "" || this.argIndexCallback( arr[0] ) >= 0 )
						result = this.processArgs( arr, false );
					else
						result = this.processArgs(arr, true);
				}
			}
			else // processing ordered list
				result = this.processArgs(this.getArgs(), true);
		}

		return result;
	}

	// integer that defines how many arguments at all could be given to this command
	//set maxNumOfArgs(val) {this.maxNumOfArgs = val;}

	processArgs(arrArgs, isOrdered)
	{
		let result = [];

		for(let i=0, L = arrArgs.length; i < L; i++)
		{
			let currArg = arrArgs[i].trim();
			let currArgValue = undefined;
			let idx = -1; 

			if (currArg=="") // empty data means that argument by the current idx is not defined
			{
				if (!isOrdered)
					throw new SyntaxError("Empty argument value in unordered argument list. Command: " + this.commandText );

				idx = i;
			}
			else
			{
				if (!isOrdered)
				{
					let key = this.getKeyFromData(currArg);
					if (key == "")
					{
						idx = this.argIndexCallback(currArg);
						if (idx == -1)
							throw new SyntaxError("Unknown argument: " + currArg + " in command " + this.commandText);

						currArgValue = this.getArgValueCallback( currArg );
					}
					else
					{
						idx = this.getIndexByKey(key);
						currArgValue = currArg.substring( key.length );
					}
				}
				else
				{
					idx = i;
					currArgValue = currArg;
				}
			}

			if (currArgValue == "")
				currArgValue = undefined; 

			result[idx] = currArgValue;
		}

		return result;
	}
}

