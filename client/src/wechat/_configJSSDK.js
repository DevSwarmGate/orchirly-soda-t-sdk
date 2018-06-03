const MSG ={
    "0":"getJSApiConfig error",
};

const API_LIST =[
    "onMenuShareTimeline",
    "onMenuShareAppMessage",
    "showAllNonBaseMenuItem"
];

function _configJSSDK(errorCb,successCb){
    let url = window.location.origin+window.location.pathname;

    if(this._urlParam.sid)
        url +=`?sid=${this._urlParam.sid}`;
    
    if(this._urlParam.code)
        window.history.replaceState({}, "afterAuth",url);

    let config = ()=>{
        let jsApi={
            debug: false,//this._debug, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: this._jsSDKConfig.appid, // 必填，公众号的唯一标识
            timestamp: this._jsSDKConfig.timestamp, // 必填，生成签名的时间戳
            nonceStr: this._jsSDKConfig.noncestr, // 必填，生成签名的随机串
            signature: this._jsSDKConfig.signature,// 必填，签名，见附录1
            jsApiList: API_LIST //  ,"hideMenuItems"必填，需要使用的JS接口列表，所有JS接口列表见附录2  
        };

        wx.config(jsApi);
    };

    this._models.wechat.request('getJSApiConfig',{post:{url:url}},(data)=>{
        if(this._debug)
            console.log('getJSApiConfig',data);

        if(data.error_code == '200'){
            this._jsSDKConfig = data.data;
            config();
            successCb();
        }else{
            errorCb({api_error_code:data.code,msg:{id:0,messageList:MSG}});
        }
    });
};

module.exports = _configJSSDK;