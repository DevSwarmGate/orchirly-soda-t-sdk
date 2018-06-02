const  ERROR ={
    "0":"getWXInfo error",
    "1":"jsSDK init error"
};

function _checkOpenId(errorCb,successCb){
    let initJSSDK =()=>{
        this._configJSSDK(errorCb,successCb);
    };

    let init_statHandler=()=>{
        this._statHandler.onRequest=(fid,type,detail)=>{
            this._models.stat.request('addSubmission',{get:{fid:fid},post:{type:type,detail:detail}},(data)=>{
                if(this._debug)
                    console.log('statHandler->addSubmission',data);
            });
        };

        this._statHandler.markPV();
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
                    init_statHandler();
                }
            );
        }else{
            initJSSDK();
        }
    });
};

module.exports = _checkOpenId;