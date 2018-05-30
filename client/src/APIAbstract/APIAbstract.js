const   _getAPIURL = require('./_getAPIURL'),
        _make_api = require('./_make_api'),
        _request = require('./_request');

class APIAbstract{
    constructor(API_host,token,model_json){
        this._isApiresult = true;
        this._token = token;
        this._debug = false;
        this._api_host = API_host;
        this._modelName = null;
        this._verbs = {};

        this._make_api(model_json);
    }
    /*-----------------
    * getter and setter
    ------------------*/
    set debug(bool){this._debug = bool;}
    
    get modelName(){return this._modelName;}
    get verbs(){return this._verbs;}
    /*------------
    * public method
    -------------*/
    request(verb,options,cb){_request.call(this,verb,options,cb);}
    getAPIURL(verb,options){return _getAPIURL.call(this,verb,options);}
    /*------------
    * private method
    -------------*/
    _make_api(json){_make_api.call(this,json);}
}

module.exports = APIAbstract;