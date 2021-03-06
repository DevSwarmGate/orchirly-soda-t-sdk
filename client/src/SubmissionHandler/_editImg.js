const MSG = {
    "0":"editImg error",
    "1":"upload submission img error",
    "2":"getHeadImg error",
};

function _editImg(img,errorCb,successCb){
    let edit =(src)=>{
        this._model.request('sodaEditImg',{post:{img:src}},(data)=>{
            if(this._debug)
                console.log('sodaEditImg',data);
            
            if(data.error_code == '200'){
                this._statHandler.markSubmit(this._rawData.sid);
                this._rawData.img = data.data.submission.img;
                getHeadImg();
            }else{
                errorCb({api_error_code:data.error_code,msg:{id:"0",msg_list:MSG}});
            }
        });
    }
    
    let getHeadImg = ()=>{
        this.getHeadImg(
            (code)=>{
                errorCb({api_error_code:code,msg:{id:"2",msg_list:MSG}});
            },
            (path)=>{
                successCb({headImg:path,submissionImg:this._rawData.img})
            }
        );
    };

    this._uploadModel.request('uploadImgBase64',{post:{'module_type':'app','fileupload':img,'filetype':'png'}},(data)=>{
        if(this._debug)
            console.log('uploadImgBase64',data);

        if(data.error_code == '200'){
            let src = `/uploads/${this._token}/app/${data.data.pic}`;
            edit(src);
        }else{
            errorCb({api_error_code:data.error_code,msg:{id:"1",msg_list:MSG}});
        }  
    });

    
};

module.exports = _editImg;