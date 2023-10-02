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
