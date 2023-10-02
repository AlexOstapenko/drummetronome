// ------------------------------------------------------------------------------ class FRACTION
// Works with fractions like human (numerator / denominator), without floating point operations.

class Fraction
{
  static createFromString(txt)
  {
    let num = 0; 
    let denom = 1;
    let divSignIdx = txt.indexOf("/");
    if (divSignIdx==-1)
    {
      num = parseInt(txt);
    }
    else
    {
      num = 1;
      if (divSignIdx>0)
        num = parseInt(txt.substr(0, divSignIdx));

      let txtDenom = txt.substr(divSignIdx+1);
      if (txtDenom=="") txtDenom = "1";
      denom = parseInt(txtDenom);
    }

    return new Fraction(num, denom);
  }

  constructor(num, denom)
  {
    this.num = 0; // numerator
    this.denom = 1; // denominator
    this.set(num, denom);
  }

  set(num, denom)
  {
    if (!(num === undefined))
    {
      if (num instanceof Fraction)
      {
        this.num = num.num;
        this.denom = num.denom;
      }
      else if ( (typeof num) == "string" )
      {
        let f = Fraction.createFromString(num);
        this.num = f.num;
        this.denom = f.denom;
      }
      else if ( (typeof num)=="number" )
      {
        this.num = num;
        this.denom = denom === undefined ? 1 : denom;  
      }
    }

    this.simplify();
  }

  mult(value)
  {
    if ((typeof value)=="string")
      value = Fraction.createFromString(value);
    
    if (value instanceof Fraction)
    {
      this.num *= value.num;
      this.denom *= value.denom;
    }
    else if ( (typeof value) == "number")
    {
      this.num *= value;
    }
    this.simplify();
    return this;
  }

  divide(value)
  {
    if ((typeof value)=="string")
      value = Fraction.createFromString(value);
    
    if (value instanceof Fraction)
    {
      // turn upside down
      this.num *= value.denom;
      this.denom *= value.num;
    }
    else if ( (typeof value) == "number")
    {
      this.denom *= value;
    }
    this.simplify();
    return this;
  }

  plus(value)
  {
    if ((typeof value)=="string")
      value = Fraction.createFromString(value);
   
    if ( (typeof value) == "number")
    {
      value = new Fraction(value, 1);
    }
    
    if (value instanceof Fraction)
    {
      this.num = this.num*value.denom + value.num * this.denom;
      this.denom *= value.denom;
      this.simplify();
    }

    return this;
  }

  reverse()
  {
    if (this.num!=0)
    {
      let newNum = this.denom;
      this.denom = this.num;
      this.num = newNum;
    }
    return this;
  }

  getSize()
  {
    return this.num/this.denom;
  }

  simplify()
  {
    if (this.num != 0)
    {
      while( isEven(this.num) && isEven(this.denom) )
      {
        this.num /= 2;
        this.denom /= 2;
      }

      if (this.num >= this.denom && (this.num%this.denom==0) )
      {
        this.num /= this.denom;
        this.denom = 1;
      }
      else if (this.num > 1 && this.denom > this.num && (this.denom%this.num==0) )
      {
        this.denom /= this.num;
        this.num = 1;
      }

    }
    return this;
  }

  intPart()
  {
    return Math.floor( this.num / this.denom );
  }
  
  remainder()
  {
    return this.num%this.denom;
  }

  html()
  {
    return this.toString(true);
  }

  toString(inHTML, showIntPart)
  {
    let result = "";
    if (this.num == 0)
      result = "0";
    else if (this.num == this.denom)
      result = "1";
    else if(this.denom == 1)
      result = "" + this.num;
    else
    {
      if (showIntPart)
      {
        let intPart = this.intPart();
        let remainder = this.remainder();
        if (remainder == 0)
          result = "" + intPart;
        else
        {
          if (intPart == 0)
          {
            result = remainder + "/" + this.denom;
          }
          else
          {
              if (inHTML)
                result = "<b class='midSize'>" + intPart + "</b>" + (remainder) + "/" + this.denom; 
              else
                result = (intPart + "+") + (remainder) + "/" + this.denom; 
          }
        }
      }
      else
        result = this.actualToString();

    }
    return result;
  }

  actualToString()
  {
    return this.num + "/" + this.denom;
  }

  equals(value)
  {
    let result = false;
    let fraction = null;
    if (value instanceof Fraction)
    {
      fraction = value;
      fraction.simplify();
    }
    else if ( (typeof value)=="number" )
      fraction = new Fraction(value);
    else if ( (typeof value) == "string" )
    {
      fraction = Fraction.createFromString(value);
    }

    if (fraction != null)
    {
      this.simplify();  
      result = (this.num==fraction.num && this.denom==fraction.denom);
    }
    
    return result;
  }

  clone()
  {
    return new Fraction(this.num, this.denom);
  }

  
}