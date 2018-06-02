const   Util = require('../Util/Util'),
        _drawCanvas = require('./_drawCanvas'),
        _genQRCode = require('./_genQRCode'),
        _init = require('./_init'),
        _loadImg = require('./_loadImg'),
        _create = require('./_create');

const   SODA_SRC = require('./_sodaImg_base64'),
        BG_SRC = require('./_bgImg_base64');

const   RATIO = 2;

const   ELE_STYLE ={
    'position':'absolute'
};

class Share_Item{
    constructor(option){
        this._canvas = document.createElement('canvas');
        
        this._qr_img = null;
        this._bg_img = null;
        this._soda_img = null;
        this._submission_img = null;
        this._head_img = null;

        this._soda_src = SODA_SRC;
        this._submission_src = null;
        this._head_img_src = null;
        this._bg_src = BG_SRC;
        this._url = null;

        this._init_option(option);
        this._init();
    }
    /*-------------------
        public method
    --------------------*/
    create(url,submissionImgSrc,headImgSrc,cb){_create.call(this,url,submissionImgSrc,headImgSrc,cb);};
    /*-------------------
        private method
    --------------------*/
    _init(){_init.call(this);}
    _init_option(option){Util.init_option.call(this,option);}
    _drawCanvas(cb){_drawCanvas.call(this,cb);}
    _genQRCode(url,cb){_genQRCode.call(this,url,cb);}
    _loadImg(src,cb){_loadImg.call(this,src,cb);}
}

module.exports = Share_Item;