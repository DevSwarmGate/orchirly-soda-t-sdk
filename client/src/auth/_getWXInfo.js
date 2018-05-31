function _getWXInfo(code,errorCb,successCb){
    if(code.indexOf('?state')!==-1)
        code = code.substring(0,code.indexOf('?state'));

    this._models.auth.request('getOchirlyOpenIDInfoWithCode',{get:{},post:{code:code,openidname:'wecha_id_info'}},(data)=>{
        console.log('getOchirlyOpenIDInfoWithCode',data);
        if(data.error_code == '200'){
            successCb(data.data);
        }else{
            errorCb(data.error_code);
        }
    });
};

module.exports = _getWXInfo;