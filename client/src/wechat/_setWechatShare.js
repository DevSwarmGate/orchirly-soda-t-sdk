function setWechatShare(title,desc,link,imgUrl,errorCb,successCb){
    let set = ()=>{
        wx.onMenuShareTimeline({
            title: title,
            link: link,
            imgUrl: imgUrl,
            success: ()=>{
                //用户确认分享后执行的回调
                // alert(linkUrl);
            },
            cancel: ()=>{
                //用户取消分享后执行的回调
            }
        });

        wx.onMenuShareAppMessage({
            title: title,
            desc: desc,
            link: link,
            imgUrl: imgUrl,
            success: ()=>{
                //用户确认分享后执行的回调
                // alert(linkUrl);
            },
            cancel: ()=>{
                //用户取消分享后执行的回调
            }
        });

        successCb();
    };

    if(!this._jsSDKConfig)
        return this._configJSSDK(errorCb,set);

    set();
};

module.exports = setWechatShare;