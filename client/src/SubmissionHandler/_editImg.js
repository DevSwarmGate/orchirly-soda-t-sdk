function _editImg(img,errorCb,successCb){
    this._model.request('sodaEditImg',{post:{img:img}},(data)=>{
        if(this._debug)
            console.log('sodaEditImg',data);
        
        if(data.error_code == '200'){
            successCb();
        }else{
            errorCb(data.error_code);
        }
    });
};

module.exports = _editImg;