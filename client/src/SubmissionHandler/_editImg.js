function _editImg(img,errorCb,successCb){
    let edit =(src)=>{
        this._model.request('sodaEditImg',{post:{img:src}},(data)=>{
            if(this._debug)
                console.log('sodaEditImg',data);
            
            if(data.error_code == '200'){
                successCb();
            }else{
                errorCb(data.error_code);
            }
        });
    }
    
    this._uploadModel.request('uploadImgBase64',{post:{'module_type':'app','fileupload':img,'fileType':'png'}},(data)=>{
        if(this._debug)
            console.log('uploadImgBase64',data);

        if(data.error_code == '200'){
            let src = `/uploads/${this._token}/app/${data.data.pic}`;
            edit(src);
        }else{
            errorCb(data.error_code);
        }  
    });
};

module.exports = _editImg;