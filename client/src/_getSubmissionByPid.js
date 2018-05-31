function _getSubmissionByPid(errorCb,successCb){
    let sid = this._urlParam.sid;

    this._models.app.request('sodaGetSubmissionByPid',{post:{pid:sid}},(data)=>{
        if(this._debug)
            console.log('sodaGetSubmissionByPid',data);
        
        if(data.error_code == '200'){
            successCb(data.data);
        }else{
            errorCb(data.error_code);
        }
    });
};

module.exports = _getSubmissionByPid;