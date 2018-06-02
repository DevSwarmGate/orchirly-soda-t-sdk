const   _checkIsMember = require('./_checkIsMember'),
        _editImg = require('./_editImg'),
        _getAuthCode = require('./_getAuthCode'),
        _getHeadImg = require('./_getHeadImg'),
        _submit = require('./_submit');

class SubmissionHandler{
    constructor(token,rawData,model,uploadModel){
        this._debug = false;
        this._token = token;
        this._rawData = rawData;
        this._memberTel = null;
        this._authCode = null;
        this._model = model;
        this._uploadModel = uploadModel;
    }

    set debug(bool){this._debug = bool;}

    get img(){return this._rawData.img;}
    get headImg(){}
    get isMember(){return _checkIsMember.call(this);}
    get hasAddress(){return !!this._rawData.address}

    get tel(){return this._memberTel;}
    set tel(tel){this._memberTel = tel;}

    get authCode(){return this._authCode;}
    set authCode(authCode){this._authCode = authCode;}

    get name(){return this._rawData.name;}
    set name(str){this._rawData.name=str;}

    get address(){return this._rawData.address;}
    set address(str){this._rawData.address=str;}

    get phone(){return this._rawData.phone;}
    set phone(str){this._rawData.phone=str;}

    get section(){return this._rawData.section;}
    set section(str){this._rawData.section=str;}

    submit(errorCb,successCb){_submit.call(this,errorCb,successCb);}
    editImg(base64Img,errorCb,successCb){_editImg.call(this,base64Img,errorCb,successCb);}
    getAuthCode(tel,errorCb,successCb){_getAuthCode.call(this,tel,errorCb,successCb);}
    getHeadImg(errorCb,successCb){_getHeadImg.call(this,errorCb,successCb);}
};

module.exports = SubmissionHandler;