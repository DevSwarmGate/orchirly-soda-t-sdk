const MSG ={
    "0":"活动PV统计",
    "1":"生成图片统计(包含用户重复提交)",
    "2":"新会员填资料",
    "3":"旧会员填资料"
};

class StatHandler{
    constructor(formId = 3){
        this._formId = formId;
        this._msgs = MSG;

        this._onRequest=(type,detail)=>{console.log('onRequest');}
    }

    set onRequest(cb){this._onRequest=cb;}

    markPV(){this._request(0,'');}
    markOld(){this._request(3,'');}
    markNew(){this._request(2,'');}
    //markUV(){this._request(1,'');}
    markSubmit(sId){this._request(1,sId);}
    
    _request(type,detail){this._onRequest(this._formId,type,detail);}
}

module.exports = StatHandler;