const   APIAbstract = require('./APIAbstract/APIAbstract'),
        Canvas_Item = require('./Canvas_Item/Canvas_Item'),
        Share_Item = require('./Share_Item/Share_Item'),
        Util = require('./Util/Util');

const   _api_config = require('./_api_config'),
        _getUrlParam = require('./_getUrlParam'),
        _init = require('./_init');

const   SERVER_CONFIG={
    host:'http://test.swarmgate.com.cn',
    token:'fsiisq1526695953',
    statFid:3
};

class Sdk{
    constructor(options){
        this._canvas = null;
        this._share = null;

        this._debug = false;
        this._api_host = SERVER_CONFIG.host;
        this._token = SERVER_CONFIG.token;
        this._api_config = _api_config;
        this._models = {};

        this._urlParam = {};
        this._url_template = '?code=${code}&test=${test}&sid=${sid}';
        //init
        this._init_option(options);
        this._getUrlParam();
        this._init(APIAbstract);
    }
    /*-------------------
        public method
    --------------------*/
    createCanvas(container,option){return this._canvas = new Canvas_Item(container,option);}
    createShare(bgSrc,option){return this._share = new Share_Item(bgSrc,option);}
    /*-------------------
        private method
    --------------------*/
    _init(API){_init.call(this,API);}
    _init_option(option){Util.init_option.call(this,option);}
    _getUrlParam(){_getUrlParam.call(this);}
}

module.exports = Sdk;