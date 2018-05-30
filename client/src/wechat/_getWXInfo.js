function _getWXInfo(code,errorCb,successCb){
    if(code.indexOf('?state')!==-1)
        code = code.substring(0,code.indexOf('?state'));

    this._models.wechat.request('getWXOpenIDInfoWithCode',{get:{},post:{code:code,openidname:'wecha_id_info'}},(data)=>{
        console.log('getWXOpenIDInfoWithCode',data);
        if(data.error_code == '200'){
            successCb(data.data);
        }else{
            errorCb(data.error_code);
        }
    });
};

module.exports = _getWXInfo;