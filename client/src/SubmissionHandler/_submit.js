const MSG = {
    "0":"input error",
    "1":"api updateInfo error",
    "2":"api member error"
};

function _submit(errorCb,successCb){
    let propNames = ['name','address','phone','section'],
        post = {},
        isReqeust = true;

    let check =()=>{
        if(this.isMember && this.hasAddress)
            successCb();
    };

    if(!this.isMember){
        propNames.push('tel');
        propNames.push('authCode');
    }

    propNames.forEach(prop=>{
        if(!this[prop])
            return isReqeust = false;
        post[prop] = this[prop];
    });

    if(!isReqeust)
        return errorCb({api_error_code:'',msg:{id:"0",msg_list:MSG}});

    if(this.isMember){
        this._model.request('sodaUpdateInfo',{post:post},(data)=>{
            if(this._debug)
                console.log('sodaUpdateInfo',data);
            
            if(data.error_code == '200'){
                successCb();
            }else{
                errorCb({api_error_code:data.error_code,msg:{id:"1",msg_list:MSG}});
            }
        });
    }else{
        this._model.request('sodaMember',{post:post},(data)=>{
            if(this._debug)
                console.log('sodaMember',data);
            
            if(data.error_code == '200'){
                successCb();
            }else{
                errorCb({api_error_code:data.error_code,msg:{id:"2",msg_list:MSG}});
            }
        });
    }
};

module.exports = _submit;