const   Canvas_Item = require('./Canvas_Item/Canvas_Item'),
        Share_Item = require('./Share_Item/Share_Item');

class Sdk{
    constructor(){
        this._canvas = null;
        this._share = null;
    }

    createCanvas(container,option){return this._canvas = new Canvas_Item(container,option);}
    createShare(bgSrc,option){return this._share = new Share_Item(bgSrc,option);}
}

module.exports = Sdk;