const   APIAbstract = require('./APIAbstract/APIAbstract'),
        StatHandler = require('./StatHandler/StatHandler'),
        Canvas_Item = require('./Canvas_Item/Canvas_Item'),
        Share_Item = require('./Share_Item/Share_Item'),
        Util = require('./Util/Util');

const   _api_config = require('./_api_config'),
        _getUrlParam = require('./_getUrlParam'),
        _init = require('./_init'),
        _checkOpenId = require('./_checkOpenId'),
        //wechat
        _setWechatShare = require('./wechat/_setWechatShare'),
        _configJSSDK = require('./wechat/_configJSSDK'),
        //auth
        _getOAuthCode = require('./auth/_getOAuthCode'),
        _getWXInfo = require('./auth/_getWXInfo'),
        //好友入口
        _addPoint = require('./_addPoint'),
        _getRank = require('./_getRank'),
        _getSubmissionByPid = require('./_getSubmissionByPid'),
        //参与入口
        _getSubmission = require('./_getSubmission');

const   SERVER_CONFIG={
    host:'http://test.swarmgate.com.cn',
    token:'fsiisq1526695953',
    statFid:3
};

class Sdk{
    constructor(options){
        this._debug = false;
        
        this._canvas = null;
        this._share = null;
        this._submissionHandler = null;
        this._statHandler = new StatHandler(SERVER_CONFIG.statFid);

        this._debug = false;
        //this._statFid = SERVER_CONFIG.statFid;
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
    set debug(bool){this._debug=bool;}
    /*-------------------
        public method
    --------------------*/
    setWechatShare(title,desc,link,imgUrl,errorCb,successCb){_setWechatShare.call(this,title,desc,link,imgUrl,errorCb,successCb);}
        /*------------
            canvas交互
        -------------*/
    createCanvas(container,option){return this._canvas = new Canvas_Item(container,option);}
    createShare(bgSrc,option){return this._share = new Share_Item(bgSrc,option);}
        /*------------
            数据逻辑
        -------------*/
    checkOpenId(errorCb,successCb){_checkOpenId.call(this,errorCb,successCb);}
        /*------------
            好友入口
        -------------*/
    getRank(errorCb,successCb){_getRank.call(this,errorCb,successCb);}
    getSubmissionByPid(errorCb,successCb){_getSubmissionByPid.call(this,errorCb,successCb);}
    addPoint(errorCb,successCb){_addPoint.call(this,errorCb,successCb);}
        /*------------
            参与入口
        -------------*/
    getSubmission(errorCb,successCb){_getSubmission.call(this,errorCb,successCb);}
    /*-------------------
        private method
    --------------------*/
    _init(API){_init.call(this,API);}
    _init_option(option){Util.init_option.call(this,option);}
    _getUrlParam(){_getUrlParam.call(this);}
        /*------------
            微信API
        -------------*/
    _configJSSDK(errorCb,successCb){_configJSSDK.call(this,errorCb,successCb);}
        /*------------
            授权API
        -------------*/
    _getOAuthCode(){_getOAuthCode.call(this);}
    _getWXInfo(code,errorCb,successCb){_getWXInfo.call(this,code,errorCb,successCb);}
}

module.exports = Sdk;