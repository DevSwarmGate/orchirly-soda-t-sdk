const  ERROR ={
    "0":"getWXInfo error",
    "1":"jsSDK init error"
};

function _checkOpenId(errorCb,successCb){
    let initJSSDK =()=>{
        this._configJSSDK(errorCb,successCb);
    };

    this._models.app.request('sodaStart',{},(data)=>{
        if(data.error_code !=='200'){
            this._getOAuthCode();
            this._getWXInfo(
                this._urlParam.code,
                (data)=>{
                    errorCb({api_error_code:data.code,msg:{id:0,messageList:MSG}});
                },
                (data)=>{
                    initJSSDK();
                }
            );
        }else{
            initJSSDK();
        }
    });
};

module.exports = _checkOpenId;