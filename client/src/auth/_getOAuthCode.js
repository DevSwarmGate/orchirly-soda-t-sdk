function _getOAuthCode(){
   let url = this._models.auth.getAPIURL(
        'getOchirlyOauthCode',
        {
            get:{
                target:window.location.href//.replace(window.location.origin,'')
            }
        }
    );

    if(this._urlParam.test == '1' || this._urlParam.code)
        return console.log(url);
    
    window.location.href = url;
};

module.exports = _getOAuthCode;