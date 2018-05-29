const   Util = require('../Util/Util'),
        _genQRCode = require('./_genQRCode'),
        _init = require('./_init');

const   SODA_SRC = require('./_sodaImg_base64');

const   RATIO = 2;

const   ELE_STYLE ={
    'position':'absolute'
};

class Share_Item{
    constructor(bgSrc,option){
        this._canvas = document.createElement('canvas');
        
        this._qr_img = null;
        this._bg_img = null;
        this._soda_img = null;
        this._submission_img = null;

        this._soda_src = SODA_SRC;
        this._submission_src = null;
        this._bg_src = bgSrc;
        this._url = null;

        this._init_option(option);
        this._init();
    }

    create(url,submissionImg){_create.call(this,url,submissionImg);};

    _init(){_init.call(this);}
    _init_option(option){Util.init_option.call(this,option);}
    _genQRCode(url,cb){_genQRCode.call(this,url,cb);}
    _loadImg(src,cb){_loadImg.call(this,src,cb);}
}