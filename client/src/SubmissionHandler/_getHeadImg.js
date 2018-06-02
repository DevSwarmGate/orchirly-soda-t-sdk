function _getHeadImg(errorCb,successCb){
    this._uploadModel.request('uploadImgByLink',{post:{folder:'headImg',link:this._rawData.headurl,format:'jpeg'}},(data)=>{
        if(this._debug)
            console.log('uploadImgByLink',data);

        if(data.error_code == '200'){
            successCb(data.data.path);
        }else{
            errorCb(data.error_code);
        }
    });
};

module.exports = _getHeadImg