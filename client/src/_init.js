function _init(API){
    for(let m in this._api_config){
        this._models[m] = new API(this._api_host,this._token,this._api_config[m]);
    }
};

module.exports = _init;