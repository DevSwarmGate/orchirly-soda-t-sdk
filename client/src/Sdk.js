const   Canvas_Item = require('./Canvas_Item/Canvas_Item');

class Sdk{
    constructor(){
        this._canvas = null;
    }

    createCanvas(container,option){return this._canvas = new Canvas_Item(container,option);}
}

module.exports = Sdk;