function _getAuthCode(tel,errorCb,successCb){
    this.authCode = null;
    this.tel = tel;
    
    this._model.request('sendCode',{post:{tel:tel}},(data)=>{
        if(this._debug)
            console.log('sendCode',data);
        
        if(data.error_code == '200'){
            successCb();
        }else{
            errorCb(data.error_code);
        }
    });
};

module.exports = _getAuthCode;