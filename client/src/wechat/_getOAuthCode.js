const   SCOPE = 'snsapi_userinfo',
        STATE = '';

function _getOAuthCode(){
   let url = this._models.wechat.getAPIURL(
        'getWXOauthCode',
        {
            get:{
                target:window.location.href.replace(window.location.origin,''),
                scope:SCOPE,
                state:STATE
            }
        }
    );

    if(this._urlParam.test == '1' || this._urlParam.code)
        return console.log(url);
    
    window.location.href = url;
};

module.exports = _getOAuthCode;