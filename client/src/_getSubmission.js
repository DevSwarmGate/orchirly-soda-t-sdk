const   SubmissionHandler = require('./SubmissionHandler/SubmissionHandler');

function _getSubmission(errorCb,successCb){
    this._models.app.request('sodaStart',{},(data)=>{
        if(this._debug)
            console.log('_getSubmission sodaStart',data);
        
        if(data.error_code == '200'){
            let handler = new SubmissionHandler(this._token,data.data.submission,this._models.app,this._models.wechat,this._statHandler);

            handler.debug = this._debug;
            
            this._submissionHandler = handler;
            
            successCb(handler);
        }else{
            errorCb(data.error_code);
        }
    });
};

module.exports = _getSubmission;