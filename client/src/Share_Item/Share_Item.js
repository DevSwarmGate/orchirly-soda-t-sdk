const   Util = require('../Util/Util'),
        _genQRCode = require('./_genQRCode');

const   SODA_SRC = require('./_sodaImg_base64');

class Share_Item{
    constructor(container,option){
        this._container = container;
        this._qr_img = null;
        this._bg_img = null;
        this._soda_img = null;
        this._submission_img = null;

        this._soda_src = SODA_SRC;
        this._submission_src = null;
        this._bg_src = null;
        this._url = null;

        this._init_option(option);
    }

    create(url){_create.call(this,url);};

    _init_option(option){Util.init_option.call(this,option);}
    _genQRCode(url,cb){_genQRCode.call(this,url,cb);}
}